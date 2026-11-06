import Model from "./model.js";
import HomeView from "./views/HomeView.js";
import LoginView from "./views/LoginView.js";
import SignupView from "./views/SignupView.js";
import ExploreView from "./views/ExploreView.js";
import MapView from "./views/MapView.js";
import DetailsView from "./views/DetailsView.js";
import FavoriteView from "./views/FavoriteView.js";
import ReservationView from "./views/ReservationView.js";
import ProfileView from "./views/ProfileView.js";
import GuestBookingsView from "./views/GuestBookingsView.js";
import AdminDashboardView from "./views/AdminDashboardView.js";
import AdminLodgesView from "./views/AdminLodgesView.js";
import AdminLocationsView from "./views/AdminLocationsView.js";
import AdminBookingsView from "./views/AdminBookingsView.js";
import AccessDeniedView from "./views/AccessDeniedView.js";
import View from "./views/View.js";

const viewTypes = {
  home: HomeView,
  dashboard: HomeView,
  login: LoginView,
  signup: SignupView,
  explore: ExploreView,
  map: MapView,
  details: DetailsView,
  favorites: FavoriteView,
  bookings: GuestBookingsView,
  reserve: ReservationView,
  profile: ProfileView,
  "admin-dashboard": AdminDashboardView,
  "admin-lodges": AdminLodgesView,
  "admin-locations": AdminLocationsView,
  "admin-bookings": AdminBookingsView
};

class Controller {
  constructor(root, model) {
    this.root = root;
    this.model = model;
    this.filters = { location: "", region: "", maxPrice: "10000", guests: "" };
    this.flash = "";
    this.root.addEventListener("click", event => this.handleClick(event));
    this.root.addEventListener("submit", event => this.handleSubmit(event));
    this.root.addEventListener("reset", event => this.handleReset(event));
    window.addEventListener("hashchange", () => {
      window.scrollTo(0, 0);
      this.render();
    });
    this.render();
  }

