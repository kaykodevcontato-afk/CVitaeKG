/* Registro da PWA, isolado do código do editor. */
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
      .catch((error) => console.warn("PWA não registrada:", error));
  });
}
