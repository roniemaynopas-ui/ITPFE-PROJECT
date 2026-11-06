import View from "./View.js";

export default class ReservationView extends View {
  template({ lodge, user }) {
    if (!lodge) return `<div class="empty-state"><h2>We couldn’t find that stay.</h2><a class="button button-primary" href="#/explore">Explore lodges</a></div>`;
    const e = View.escape;
    return `
      <div class="details-back"><a class="text-link" href="#/lodges/${e(lodge.id)}">← &nbsp; Back to stay</a></div>
      <section class="reservation-page"><div class="reservation-main">
        <span class="eyebrow">YOUR GETAWAY IS CLOSE</span><h1>Request to book</h1>
        ${user ? `<p class="auth-intro">You’re booking as ${e(user.name)} (${e(user.email)}).</p>` : `<div class="notice">You’ll need an account to complete a reservation. <a href="#/login">Sign in</a> or <a href="#/signup">create one</a>.</div>`}
        <form data-form="reservation" class="form-stack reservation-form">
          <input type="hidden" name="lodgeId" value="${e(lodge.id)}">
          <div class="date-fields"><label>Check-in<input name="checkIn" type="date" required></label><label>Check-out<input name="checkOut" type="date" required></label></div>
          <label>Guests<select name="guests">${Array.from({ length: lodge.guests }, (_, index) => `<option value="${index + 1}">${index + 1} ${index === 0 ? "guest" : "guests"}</option>`).join("")}</select></label>
          <div class="cost-card"><div><span>${View.money(lodge.price)} × <span data-nights>0 nights</span></span><strong data-subtotal>${View.money(0)}</strong></div><div><span>Service fee (10%)</span><strong data-fee>${View.money(0)}</strong></div><hr><div class="cost-total"><span>Total</span><strong data-total>${View.money(0)}</strong></div></div>
          <button class="button button-primary button-full" type="submit" ${user ? "" : "disabled"}>Send booking request <span>→</span></button>
          <p class="booking-note">You won’t be charged in this demo.</p><p class="form-message" aria-live="polite"></p>
        </form>
      </div><aside class="booking-card reservation-summary"><img src="${e(lodge.image)}" alt="${e(lodge.name)}"><div><span class="eyebrow">${e(lodge.type)}</span><h2>${e(lodge.name)}</h2><p>${e(lodge.location)}</p><p class="booking-rating">★ ${e(lodge.rating)} · ${e(lodge.reviews)} reviews</p></div></aside></section>
    `;
  }

  afterRender({ lodge }) {
    if (!lodge) return;
    const form = this.root.querySelector('[data-form="reservation"]');
    const checkIn = form.elements.checkIn;
    const checkOut = form.elements.checkOut;
    const today = new Date();
    const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    checkIn.min = todayValue;
    checkOut.min = todayValue;
    const update = () => {
      const start = checkIn.value ? new Date(`${checkIn.value}T00:00:00`) : null;
      const end = checkOut.value ? new Date(`${checkOut.value}T00:00:00`) : null;
      const nights = start && end && end > start ? Math.round((end - start) / 86400000) : 0;
      const subtotal = nights * lodge.price;
      const fee = Math.round(subtotal * 0.1);
      this.root.querySelector("[data-nights]").textContent = `${nights} ${nights === 1 ? "night" : "nights"}`;
      this.root.querySelector("[data-subtotal]").textContent = View.money(subtotal);
      this.root.querySelector("[data-fee]").textContent = View.money(fee);
      this.root.querySelector("[data-total]").textContent = View.money(subtotal + fee);
      if (checkIn.value) checkOut.min = checkIn.value;
    };
    checkIn.addEventListener("change", update);
    checkOut.addEventListener("change", update);
    update();
  }
}
