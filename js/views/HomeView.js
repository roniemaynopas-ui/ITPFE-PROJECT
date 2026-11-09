import View from "./View.js";
import LodgeView from "./LodgeView.js";

export default class HomeView extends View {
  template({ lodges = [], favorites = [] }) {
    const featured = lodges.slice(0, 3);
    return `
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow"><span class="eyebrow-dot"></span> A better kind of getaway</span>
          <h1>Find your place<br>to <span>unwind.</span></h1>
          <p>Thoughtful stays, beautiful places, and the space to make every trip your own.</p>
          <form class="hero-search" data-form="search">
            <label class="search-location"><span>WHERE</span><input name="location" placeholder="Try Baguio, Palawan..." autocomplete="off"></label>
            <label><span>GUESTS</span><select name="guests"><option value="">Any guests</option><option>1</option><option>2</option><option>4</option><option>6</option></select></label>
            <button class="button button-primary search-submit" type="submit" aria-label="Search lodges">Search <span aria-hidden="true">→</span></button>
          </form>
          <div class="hero-note"><span class="avatar-stack"><i>J</i><i>M</i><i>A</i></span><span>Loved by <strong>2,000+</strong> happy travelers</span></div>
        </div>
        <div class="hero-visual">
          <img class="hero-image" src="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=90" alt="A cozy cabin tucked among the trees">
          <div class="hero-image-wash"></div>
          <div class="floating-note"><span class="floating-star">★</span><span><strong>4.9 / 5</strong><small>Guest-loved stays</small></span></div>
          <div class="floating-caption"><span class="caption-pin">⌖</span><span><small>Hidden in the hills</small><strong>Baguio, Philippines</strong></span></div>
        </div>
      </section>
      <section class="section section-trust">
        <div class="trust-item"><span class="trust-icon">⌂</span><div><strong>Handpicked stays</strong><small>Only the good ones make it in</small></div></div>
        <div class="trust-item"><span class="trust-icon">♡</span><div><strong>Made for memories</strong><small>Spaces that feel like somewhere</small></div></div>
        <div class="trust-item"><span class="trust-icon">↗</span><div><strong>Easy from start to stay</strong><small>Book your next escape in minutes</small></div></div>
      </section>
      <section class="section featured-section">
        <div class="section-heading"><div><span class="eyebrow">YOUR NEXT ESCAPE</span><h2>Stays worth staying for</h2><p>Places our community can’t stop talking about.</p></div><a class="text-link" href="#/explore">Explore all stays <span>→</span></a></div>
        <div class="lodge-grid">${featured.map(lodge => LodgeView.card(lodge, favorites.includes(lodge.id))).join("")}</div>
      </section>
      <section class="home-cta"><div><span class="eyebrow">A LITTLE MORE YOU, A LITTLE LESS EVERYWHERE</span><h2>Good trips start with a good place.</h2><p>Your next favorite stay is closer than you think.</p></div><a class="button button-white" href="#/explore">Find your stay <span>→</span></a></section>
    `;
  }
}
