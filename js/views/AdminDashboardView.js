import View from "./View.js";

export default class AdminDashboardView extends View {
  template({ user, summary }) {
    const metrics = [
      ["Total lodges", summary.lodges, "⌂", "#/admin/lodges"],
      ["Available lodges", summary.availableLodges, "✓", "#/admin/lodges"],
      ["Unavailable lodges", summary.unavailableLodges, "—", "#/admin/lodges"],
      ["Booking requests", summary.bookings, "▤", "#/admin/bookings"],
      ["Pending", summary.pendingBookings, "◷", "#/admin/bookings"],
      ["Approved", summary.approvedBookings, "✓", "#/admin/bookings"],
      ["Rejected", summary.rejectedBookings, "×", "#/admin/bookings"]
    ];
    return `
      <section class="page-intro admin-page-intro"><div><span class="eyebrow">LODGEFINDER ADMINISTRATION</span><h1>Welcome, ${View.escape(user.name.split(" ")[0])}.</h1><p>Manage stays, locations, and guest booking requests.</p></div><span class="role-pill">ADMIN</span></section>
      <section class="admin-metrics">${metrics.map(([label, count, icon, href]) => `<a class="metric-card" href="${href}"><span class="metric-icon">${icon}</span><span class="metric-count">${count}</span><span class="metric-label">${label}</span></a>`).join("")}</section>
      <section class="admin-quick-links"><h2>Management</h2><div class="admin-actions"><a class="admin-action-card" href="#/admin/lodges"><span>⌂</span><div><strong>Manage lodges</strong><small>Add listings, edit prices and availability</small></div><b>→</b></a><a class="admin-action-card" href="#/admin/locations"><span>⌖</span><div><strong>Manage locations</strong><small>Update addresses and map coordinates</small></div><b>→</b></a><a class="admin-action-card" href="#/admin/bookings"><span>▤</span><div><strong>Manage bookings</strong><small>Review guest requests and booking status</small></div><b>→</b></a></div></section>
      <p class="demo-security-note">Demo only: role checks and credentials are stored in this browser. They are not production security.</p>
    `;
  }
}
