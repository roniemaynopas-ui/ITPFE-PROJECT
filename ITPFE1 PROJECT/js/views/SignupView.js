import View from "./View.js";

export default class SignupView extends View {
  template() {
    return `
      <section class="auth-page">
        <div class="auth-image auth-image-signup" role="img" aria-label="A welcoming escape in nature"></div>
        <div class="auth-panel"><div class="auth-box">
          <span class="eyebrow">YOUR NEXT CHAPTER</span><h1>Make yourself at home.</h1><p class="auth-intro">Create an account and start saving the stays you love.</p>
          <form data-form="signup" class="form-stack">
            <label>Full name<input name="name" autocomplete="name" required minlength="2" placeholder="Your name"></label>
            <label>Email address<input name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
            <label>Password<input name="password" type="password" autocomplete="new-password" required minlength="6" placeholder="At least 6 characters"></label>
            <button class="button button-primary button-full" type="submit">Create account <span>→</span></button>
            <p class="form-message" aria-live="polite"></p>
          </form>
          <p class="auth-switch">Already have an account? <a href="#/login">Sign in</a></p>
          <p class="auth-disclaimer">Demo project: your account is saved only in this browser.</p>
        </div></div>
      </section>`;
  }
}
