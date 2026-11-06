import View from "./View.js";

export default class LodgeView extends View {
  template({ lodge, favorite = false }) {
    const e = View.escape;
    return `
      <article class="lodge-card">
        <a class="lodge-photo-link" href="#/lodges/${e(lodge.id)}" aria-label="View ${e(lodge.name)}">
          <img class="lodge-photo" src="${e(lodge.image)}" alt="${e(lodge.name)}" loading="lazy">
        </a>
        <button class="favorite-toggle ${favorite ? "is-favorite" : ""}" type="button" data-action="favorite" data-id="${e(lodge.id)}" aria-label="${favorite ? "Remove from" : "Add to"} favorites">
          <span aria-hidden="true">${favorite ? "♥" : "♡"}</span>
        </button>
        <a class="lodge-card-content" href="#/lodges/${e(lodge.id)}">
          <div class="lodge-card-heading"><h3>${e(lodge.name)}</h3><span class="rating">★ ${e(lodge.rating)}</span></div>
          <p>${e(lodge.location)}</p>
          <p class="lodge-meta">${e(lodge.guests)} guests · ${e(lodge.bedrooms)} ${lodge.bedrooms === 1 ? "bedroom" : "bedrooms"} · ${e(lodge.type)}</p>
          <p class="lodge-price"><strong>${View.money(lodge.price)}</strong> <span>/ night</span></p>
        </a>
      </article>`;
  }

  static card(lodge, favorite = false) {
    return new LodgeView(document.createElement("div")).template({ lodge, favorite });
  }
}
