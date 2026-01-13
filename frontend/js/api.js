import { CONFIG } from "./constants.js";

const ApiService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    let response;

    try {
      response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });
    } catch (networkError) {
      console.error("Erreur réseau :", networkError);
      throw new Error("Impossible de contacter le serveur");
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message || `Erreur API (${response.status})`
      );
    }

    return data;
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  },
};

export default ApiService;

