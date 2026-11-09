import View from "./View.js";

export default class AdminLodgesView extends View {
  template({ lodges = [], editing = null }) {
    const e = View.escape;
    const lodge = editing || {};
    const coordinates = lodge.coordinates || ["", ""];
    return `
      <section class="page-intro admin-page-intro"><div><span class="eyebrow">ADMIN · LISTINGS</span><h1>Manage lodges.</h1><p>Add, update, and control the stays guests can book.</p></div><a class="button button-secondary" href="#/admin">Dashboard</a></section>
      <section class="admin-form-card"><div class="admin-form-heading"><div><span class="eyebrow">${editing ? "EDIT LISTING" : "NEW LISTING"}</span><h2>${editing ? `Update ${e(lodge.name)}` : "Add a lodge"}</h2></div>${editing ? `<a class="text-link" href="#/admin/lodges">Cancel edit</a>` : ""}</div>
        <form data-form="admin-lodge" class="admin-form-grid">
          <input type="hidden" name="id" value="${e(lodge.id || "")}">
          <label>Lodge name<input name="name" value="${e(lodge.name || "")}" required></label>
          <label>Listing type<input name="type" value="${e(lodge.type || "Lodge")}" required></label>
          <label>Nightly price (₱)<input name="price" type="number" min="1" step="1" value="${e(lodge.price ?? "")}" required></label>
          <label>Maximum guests<input name="guests" type="number" min="1" step="1" value="${e(lodge.guests ?? 2)}" required></label>
          <label>Bedrooms<input name="bedrooms" type="number" min="1" step="1" value="${e(lodge.bedrooms ?? 1)}" required></label>
          <label>Bathrooms<input name="baths" type="number" min="1" step="1" value="${e(lodge.baths ?? 1)}" required></label>
          <label>City<input name="city" value="${e(lodge.city || "")}" required></label>
          <label>Municipality<input name="municipality" value="${e(lodge.municipality || "")}" required></label>
          <label>Province<input name="province" value="${e(lodge.province || "")}" required></label>
          <label>Region<select name="region"><option value="Luzon" ${!lodge.region || lodge.region === "Luzon" ? "selected" : ""}>Luzon</option><option value="Visayas & Islands" ${lodge.region === "Visayas & Islands" ? "selected" : ""}>Visayas &amp; Islands</option></select></label>
          <label>Latitude<input name="latitude" type="number" min="-90" max="90" step="any" value="${e(coordinates[0])}" required></label>
          <label>Longitude<input name="longitude" type="number" min="-180" max="180" step="any" value="${e(coordinates[1])}" required></label>
          <label>Status<select name="status"><option value="available" ${!lodge.status || lodge.status === "available" ? "selected" : ""}>Available</option><option value="fully_booked" ${lodge.status === "fully_booked" ? "selected" : ""}>Fully Booked</option><option value="unavailable" ${lodge.status === "unavailable" ? "selected" : ""}>Unavailable</option></select></label>
          <label class="admin-span-two">Photo URL<input name="image" value="${e(lodge.image || "")}" placeholder="https://..."></label>
          <label class="admin-span-two">Or upload a photo<input name="photo" type="file" accept="image/*"><small>Images are stored in this browser; keep uploads under 1 MB.</small></label>
          <label class="admin-span-two">Description<textarea name="description" rows="3" required>${e(lodge.description || "")}</textarea></label>
          <label class="admin-span-two">Facilities / amenities <small>Separate items with commas.</small><input name="amenities" value="${e((lodge.amenities || []).join(", "))}"></label>
          <div class="admin-span-two admin-form-footer"><button class="button button-primary" type="submit">${editing ? "Save lodge changes" : "Add lodge"}</button><p class="form-message" aria-live="polite"></p></div>
        </form>
      </section>
      <section class="admin-table-section"><div class="section-heading"><div><span class="eyebrow">ALL LISTINGS</span><h2>${lodges.length} lodges</h2></div></div>
        <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Lodge</th><th>Price</th><th>Location</th><th>Availability</th><th>Actions</th></tr></thead><tbody>
          ${lodges.map(item => `<tr><td><div class="table-lodge"><img src="${e(item.image)}" alt=""><strong>${e(item.name)}</strong></div></td><td>${View.money(item.price)} / night</td><td>${e(item.location)}</td><td><span class="status-badge status-${e(item.status)}">${e(item.status.replace("_", " "))}</span></td><td><div class="table-actions"><a class="button button-secondary" href="#/admin/lodges?edit=${encodeURIComponent(item.id)}">Edit</a><button class="button button-quiet" type="button" data-action="delete-lodge" data-id="${e(item.id)}">Delete</button></div><form data-form="lodge-availability" class="availability-form"><input type="hidden" name="id" value="${e(item.id)}"><select name="status" aria-label="Availability for ${e(item.name)}"><option value="available" ${item.status === "available" ? "selected" : ""}>Available</option><option value="fully_booked" ${item.status === "fully_booked" ? "selected" : ""}>Fully booked</option><option value="unavailable" ${item.status === "unavailable" ? "selected" : ""}>Unavailable</option></select><button type="submit">Update</button></form></td></tr>`).join("")}
        </tbody></table></div>
      </section>
    `;
  }
}
