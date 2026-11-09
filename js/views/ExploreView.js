import View from "./View.js";
import LodgeView from "./LodgeView.js";

export default class ExploreView extends View {
  template({ lodges = [], favorites = [], filters = {} }) {
    const e = View.escape;
    return `
      <section class="page-intro explore-intro"><div><span class="eyebrow">FIND YOUR NEXT ESCAPE</span><h1>Somewhere good awaits.</h1><p>Explore stays chosen for the way they make you feel.</p></div><a class="button button-secondary" href="#/map">⌖ &nbsp; View map</a></section>
      <form class="filter-bar" data-form="filters">
        <label class="filter-search"><span>⌕</span><input name="location" value="${e(filters.location || "")}" placeholder="Search by location or lodge"></label>
        <label class="filter-select"><span>REGION</span><select name="region"><option value="">Everywhere</option><option value="Luzon" ${filters.region === "Luzon" ? "selected" : ""}>Luzon</option><option value="Visayas & Islands" ${filters.region === "Visayas & Islands" ? "selected" : ""}>Visayas &amp; Islands</option></select></label>
        <label class="filter-price"><span>MAX PRICE / NIGHT</span><div><input name="maxPrice" type="range" min="1500" max="10000" step="500" value="${e(filters.maxPrice || "10000")}"><output>${View.money(Number(filters.maxPrice || 10000))}</output></div></label>
        <label class="filter-select"><span>GUESTS</span><select name="guests"><option value="">Any</option>${[1,2,3,4,5,6].map(n => `<option value="${n}" ${Number(filters.guests) === n ? "selected" : ""}>${n}+ guests</option>`).join("")}</select></label>
        <button class="button button-primary filter-button" type="submit">Apply filters</button>
        <button class="filter-reset" type="reset">Reset</button>
      </form>
      <div class="results-heading"><div><strong>${lodges.length} stays</strong><span> to inspire your next trip</span></div><a class="text-link" href="#/favorites">♡ Saved stays</a></div>
      ${lodges.length ? `<div class="lodge-grid explore-grid">${lodges.map(lodge => LodgeView.card(lodge, favorites.includes(lodge.id))).join("")}</div>` : `<div class="empty-state"><span>⌕</span><h2>No stays found just yet</h2><p>Try a different location or adjust your filters.</p><button class="button button-secondary" type="reset" data-action="clear-filters">Clear filters</button></div>`}
    `;
  }

  afterRender() {
    const price = this.root.querySelector('input[name="maxPrice"]');
    const output = this.root.querySelector("output");
    price?.addEventListener("input", () => { output.textContent = View.money(Number(price.value)); });
  }
}
