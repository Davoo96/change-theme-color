import { removeFromthemeList, setCurrentTheme } from "../services/AddTheme.js";

export default class ThemeDescription extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.getElementById("theme-description-template");
    const content = template.content.cloneNode(true);

    this.appendChild(content);

    const currentItemProxy = new Proxy(app.store.currentTheme, {
      set(target, property, value) {
        target[property] = value;
        const removeButton = document
          .querySelector("themes-page")
          .root.querySelectorAll("#remove-button");

        removeButton.forEach((button) => {
          if (value.id == theme.id && theme.id == button.dataset.themeId) {
            button.setAttribute("disabled", true);
          } else {
            button.removeAttribute("disabled");
          }
        });
        return true;
      },
    });

    const theme = JSON.parse(this.dataset.theme);
    this.querySelector(
      ".primary"
    ).textContent = `Primary: ${theme.colors.primary}`;
    this.querySelector(
      ".secondary"
    ).textContent = `Secondary: ${theme.colors.secondary}`;
    this.querySelector(
      ".success"
    ).textContent = `Success: ${theme.colors.success}`;
    this.querySelector(
      ".warning"
    ).textContent = `Warning: ${theme.colors.warning}`;
    this.querySelector(
      ".danger"
    ).textContent = `Danger: ${theme.colors.danger}`;
    this.querySelector("a").addEventListener("click", (event) => {
      event.preventDefault();
      app.router.go(`/edit-theme-${theme.id}`);
    });
    this.querySelector("#remove-button").dataset.themeId = theme.id;
    this.querySelectorAll("#remove-button").forEach((button) => {
      if (
        currentItemProxy.id == theme.id &&
        theme.id == button.dataset.themeId
      ) {
        button.setAttribute("disabled", true);
      }
    });
    this.querySelector("#remove-button").addEventListener("click", () => {
      removeFromthemeList(theme.id);
    });
    this.querySelector("#use-theme").addEventListener("click", (event) => {
      event.preventDefault();
      currentItemProxy.theme = { ...theme };
      setCurrentTheme(theme);
    });
  }
}

customElements.define("theme-item", ThemeDescription);
