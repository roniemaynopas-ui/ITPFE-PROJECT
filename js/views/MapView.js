import View from "./View.js";

export default class MapView extends View {
  template({ lodges = [], favorites = [] }) {
    return `
      <section class="page-intro map-intro"><div><span class="eyebrow">EXPLORE BY PLACE</span><h1>Find a stay on the map.</h1><p>Browse beautiful stays across the Philippines.</p></div><a class="button button-secondary" href="#/explore">☷ &nbsp; View list</a></section>
      <div class="map-layout"><div class="map-canvas" id="lodge-map" aria-label="Interactive map of LodgeFinder stays"></div>
        <aside class="map-side"><div class="map-side-heading"><strong>${lodges.length} stays</strong><span>on the map</span></div><div class="map-lodge-list">
          ${lodges.map(lodge => `<a class="map-lodge" href="#/lodges/${View.escape(lodge.id)}"><img src="${View.escape(lodge.image)}" alt=""><span><strong>${View.escape(lodge.name)}</strong><small>${View.escape(lodge.location)} · ${View.money(lodge.price)}/night</small></span><span class="rating">★ ${View.escape(lodge.rating)}</span></a>`).join("")}
        </div></aside>
      </div>
      <p class="map-attribution">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></p>
    `;
  }

  afterRender({ lodges = [], favorites = [] }) {
    const container = this.root.querySelector("#lodge-map");
    if (!globalThis.L) {
      container.innerHTML = `<div class="map-unavailable"><h2>Map tiles couldn’t load</h2><p>Check your internet connection. You can still browse all stays in the list.</p><a class="button button-secondary" href="#/explore">Browse stays</a></div>`;
      return;
    }
    const map = L.map(container, { scrollWheelZoom: false }).setView([12.1, 122.2], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const bounds = [];
    lodges.forEach(lodge => {
      if (!Array.isArray(lodge.coordinates) || lodge.coordinates.length !== 2
        || lodge.coordinates.some(value => value === null || value === "")
        || !Number.isFinite(Number(lodge.coordinates[0])) || !Number.isFinite(Number(lodge.coordinates[1]))) return;
      const marker = L.marker(lodge.coordinates).addTo(map);
      marker.bindPopup(`<a class="map-popup" href="#/lodges/${View.escape(lodge.id)}"><img src="${View.escape(lodge.image)}" alt=""><strong>${View.escape(lodge.name)}</strong><span>${View.money(lodge.price)} / night · ★ ${View.escape(lodge.rating)}</span></a>`);
      bounds.push(lodge.coordinates);
    });
    if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40] });
    else if (bounds.length === 1) map.setView(bounds[0], 10);
    this.map = map;
  }
}
