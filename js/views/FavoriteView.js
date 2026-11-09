import View from "./View.js";
import LodgeView from "./LodgeView.js";

export default class FavoriteView extends View {
  template({ lodges = [], signedIn = false }) {
    return `
      <section class="page-intro"><div><span class="eyebrow">YOUR LITTLE SHORTLIST</span><h1>Stays you love.</h1><p>Keep all your someday stays in one place.</p></div></section>
      ${!signedIn ? `<div class="empty-state"><span>♡</span><h2>Your saved stays live here.</h2><p>Sign in to keep track of the places you love.</p><a class="button button-primary" href="#/login">Sign in</a></div>` : lodges.length ? `<div class="lodge-grid">${lodges.map(lodge => LodgeView.card(lodge, true)).join("")}</div>` : `<div class="empty-state"><span>♡</span><h2>A little room for inspiration.</h2><p>Tap the heart on a stay to add it to your favorites.</p><a class="button button-primary" href="#/explore">Explore stays</a></div>`}
    `;
  }
}
