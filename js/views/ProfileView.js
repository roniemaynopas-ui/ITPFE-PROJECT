import View from "./View.js";

export default class ProfileView extends View {
  template({ user, reservations = [] }) {
    if (!user) return `<div class="empty-state"><span>☺</span><h2>Your account is waiting.</h2><p>Sign in to view your profile and reservations.</p><a class="button button-primary" href="#/login">Sign in</a></div>`;
    const e = View.escape;
    return `
      <section class="page-intro"><div><span class="eyebrow">${user.role === "admin" ? "LODGEFINDER ADMIN" : "YOUR LODGEFINDER"}</span><h1>Hello, ${e(user.name.split(" ")[0])}.</h1><p>${user.role === "admin" ? "Manage your administrator profile." : "Your profile and trips, all in one place."}</p></div><span class="role-pill">${e(user.role.toUpperCase())}</span></section>
      <div class="profile-layout"><section class="profile-card"><div class="profile-avatar">${e(user.name.charAt(0).toUpperCase())}</div><h2>Your details</h2><form data-form="profile" class="form-stack"><label>Full name<input name="name" value="${e(user.name)}" required minlength="2"></label><label>Email address<input value="${e(user.email)}" disabled></label><label>Location<input name="location" value="${e(user.location)}" placeholder="City, country"></label><button class="button button-primary" type="submit">Save changes</button><p class="form-message" aria-live="polite"></p></form><button class="button button-quiet" data-action="logout" type="button">Sign out</button></section>
      ${user.role === "guest" ? `<section class="trips-section"><div class="section-heading"><div><span class="eyebrow">YOUR PLANS</span><h2>Reservations</h2></div><a class="text-link" href="#/bookings">View all bookings →</a></div>
      ${reservations.length ? `<div class="reservation-list">${reservations.map(reservation => `<article class="reservation-item"><img src="${e(reservation.lodge?.image || "")}" alt=""><div><h3>${e(reservation.lodge?.name || "Removed lodge listing")}</h3><p>${e(reservation.lodge?.location || "Location unavailable")}</p><span>${e(reservation.checkIn)} → ${e(reservation.checkOut)} · ${e(reservation.nights)} ${reservation.nights === 1 ? "night" : "nights"}</span></div><strong>${View.money(reservation.total)}</strong></article>`).join("")}</div>` : `<div class="empty-state compact-empty"><span>↗</span><h2>No trips on the calendar yet.</h2><p>Find a stay that feels like you.</p><a class="button button-secondary" href="#/explore">Explore stays</a></div>`}
      </section>` : `<section class="trips-section"><div class="profile-card"><h2>Administrator access</h2><p>Use your role-based dashboard to manage lodge listings, locations, and guest booking requests.</p><a class="button button-primary" href="#/admin">Open admin dashboard</a></div></section>`}</div>
    `;
  }
}
