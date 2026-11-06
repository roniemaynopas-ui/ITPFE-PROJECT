export default class View {
  constructor(root) {
    this.root = root;
  }

  render(data = {}) {
    this.root.innerHTML = this.template(data);
    this.afterRender(data);
  }

  template() {
    throw new Error("A View must implement template().");
  }

  afterRender() {}

  static escape(value = "") {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  static money(value) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0
    }).format(value);
  }
}
