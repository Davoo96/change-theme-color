import { setCurrentTheme } from "../services/ConfigureTheme.js";

export default class ThemesPage extends HTMLElement {
  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });

    const styles = document.createElement("style");
    this.root.appendChild(styles);

    async function loadCSS() {
      const request = await fetch("./css/custom.css");
      const css = await request.text();
      styles.textContent = css;
    }
    loadCSS();
  }

  connectedCallback() {
    const template = document.getElementById("themes-page-template");
    const content = template.content.cloneNode(true);
    this.root.appendChild(content);

    window.addEventListener("appthemechange", () => {
      this.render();
    });

    this.render();
  }

  render() {
    if (app.store.themes) {
      const currentTheme = app.store.currentTheme;
      this.root.querySelector("#themes").innerHTML = "";
      const themes = app.store.themes;

      if (currentTheme) {
        setCurrentTheme(currentTheme);
      } else {
        setCurrentTheme(themes[0]);
      }

      themes.forEach((theme) => {
        const liTheme = document.createElement("li");
        liTheme.classList.add("list-group-item", "border", "rounded", "p-2");
        liTheme.id = `theme-item`;
        liTheme.innerHTML = `<ul class="list-group"></ul>`;
        this.root.querySelector("#themes").appendChild(liTheme);
        const item = document.createElement("theme-item");
        item.dataset.theme = JSON.stringify(theme);
        liTheme.querySelector("ul").appendChild(item);
      });

      this.root.querySelectorAll("#theme-item").forEach((themeItem) => {
        const currentTheme = app.store.currentTheme;
        const theme = JSON.parse(
          themeItem.querySelector("theme-item").dataset.theme
        );
        if (currentTheme.id == theme.id) {
          themeItem.classList.add("active", "border-success");
        } else {
          themeItem.classList.remove("active", "border-success");
        }
      });

      window.addEventListener("appcurrentthemechange", () => {
        const currentTheme = app.store.currentTheme;
        const themeItems = this.root.querySelectorAll("#theme-item");

        themeItems.forEach((themeItem) => {
          const theme = JSON.parse(
            themeItem.querySelector("theme-item").dataset.theme
          );
          if (currentTheme.id === theme.id) {
            themeItem.classList.add("active", "border-success");
          } else {
            themeItem.classList.remove("active", "border-success");
          }
        });
      });
      this.root
        .querySelector("#newTheme")
        .addEventListener("click", (event) => {
          event.preventDefault();
          app.router.go(
            `/edit-theme-${Number(themes[themes.length - 1].id) + 1}`
          );
        });
      this.root
        .querySelector("#searchInput")
        .addEventListener("keyup", (event) => {
          const { value } = event.target;

          const searchQuery = value.toLowerCase();

          for (const theme of themes) {
            const themeName = theme.name.toLowerCase();
            const li = this.root.querySelectorAll("#theme-item");
            if (themeName.includes(searchQuery)) {
              li.forEach((element) => {
                if (element.querySelector("h3").textContent === theme.name) {
                  element.style.display = "block";
                }
              });
            } else {
              li.forEach((element) => {
                if (element.querySelector("h3").textContent === theme.name) {
                  element.style.display = "none";
                }
              });
            }
          }
        });
    } else {
      this.root.querySelector("#themes").innerHTML = "Loading...";
    }
  }
}
customElements.define("themes-page", ThemesPage);