  currentRoute() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [path] = raw.split("?");
    const segments = path.split("/").filter(Boolean);
    const route = segments[0] === "admin"
      ? `admin-${segments[1] || "dashboard"}`
      : segments[0] === "lodges"
        ? "details"
        : segments[0] || "home";
    return {
      name: Object.hasOwn(viewTypes, route) ? route : "home",
      id: segments[0] === "admin" ? "" : segments[1] || ""
    };
  }

  render() {
    const route = this.currentRoute();
    const user = this.model.getCurrentUser();
    const isAdminRoute = route.name.startsWith("admin-");
    const requiresAdmin = isAdminRoute;
    const guestOnlyRoute = ["favorites", "bookings", "reserve"].includes(route.name);
    if ((requiresAdmin && user?.role !== "admin") || (guestOnlyRoute && user?.role === "admin")) {
      const page = new AccessDeniedView(this.root);
      page.render({ user });
      return;
    }
    if ((route.name === "dashboard" && user?.role === "admin")
      || (route.name === "home" && user?.role === "admin")) {
      this.go("admin");
      return;
    }
    if (user && (route.name === "login" || route.name === "signup")) {
      this.go(user.role === "admin" ? "admin" : "dashboard");
      return;
    }
    let lodges = [];
    let favorites = [];
    try {
      lodges = this.model.getLodges({ includeUnavailable: isAdminRoute });
      favorites = user?.role === "guest" ? this.model.getFavorites().map(lodge => lodge.id) : [];
    } catch (error) {
      this.flash = error.message;
    }
    const guestNavItems = [
      ["dashboard", "Home", "home"],
      ["explore", "Explore Lodges", "explore"],
      ["map", "Map", "map"],
      ["favorites", "Favorites", "favorites"],
      ["bookings", "Bookings", "bookings"],
      ["profile", "Profile", "profile"]
    ];
    const adminNavItems = [
      ["admin", "Admin Dashboard", "admin-dashboard"],
      ["admin/lodges", "Manage Lodges", "admin-lodges"],
      ["admin/locations", "Manage Locations", "admin-locations"],
      ["admin/bookings", "Manage Bookings", "admin-bookings"],
      ["profile", "Admin Profile", "profile"]
    ];
    const navItems = user?.role === "admin" ? adminNavItems : guestNavItems;
    this.root.innerHTML = `
      <header class="site-header">
        <div class="header-inner">
          <a class="brand" href="#/" aria-label="LodgeFinder home"><span class="brand-mark">⌂</span><span>Lodge<span>Finder</span></span></a>
          <button class="mobile-menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" data-action="menu">☰</button>
          <nav class="main-nav" aria-label="Main navigation">
            ${navItems.map(([path, label, name]) => `<a class="${route.name === name ? "active" : ""}" href="#/${path}">${label}</a>`).join("")}
          </nav>
          <div class="header-account">
            ${user ? `<a class="account-link ${route.name === "profile" ? "active" : ""}" href="#/profile"><span class="account-avatar">${View.escape(user.name.charAt(0).toUpperCase())}</span><span>${View.escape(user.name.split(" ")[0])}</span></a><button class="button button-quiet header-logout" type="button" data-action="logout">Log out</button>` : `<a class="login-link" href="#/login">Log in</a><a class="button button-primary header-signup" href="#/signup">Sign up</a>`}
          </div>
        </div>
      </header>
      <main id="page" class="page-container"></main>
      <footer class="site-footer"><div class="footer-inner"><a class="brand footer-brand" href="#/"><span class="brand-mark">⌂</span><span>Lodge<span>Finder</span></span></a><p>Find a little space to feel like yourself.</p><div class="footer-links">${user?.role === "admin" ? `<a href="#/admin/lodges">Manage lodges</a><a href="#/admin/bookings">Bookings</a>` : `<a href="#/explore">Explore</a><a href="#/map">Map</a><a href="#/favorites">Favorites</a>`}</div><small>© ${new Date().getFullYear()} LodgeFinder · ITPFE 1 school project</small></div></footer>
      <div class="toast ${this.flash ? "toast-visible" : ""}" role="status" aria-live="polite">${View.escape(this.flash)}</div>`;
    const ViewType = viewTypes[route.name];
    const view = new ViewType(this.root.querySelector("#page"));
    let data = {};
    if (route.name === "home" || route.name === "dashboard") data = { lodges, favorites };
    if (route.name === "login" || route.name === "signup") data = {};
    if (route.name === "explore") {
      const matching = lodges.filter(lodge => {
        const search = this.filters.location.trim().toLowerCase();
        return (!search || `${lodge.name} ${lodge.location} ${lodge.region}`.toLowerCase().includes(search))
          && (!this.filters.region || lodge.region === this.filters.region)
          && lodge.price <= Number(this.filters.maxPrice || 10000)
          && (!this.filters.guests || lodge.guests >= Number(this.filters.guests));
      });
      data = { lodges: matching, favorites, filters: this.filters };
    }
    if (route.name === "map") data = { lodges, favorites };
    if (route.name === "details") data = { lodge: this.model.getLodge(route.id), favorite: this.model.isFavorite(route.id), canFavorite: user?.role !== "admin" };
    if (route.name === "favorites") data = { lodges: user ? this.model.getFavorites() : [], signedIn: Boolean(user) };
    if (route.name === "bookings") data = { bookings: user ? this.model.getReservations() : [] };
    if (route.name === "reserve") data = { lodge: this.model.getLodge(route.id), user };
    if (route.name === "profile") data = { user, reservations: user?.role === "guest" ? this.model.getReservations() : [] };
    if (route.name === "admin-dashboard") data = { user, summary: this.model.getAdminSummary() };
    if (route.name === "admin-lodges") {
      const editId = new URLSearchParams(location.hash.split("?")[1] || "").get("edit");
      data = { lodges, editing: editId ? this.model.getLodge(editId, { includeUnavailable: true }) : null };
    }
    if (route.name === "admin-locations") data = { lodges };
    if (route.name === "admin-bookings") data = { bookings: this.model.getAllReservations() };
    view.render(data);
    if (this.flash) {
      window.setTimeout(() => {
        this.flash = "";
        this.root.querySelector(".toast")?.classList.remove("toast-visible");
      }, 3600);
    }
  }

  go(path, flash = "") {
    this.flash = flash;
    const next = `#/${path}`;
    if (location.hash === next) this.render();
    else location.hash = next;
  }

  message(form, text, isError = true) {
    const target = form.querySelector(".form-message");
    if (target) {
      target.textContent = text;
      target.classList.toggle("message-error", isError);
      target.classList.toggle("message-success", !isError);
    } else {
      this.flash = text;
      this.root.querySelector(".toast")?.classList.add("toast-visible");
      this.root.querySelector(".toast").textContent = text;
    }
  }

  handleClick(event) {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const name = action.dataset.action;
    if (name === "menu") {
      const nav = this.root.querySelector(".main-nav");
      const expanded = action.getAttribute("aria-expanded") === "true";
      action.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("nav-open", !expanded);
    }
    if (name === "logout") {
      this.model.logout();
      this.go("home", "You’ve signed out. See you next time.");
    }
    if (name === "favorite") {
      event.preventDefault();
      try {
        const added = this.model.toggleFavorite(action.dataset.id);
        this.render();
        this.flash = added ? "Added to your favorites." : "Removed from your favorites.";
        const toast = this.root.querySelector(".toast");
        toast.textContent = this.flash;
        toast.classList.add("toast-visible");
      } catch (error) {
        this.go("login", error.message);
      }
    }
    if (name === "clear-filters") {
      this.filters = { location: "", region: "", maxPrice: "10000", guests: "" };
      this.render();
    }
    if (name === "cancel-booking") {
      try {
        this.model.cancelReservation(action.dataset.id);
        this.go("bookings", "Your pending request was cancelled.");
      } catch (error) {
        this.notify(error.message);
      }
    }
    if (name === "delete-lodge" && window.confirm("Delete this lodge listing? Existing bookings will remain in booking history.")) {
      try {
        this.model.deleteLodge(action.dataset.id);
        this.go("admin/lodges", "Lodge listing deleted.");
      } catch (error) {
        this.notify(error.message);
      }
    }
    if (name === "booking-status") {
      try {
        this.model.updateReservationStatus(action.dataset.id, action.dataset.status);
        this.go("admin/bookings", `Booking ${action.dataset.status}.`);
      } catch (error) {
        this.notify(error.message);
      }
    }
    if (name === "remove-location" && window.confirm("Remove this lodge’s address and map coordinates?")) {
      try {
        this.model.removeLodgeLocation(action.dataset.id);
        this.go("admin/locations", "Lodge location removed.");
      } catch (error) {
        this.notify(error.message);
      }
    }
  }

  async handleSubmit(event) {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      switch (form.dataset.form) {
        case "search": {
          this.filters = { location: values.location || "", region: "", maxPrice: "10000", guests: values.guests || "" };
          this.go("explore");
          break;
        }
        case "filters":
          this.filters = {
            location: values.location || "",
            region: values.region || "",
            maxPrice: values.maxPrice || "10000",
            guests: values.guests || ""
          };
          this.render();
          break;
        case "login":
          await this.model.login(values);
          this.go(this.model.getCurrentUser().role === "admin" ? "admin" : "dashboard", "Welcome back!");
          break;
        case "signup":
          await this.model.register(values);
          this.go("dashboard", "Your LodgeFinder account is ready.");
          break;
        case "profile":
          this.model.updateProfile(values);
          this.go("profile", "Your details have been saved.");
          break;
        case "reservation": {
          const reservation = this.model.createReservation(values);
          this.go("bookings", `Booking request sent for ${reservation.lodge.name}.`);
          break;
        }
        case "admin-lodge": {
          const photo = form.elements.photo.files[0];
          if (photo) values.image = await this.readUploadedImage(photo);
          delete values.photo;
          const lodgeId = values.id;
          delete values.id;
          if (lodgeId) this.model.updateLodge(lodgeId, values);
          else this.model.addLodge(values);
          this.go("admin/lodges", lodgeId ? "Lodge changes saved." : "Lodge listing added.");
          break;
        }
        case "lodge-availability":
          this.model.updateLodgeAvailability(values.id, values.status);
          this.go("admin/lodges", "Lodge availability updated.");
          break;
        case "admin-location":
          this.model.updateLodgeLocation(values.id, values);
          this.go("admin/locations", "Lodge location updated.");
          break;
        default:
          break;
      }
    } catch (error) {
      this.message(form, error.message);
    }
  }

  readUploadedImage(file) {
    if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
    if (file.size > 1024 * 1024) throw new Error("Choose an image smaller than 1 MB.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.addEventListener("error", () => reject(new Error("The selected image could not be read.")));
      reader.readAsDataURL(file);
    });
  }

  notify(message) {
    this.flash = message;
    const toast = this.root.querySelector(".toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("toast-visible");
    }
  }

  handleReset(event) {
    if (event.target.dataset.form !== "filters") return;
    event.preventDefault();
    this.filters = { location: "", region: "", maxPrice: "10000", guests: "" };
    this.render();
  }
}

const app = document.querySelector("#app");
const model = new Model();
new Controller(app, model);
