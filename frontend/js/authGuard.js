import Store from "./store.js";

const protectedPages = [
  "/frontend/addConsumption.html",
  "/frontend/historique.html",
  "/frontend/ranking.html",
  "/frontend/report.html",
  "/frontend/statistics.html"
];

const currentPath = window.location.pathname;
const isProtected = protectedPages.some(page =>
  currentPath.endsWith(page)
);

if (isProtected) {
  Store.subscribe((state) => {
    if (!state.user) {
      window.location.href = "login.html";
    }
  });
}
