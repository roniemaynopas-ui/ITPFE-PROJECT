import View from "./View.js";

export default class DetailsView extends View {
  template({ lodge, favorite = false, canFavorite = true }) {
    if (!lodge) return `<div class="empty-state"><h2>We couldn’t find that stay.</h2><a class="button button-primary" href="#/explore">Explore lodges</a></div>`;
    const e = View.escape;
    return `
      <div class="details-back"><a class="text-link" href="#/explore">← &nbsp; Back to stays</a></div>
      <section class="details-heading"><div><span class="eyebrow">${e(lodge.type.toUpperCase())} · ${e(lodge.region.toUpperCase())}</span><h1>${e(lodge.name)}</h1><p>${e(lodge.location)} <span>·</span> <strong>★ ${e(lodge.rating)}</strong> (${e(lodge.reviews)} reviews)</p></div>${canFavorite ? `<button class="button button-secondary" type="button" data-action="favorite" data-id="${e(lodge.id)}">${favorite ? "♥ Saved" : "♡ Save"}</button>` : ""}</section>
      <div class="details-gallery"><img class="details-main-image" src="${e(lodge.image)}" alt="${e(lodge.name)}"><img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80" alt="Lodge interior"><img src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" alt="Surrounding nature"></div>
      <div class="details-columns"><article class="details-copy">
        <div class="details-host"><div class="host-avatar">${e(lodge.name.charAt(0))}</div><div><strong>A welcoming stay</strong><span>${e(lodge.guests)} guests · ${e(lodge.bedrooms)} ${lodge.bedrooms === 1 ? "bedroom" : "bedrooms"} · ${e(lodge.baths)} ${lodge.baths === 1 ? "bath" : "baths"}</span></div></div>
        <div class="detail-block"><h2>About this place</h2><p>${e(lodge.description)}</p></div>
        <div class="detail-block"><h2>What this place offers</h2><div class="amenities">${lodge.amenities.map(item => `<span>✓ &nbsp;${e(item)}</span>`).join("")}</div></div>
        <div class="detail-block"><h2>Where you’ll be</h2><p>${e(lodge.location)} · ${e(lodge.region)}</p><a class="button button-secondary" href="#/map">See on the map →</a></div>
      </article>
      <aside class="booking-card"><div class="booking-price"><strong>${View.money(lodge.price)}</strong> <span>/ night</span></div><p class="booking-rating">★ ${e(lodge.rating)} <span>· ${e(lodge.reviews)} reviews</span></p><a class="button button-primary button-full" href="#/reserve/${e(lodge.id)}">Reserve this stay <span>→</span></a><p class="booking-note">You won’t be charged yet</p></aside></div>
    `;
  }
}
