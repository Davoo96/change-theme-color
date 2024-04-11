import {
  removeFromthemeList,
  setCurrentTheme,
} from "../services/ConfigureTheme.js";

export default class ThemeDescription extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.getElementById("theme-description-template");
    const content = template.content.cloneNode(true);

    this.appendChild(content);

    const theme = JSON.parse(this.dataset.theme);

    this.querySelector("h3").textContent = theme.name;
    this.querySelector(".primary").setAttribute(
      "style",
      `background-color: ${theme.colors.primary}`
    );
    this.querySelector(".secondary").setAttribute(
      "style",
      `background-color: ${theme.colors.secondary}`
    );
    this.querySelector(".success").setAttribute(
      "style",
      `background-color: ${theme.colors.success}`
    );
    this.querySelector(".warning").setAttribute(
      "style",
      `background-color: ${theme.colors.warning}`
    );
    this.querySelector(".danger").setAttribute(
      "style",
      `background-color: ${theme.colors.danger}`
    );
    this.querySelector("a").addEventListener("click", (event) => {
      event.preventDefault();
      app.router.go(`/edit-theme-${theme.id}`);
    });
    this.querySelector("[role='button']").addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() == "a") {
        return app.router.go(`/edit-theme-${theme.id}`);
      }
      if (event.target.tagName.toLowerCase() == "button") {
        return removeFromthemeList(theme.id);
      } else {
        event.preventDefault();
        return setCurrentTheme(theme);
      }
    });
    this.querySelector("#remove-button").dataset.themeId = theme.id;
    this.querySelectorAll("#remove-button").forEach((button) => {
      if (
        app.store.currentTheme.id == theme.id &&
        theme.id == button.dataset.themeId
      ) {
        button.setAttribute("disabled", true);
      }
    });

    window.addEventListener("appcurrentthemechange", () => {
      const currentTheme = app.store.currentTheme;
      const removeButtons = this.querySelectorAll("#remove-button");

      removeButtons.forEach((button) => {
        if (currentTheme.id == theme.id) {
          button.setAttribute("disabled", true);
        } else {
          button.removeAttribute("disabled");
        }
      });
    });
  }
}

customElements.define("theme-item", ThemeDescription);
