const STORAGE_KEY = "lodgefinder-data-v1";

const initialLodges = [
  {
    id: "pine-haven",
    name: "Pine Haven Retreat",
    location: "Baguio City, Benguet",
    region: "Luzon",
    price: 3850,
    rating: 4.92,
    reviews: 128,
    guests: 4,
    bedrooms: 2,
    baths: 1,
    type: "Cabin",
    status: "available",
    coordinates: [16.4023, 120.596],
    city: "Baguio City",
    municipality: "Baguio City",
    province: "Benguet",
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85",
    description: "Wake up among the pines in this warm, thoughtfully designed hideaway. Enjoy slow mornings on the deck, crisp mountain air, and the best of Baguio just a short drive away.",
    amenities: ["Mountain view", "Kitchen", "Wi-Fi", "Free parking", "Fireplace"]
  },
  {
    id: "twin-lakes",
    name: "The Lakehouse at Twin Lakes",
    location: "Laurel, Batangas",
    region: "Luzon",
    price: 6200,
    rating: 4.88,
    reviews: 96,
    guests: 6,
    bedrooms: 3,
    baths: 2,
    type: "Villa",
    status: "available",
    coordinates: [14.1022, 120.9078],
    city: "Laurel",
    municipality: "Laurel",
    province: "Batangas",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
    description: "A peaceful lakeside home with wide-open views of Taal. Gather for dinner on the terrace, spend the day exploring nearby trails, and end the evening under a sky full of stars.",
    amenities: ["Lake view", "Pool", "Kitchen", "Wi-Fi", "BBQ grill"]
  },
  {
    id: "cove-house",
    name: "Cove House El Nido",
    location: "El Nido, Palawan",
    region: "Visayas & Islands",
    price: 7900,
    rating: 4.97,
    reviews: 214,
    guests: 4,
    bedrooms: 2,
    baths: 2,
    type: "Beach house",
    status: "available",
    coordinates: [11.1956, 119.402],
    city: "El Nido",
    municipality: "El Nido",
    province: "Palawan",
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=85",
    description: "A bright coastal hideaway just steps from the water. Start your day with coffee and sea air, then set off for island hopping, hidden lagoons, and unforgettable sunsets.",
    amenities: ["Beach access", "Sea view", "Kitchen", "Air conditioning", "Airport transfer"]
  },
  {
    id: "sierra-cabin",
    name: "Sierra Cabin",
    location: "Tanay, Rizal",
    region: "Luzon",
    price: 4500,
    rating: 4.83,
    reviews: 75,
    guests: 5,
    bedrooms: 2,
    baths: 1,
    type: "Cabin",
    status: "available",
    coordinates: [14.4974, 121.2852],
    city: "Tanay",
    municipality: "Tanay",
    province: "Rizal",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=85",
    description: "Trade city noise for mountain mornings at this modern cabin in the clouds. A generous deck, cozy interiors, and scenic hikes make it easy to settle into the slower pace.",
    amenities: ["Mountain view", "Kitchen", "Free parking", "Fire pit", "Pet friendly"]
  },
  {
    id: "siargao-slow",
    name: "Slow Tide Surf Lodge",
    location: "General Luna, Siargao",
    region: "Visayas & Islands",
    price: 5200,
    rating: 4.9,
    reviews: 143,
    guests: 3,
    bedrooms: 1,
    baths: 1,
    type: "Lodge",
    status: "available",
    coordinates: [9.7972, 126.158],
    city: "General Luna",
    municipality: "General Luna",
    province: "Surigao del Norte",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=85",
    description: "An easygoing island stay with thoughtful comforts and room to recharge after a day in the surf. Local cafes and the beach are an easy stroll away.",
    amenities: ["Near the beach", "Wi-Fi", "Air conditioning", "Garden", "Surfboard rental"]
  },
  {
    id: "cebu-garden",
    name: "Casa Verde Garden Stay",
    location: "Moalboal, Cebu",
    region: "Visayas & Islands",
    price: 3100,
    rating: 4.79,
    reviews: 61,
    guests: 2,
    bedrooms: 1,
    baths: 1,
    type: "Guesthouse",
    status: "available",
    coordinates: [9.9433, 123.3997],
    city: "Moalboal",
    municipality: "Moalboal",
    province: "Cebu",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85",
    description: "A calm, leafy guesthouse close to Moalboal's famous shore. Spend your days snorkeling, discovering waterfalls, or simply unwinding in the garden.",
    amenities: ["Garden", "Wi-Fi", "Air conditioning", "Free parking", "Breakfast"]
  }
];

