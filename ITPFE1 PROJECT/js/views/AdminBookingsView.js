import View from "./View.js";

export default class AdminBookingsView extends View {
  template({ bookings = [] }) {
    const e = View.escape;
    return `
      <section class="page-intro admin-page-intro"><div><span class="eyebrow">ADMIN · GUEST REQUESTS</span><h1>Manage bookings.</h1><p>Review guest details, dates, and booking request totals.</p></div><a class="button button-secondary" href="#/admin">Dashboard</a></section>
      ${bookings.length ? `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Guest</th><th>Lodge</th><th>Dates / Guests</th><th>Total</th><th>Status / Action</th></tr></thead><tbody>${bookings.map(booking => `<tr><td><strong>${e(booking.guestName)}</strong><small class="table-subtext">${e(booking.guestEmail)}</small></td><td>${e(booking.lodge?.name || "Removed lodge listing")}<small class="table-subtext">${e(booking.lodge?.location || "")}</small></td><td>${e(booking.checkIn)} → ${e(booking.checkOut)}<small class="table-subtext">${e(booking.nights)} nights · ${e(booking.guests)} guests</small></td><td>${View.money(booking.total)}</td><td><span class="status-badge status-${e(booking.status)}">${e(booking.status)}</span>${booking.status === "pending" ? `<div class="table-actions"><button class="button button-primary" type="button" data-action="booking-status" data-id="${e(booking.id)}" data-status="approved">Approve</button><button class="button button-quiet" type="button" data-action="booking-status" data-id="${e(booking.id)}" data-status="rejected">Reject</button></div>` : ""}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state"><span>▤</span><h2>No booking requests yet.</h2><p>Guest requests will appear here for review.</p></div>`}
    `;
  }
}
