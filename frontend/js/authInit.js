import Store from "./store.js";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

if (token && user) {
  Store.setState({ user });
}