function makeInitialState() {
  return {
    lodges: initialLodges,
    users: [],
    currentUser: null,
    favorites: {},
    reservations: [],
    nextLodgeId: 1
  };
}

async function passwordDigest(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export default class Model {
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
    const saved = this.storage.getItem(STORAGE_KEY);
    this.state = saved === null ? makeInitialState() : JSON.parse(saved);
    this.migrateState();
    this.save();
    this.adminSetup = this.ensureDefaultAdmin();
  }

  migrateState() {
    this.state.lodges ||= initialLodges.map(lodge => ({ ...lodge, amenities: [...lodge.amenities], coordinates: [...lodge.coordinates] }));
    this.state.users ||= [];
    this.state.favorites ||= {};
    this.state.reservations ||= [];
    this.state.nextLodgeId ||= 1;
    this.state.lodges.forEach(lodge => {
      lodge.status ||= "available";
      lodge.coordinates ||= [0, 0];
      lodge.amenities ||= [];
      lodge.city ||= lodge.location || "";
      lodge.municipality ||= lodge.city;
      lodge.province ||= "";
    });
    this.state.users.forEach(user => {
      user.role = user.email === "admin@lodgefinder.com" ? "admin" : (user.role === "admin" ? "admin" : "guest");
      user.location ||= "";
    });
    this.state.reservations.forEach(reservation => {
      reservation.status ||= "approved";
      reservation.guestName ||= this.state.users.find(user => user.email === reservation.guestEmail)?.name || reservation.guestEmail;
      reservation.lodgeSnapshot ||= this.state.lodges.find(lodge => lodge.id === reservation.lodgeId) || null;
    });
  }

  async ensureDefaultAdmin() {
    const email = "admin@lodgefinder.com";
    let admin = this.state.users.find(user => user.email === email);
    if (!admin) {
      admin = {
        name: "LodgeFinder Admin",
        email,
        passwordHash: await passwordDigest("Admin123!"),
        role: "admin",
        location: ""
      };
      this.state.users.push(admin);
    } else {
      admin.role = "admin";
      admin.passwordHash = await passwordDigest("Admin123!");
    }
    this.save();
  }

  currentAccount() {
    return this.state.users.find(user => user.email === this.state.currentUser) || null;
  }

  requireRole(role) {
    const user = this.currentAccount();
    if (!user || user.role !== role) {
      throw new Error(role === "admin" ? "Unauthorized access. An admin account is required." : "This action is only available to guest accounts.");
    }
    return user;
  }

  requireAdmin() {
    return this.requireRole("admin");
  }

  requireGuest() {
    return this.requireRole("guest");
  }

  save() {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.state));
  }

  copyLodge(lodge) {
    return lodge ? { ...lodge, amenities: [...lodge.amenities], coordinates: [...lodge.coordinates] } : null;
  }

  getLodges({ includeUnavailable = false } = {}) {
    if (includeUnavailable) this.requireAdmin();
    const lodges = includeUnavailable ? this.state.lodges : this.state.lodges.filter(lodge => lodge.status === "available");
    return lodges.map(lodge => this.copyLodge(lodge));
  }

  getLodge(id, { includeUnavailable = false } = {}) {
    if (includeUnavailable) this.requireAdmin();
    const lodge = this.state.lodges.find(item => item.id === id);
    if (lodge && !includeUnavailable && lodge.status !== "available") return null;
    return this.copyLodge(lodge);
  }

  getCurrentUser() {
    if (!this.state.currentUser) return null;
    const user = this.state.users.find(item => item.email === this.state.currentUser);
    return user ? { name: user.name, email: user.email, location: user.location || "", role: user.role } : null;
  }

  async register({ name, email, password }) {
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail === "admin@lodgefinder.com") {
      throw new Error("That email address is reserved for the LodgeFinder admin demo account.");
    }
    if (this.state.users.some(user => user.email === normalizedEmail)) {
      throw new Error("An account with this email already exists.");
    }
    if (!name?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || password.length < 6) {
      throw new Error("Enter a name, valid email address, and password with at least 6 characters.");
    }
    this.state.users.push({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await passwordDigest(password),
      location: "",
      role: "guest"
    });
    this.state.currentUser = normalizedEmail;
    this.state.favorites[normalizedEmail] = this.state.favorites[normalizedEmail] || [];
    this.save();
    return this.getCurrentUser();
  }

  async login({ email, password }) {
    await this.adminSetup;
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.state.users.find(item => item.email === normalizedEmail);
    if (!user || user.passwordHash !== await passwordDigest(password)) {
      throw new Error("The email or password is incorrect.");
    }
    this.state.currentUser = normalizedEmail;
    this.save();
    return this.getCurrentUser();
  }

  logout() {
    this.state.currentUser = null;
    this.save();
  }

  updateProfile({ name, location }) {
    const user = this.currentAccount();
    if (!user) throw new Error("Please sign in to update your profile.");
    if (!name?.trim()) throw new Error("Enter a name for your profile.");
    user.name = name.trim();
    user.location = location.trim();
    this.save();
    return this.getCurrentUser();
  }

  getFavorites() {
    const email = this.state.currentUser;
    if (!email) return [];
    const ids = this.state.favorites[email] || [];
    return ids.map(id => this.getLodge(id)).filter(Boolean);
  }

  isFavorite(id) {
    const email = this.state.currentUser;
    return Boolean(email && (this.state.favorites[email] || []).includes(id));
  }

  toggleFavorite(id) {
    const user = this.requireGuest();
    const email = user.email;
    if (!this.getLodge(id)) throw new Error("This lodge is not available.");
    const current = this.state.favorites[email] || [];
    this.state.favorites[email] = current.includes(id)
      ? current.filter(item => item !== id)
      : [...current, id];
    this.save();
    return this.state.favorites[email].includes(id);
  }

  createReservation({ lodgeId, checkIn, checkOut, guests }) {
    const account = this.requireGuest();
    const lodge = this.getLodge(lodgeId);
    if (!lodge) throw new Error("This lodge is no longer available.");
    const start = new Date(`${checkIn}T00:00:00Z`);
    const end = new Date(`${checkOut}T00:00:00Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())
      || start.toISOString().slice(0, 10) !== checkIn
      || end.toISOString().slice(0, 10) !== checkOut) {
      throw new Error("Choose valid check-in and check-out dates.");
    }
    const nights = Math.round((end - start) / 86400000);
    const guestCount = Number(guests);
    if (!Number.isInteger(nights) || nights < 1) throw new Error("Choose a check-out date after check-in.");
    if (checkIn < new Date().toISOString().slice(0, 10)) throw new Error("Choose a check-in date that is today or later.");
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > lodge.guests) {
      throw new Error(`Choose between 1 and ${lodge.guests} guests.`);
    }
    const subtotal = lodge.price * nights;
    const serviceFee = Math.round(subtotal * 0.1);
    const reservation = {
      id: `res-${Date.now()}`,
      lodgeId,
      guestEmail: account.email,
      guestName: account.name,
      checkIn,
      checkOut,
      guests: guestCount,
      nights,
      subtotal,
      serviceFee,
      total: subtotal + serviceFee,
      status: "pending",
      lodgeSnapshot: lodge,
      createdAt: new Date().toISOString()
    };
    this.state.reservations.push(reservation);
    this.save();
    return { ...reservation, lodge };
  }

  getReservations() {
    const user = this.requireGuest();
    return this.state.reservations
      .filter(item => item.guestEmail === user.email)
      .map(item => ({ ...item, lodge: this.copyLodge(this.state.lodges.find(lodge => lodge.id === item.lodgeId) || item.lodgeSnapshot) }))
      .reverse();
  }

  cancelReservation(reservationId) {
    const user = this.requireGuest();
    const reservation = this.state.reservations.find(item => item.id === reservationId && item.guestEmail === user.email);
    if (!reservation) throw new Error("That booking was not found in your account.");
    if (reservation.status !== "pending") throw new Error("Only pending booking requests can be cancelled.");
    reservation.status = "cancelled";
    this.save();
    return { ...reservation };
  }

  getAdminSummary() {
    this.requireAdmin();
    const bookings = this.state.reservations;
    return {
      lodges: this.state.lodges.length,
      availableLodges: this.state.lodges.filter(lodge => lodge.status === "available").length,
      unavailableLodges: this.state.lodges.filter(lodge => lodge.status !== "available").length,
      bookings: bookings.length,
      pendingBookings: bookings.filter(item => item.status === "pending").length,
      approvedBookings: bookings.filter(item => item.status === "approved").length,
      rejectedBookings: bookings.filter(item => item.status === "rejected").length
    };
  }

  getAllReservations() {
    this.requireAdmin();
    return this.state.reservations.map(item => ({
      ...item,
      lodge: this.copyLodge(this.state.lodges.find(lodge => lodge.id === item.lodgeId) || item.lodgeSnapshot)
    })).reverse();
  }

  updateReservationStatus(reservationId, status) {
    this.requireAdmin();
    if (!["approved", "rejected"].includes(status)) throw new Error("Choose an approved or rejected status.");
    const reservation = this.state.reservations.find(item => item.id === reservationId);
    if (!reservation) throw new Error("Booking request not found.");
    if (reservation.status !== "pending") throw new Error("Only pending booking requests can be reviewed.");
    reservation.status = status;
    this.save();
    return { ...reservation };
  }

  addLodge(values) {
    this.requireAdmin();
    const lodge = this.validateLodge(values);
    lodge.id = `lodge-${Date.now()}-${this.state.nextLodgeId++}`;
    lodge.rating = 0;
    lodge.reviews = 0;
    this.state.lodges.push(lodge);
    this.save();
    return this.copyLodge(lodge);
  }

  updateLodge(id, values) {
    this.requireAdmin();
    const lodge = this.state.lodges.find(item => item.id === id);
    if (!lodge) throw new Error("Lodge listing not found.");
    Object.assign(lodge, this.validateLodge(values));
    this.save();
    return this.copyLodge(lodge);
  }

  validateLodge(values) {
    const price = Number(values.price);
    const guests = Number(values.guests);
    const bedrooms = Number(values.bedrooms);
    const baths = Number(values.baths);
    const latitude = Number(values.latitude);
    const longitude = Number(values.longitude);
    if (!values.name?.trim() || !values.description?.trim() || !values.image?.trim()
      || !values.city?.trim() || !values.municipality?.trim() || !values.province?.trim()) {
      throw new Error("Complete the lodge name, description, photo, and location fields.");
    }
    if (!Number.isFinite(price) || price < 1 || !Number.isInteger(guests) || guests < 1
      || !Number.isInteger(bedrooms) || bedrooms < 1 || !Number.isInteger(baths) || baths < 1) {
      throw new Error("Enter a valid nightly price, guest capacity, bedroom count, and bathroom count.");
    }
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90
      || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      throw new Error("Enter valid map coordinates.");
    }
    if (!["available", "fully_booked", "unavailable"].includes(values.status)) {
      throw new Error("Choose Available, Fully Booked, or Unavailable.");
    }
    if (!["Luzon", "Visayas & Islands"].includes(values.region)) throw new Error("Choose a valid region.");
    return {
      name: values.name.trim(),
      description: values.description.trim(),
      location: `${values.city.trim()}, ${values.province.trim()}`,
      region: values.region,
      city: values.city.trim(),
      municipality: values.municipality.trim(),
      province: values.province.trim(),
      price,
      guests,
      bedrooms,
      baths,
      type: values.type?.trim() || "Lodge",
      status: values.status,
      image: values.image.trim(),
      coordinates: [latitude, longitude],
      amenities: String(values.amenities || "").split(",").map(item => item.trim()).filter(Boolean)
    };
  }

  deleteLodge(id) {
    this.requireAdmin();
    if (!this.state.lodges.some(lodge => lodge.id === id)) throw new Error("Lodge listing not found.");
    this.state.lodges = this.state.lodges.filter(lodge => lodge.id !== id);
    this.save();
  }

  updateLodgeLocation(id, { city, municipality, province, latitude, longitude }) {
    this.requireAdmin();
    const lodge = this.state.lodges.find(item => item.id === id);
    if (!lodge) throw new Error("Lodge listing not found.");
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!city?.trim() || !municipality?.trim() || !province?.trim()
      || !Number.isFinite(lat) || lat < -90 || lat > 90
      || !Number.isFinite(lng) || lng < -180 || lng > 180) {
      throw new Error("Enter a complete address and valid latitude and longitude.");
    }
    lodge.city = city.trim();
    lodge.municipality = municipality.trim();
    lodge.province = province.trim();
    lodge.location = `${lodge.city}, ${lodge.province}`;
    lodge.coordinates = [lat, lng];
    this.save();
    return this.copyLodge(lodge);
  }

  removeLodgeLocation(id) {
    this.requireAdmin();
    const lodge = this.state.lodges.find(item => item.id === id);
    if (!lodge) throw new Error("Lodge listing not found.");
    lodge.city = "";
    lodge.municipality = "";
    lodge.province = "";
    lodge.location = "";
    lodge.coordinates = [null, null];
    this.save();
  }

  updateLodgeAvailability(id, status) {
    this.requireAdmin();
    if (!["available", "fully_booked", "unavailable"].includes(status)) {
      throw new Error("Choose Available, Fully Booked, or Unavailable.");
    }
    const lodge = this.state.lodges.find(item => item.id === id);
    if (!lodge) throw new Error("Lodge listing not found.");
    lodge.status = status;
    this.save();
    return this.copyLodge(lodge);
  }
}
