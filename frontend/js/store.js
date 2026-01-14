const Store = {
  // 🔹 État partagé
  state: {
    user: null,          // utilisateur connecté
    todayStats: {        // stats du jour
      sugar: 0,
      caffeine: 0,
      calories: 0
    },
    consumptions: []     // tableau des consommations du jour ou historique
  },

  // 🔹 Liste de listeners (fonctions qui réagissent aux changements)
  listeners: [],

  // 🔹 Mettre à jour l'état
  setState(newState) {
    this.state = { ...this.state, ...newState };
    // appeler tous les listeners avec le nouvel état
    this.listeners.forEach(fn => fn(this.state));
  },

  // 🔹 S'abonner aux changements d'état
  subscribe(fn) {
    this.listeners.push(fn);
    // retourner une fonction pour se désabonner si nécessaire
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  },

  // 🔹 Optionnel : réinitialiser l'état
  reset() {
    this.state = {
      user: null,
      todayStats: { sugar: 0, caffeine: 0, calories: 0 },
      consumptions: []
    };
    this.listeners.forEach(fn => fn(this.state));
  }
};

export default Store;
