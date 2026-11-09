import View from "./View.js";

export default class AccessDeniedView extends View {
  template({ user }) {
    const destination = user?.role === "admin" ? "admin" : "dashboard";
    return `<div class="empty-state access-denied"><span>⛨</span><h2>Unauthorized Access</h2><p>This area is only available to LodgeFinder administrators.</p><a class="button button-primary" href="#/${destination}">Return to your dashboard</a></div>`;
  }
}
