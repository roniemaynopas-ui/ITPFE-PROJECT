import View from "./View.js";

export default class AdminLocationsView extends View {
  template({ lodges = [] }) {
    const e = View.escape;
    return `
      <section class="page-intro admin-page-intro"><div><span class="eyebrow">ADMIN · MAP DATA</span><h1>Manage locations.</h1><p>Maintain lodge addresses and the coordinates used on the map.</p></div><a class="button button-secondary" href="#/admin">Dashboard</a></section>
      <div class="location-admin-list">${lodges.map(lodge => `<article class="location-admin-card"><div class="location-admin-title"><div><span class="eyebrow">${e(lodge.status.toUpperCase())}</span><h2>${e(lodge.name)}</h2><p>${e(lodge.location || "No location set")}</p></div><a class="text-link" href="#/admin/lodges?edit=${encodeURIComponent(lodge.id)}">Edit listing</a></div>
        <form data-form="admin-location" class="admin-form-grid">
          <input type="hidden" name="id" value="${e(lodge.id)}">
          <label>City<input name="city" value="${e(lodge.city)}" required></label>
          <label>Municipality<input name="municipality" value="${e(lodge.municipality)}" required></label>
          <label>Province<input name="province" value="${e(lodge.province)}" required></label>
          <label>Latitude<input name="latitude" type="number" min="-90" max="90" step="any" value="${e(lodge.coordinates[0] ?? "")}" required></label>
          <label>Longitude<input name="longitude" type="number" min="-180" max="180" step="any" value="${e(lodge.coordinates[1] ?? "")}" required></label>
          <div class="admin-form-footer"><button class="button button-primary" type="submit">Save location</button><button class="button button-quiet" type="button" data-action="remove-location" data-id="${e(lodge.id)}">Remove location</button><p class="form-message" aria-live="polite"></p></div>
        </form>
      </article>`).join("")}</div>
    `;
  }
}
