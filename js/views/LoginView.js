import View from "./View.js";

export default class LoginView extends View {
  template() {
    return `
      <section class="auth-page">
        <div class="auth-image" role="img" aria-label="A quiet home away from home"></div>
        <div class="auth-panel"><div class="auth-box">
          <span class="eyebrow">WELCOME BACK</span><h1>Good to see you.</h1><p class="auth-intro">Sign in to pick up right where your next getaway begins.</p>
          <form data-form="login" class="form-stack">
            <label>Email address<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
            <label>Password<input name="password" type="password" autocomplete="current-password" required minlength="6" placeholder="Enter your password"></label>
            <button class="button button-primary button-full" type="submit">Sign in <span>→</span></button>
            <p class="form-message" aria-live="polite"></p>
          </form>
          <aside class="demo-admin-access"><strong>Admin demo account</strong><span>admin@lodgefinder.com</span><span>Password: Admin123!</span></aside>
          <p class="auth-switch">New to LodgeFinder? <a href="#/signup">Create an account</a></p>
          <p class="auth-disclaimer">Demo only: account roles are stored in this browser, not protected by a server.</p>
        </div></div>
      </section>`;
  }
}
