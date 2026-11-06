import View from "./View.js";

export default class GuestBookingsView extends View {
  template({ bookings = [] }) {
    const e = View.escape;
    return `
      <section class="page-intro"><div><span class="eyebrow">YOUR TRIPS</span><h1>My bookings.</h1><p>Track your booking requests and upcoming stays.</p></div><a class="button button-secondary" href="#/explore">Explore lodges</a></section>
      ${bookings.length ? `<div class="role-list">${bookings.map(booking => `
        <article class="role-record booking-record">
          <img src="${e(booking.lodge?.image || "")}" alt="${e(booking.lodge?.name || "Lodge")}">
          <div class="role-record-main"><h2>${e(booking.lodge?.name || "Removed lodge listing")}</h2><p>${e(booking.lodge?.location || "Location unavailable")}</p><p>${e(booking.checkIn)} → ${e(booking.checkOut)} · ${e(booking.nights)} ${booking.nights === 1 ? "night" : "nights"} · ${e(booking.guests)} ${booking.guests === 1 ? "guest" : "guests"}</p><span class="status-badge status-${e(booking.status)}">${e(booking.status)}</span></div>
          <div class="role-record-side"><strong>${View.money(booking.total)}</strong>${booking.status === "pending" ? `<button class="button button-secondary" type="button" data-action="cancel-booking" data-id="${e(booking.id)}">Cancel request</button>` : ""}</div>
        </article>`).join("")}</div>` : `<div class="empty-state"><span>↗</span><h2>No bookings yet.</h2><p>Your booking requests will appear here.</p><a class="button button-primary" href="#/explore">Find a stay</a></div>`}
    `;
  }
}
