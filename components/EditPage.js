import { addToList } from "../services/AddTheme.js";
import { getThemeById } from "../services/ThemeList.js";

export default class EditPage extends HTMLElement {
  #theme = {
    id: "",
    name: "",
    colors: {},
  };

  constructor() {
    super();

    this.root = this.attachShadow({ mode: "open" });
    const styles = document.createElement("style");
    this.root.appendChild(styles);
    const section = document.createElement("section");
    this.root.appendChild(section);

    async function loadCSS() {
      const request = await fetch("./css/custom.css");
      styles.textContent = await request.text();
    }
    loadCSS();
  }

  async connectedCallback() {
    window.addEventListener("appcurrentthemechange", () => {
      this.render();
    });

    this.render();
  }

  async render() {
    let section = this.root.querySelector("section");
    const theme = await getThemeById(this.dataset.themeId);
    if (theme) {
      this.#theme.id = theme.id;
    }
    this.#theme.id = this.dataset.themeId;

    if (app.store.themes.length == 0) {
      app.router.go("/new-theme");
    } else {
      let html = `
            <h2>Editar tema</h2>
        `;
      section.innerHTML = html;

      const template = document.getElementById("edit-theme-template");
      const content = template.content.cloneNode(true);
      section.appendChild(content);

      section.querySelector("form").innerHTML = `
      <label for="name">Nome do tema</label>
      <input name="name" id="name" required value="${
        theme.name ?? ""
      }" placeholder="digite o nome do tema" />
      <label for="primary">Cor primaria</label>
      <input name="primary" id="primary" type="color" value="${
        theme.colors.primary ?? "#000000"
      }" />
      <label for="secondary">Cor secundaria</label>
      <input name="secondary" id="secondary" type="color" value="${
        theme.colors.secondary ?? "#000000"
      }" />
      <label for="success">Cor de sucesso</label>
      <input name="success" id="success" type="color" value="${
        theme.colors.success ?? "#000000"
      }" />
      <label for="warning">Cor de aviso</label>
      <input name="warning" id="warning" type="color" value="${
        theme.colors.warning ?? "#000000"
      }" />
      <label for="danger">Cor de perigo</label>
      <input name="danger" id="danger" type="color" value="${
        theme.colors.danger ?? "#000000"
      }" />
      <button type="submit">Place Order</button>
      `;
    }

    this.setFormBindings(this.root.querySelector("form"));
  }

  setFormBindings(form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      alert("Tema editado com sucesso!");
      addToList(this.#theme);
    });

    Array.from(form.elements).forEach((element) => {
      if (element.type == "color") {
        element.addEventListener("input", () => {
          const colorName = element.name;
          const newColorValue = element.value;

          this.#theme.colors[colorName] = newColorValue;

          document.documentElement.style.setProperty(
            `--${colorName}`,
            newColorValue
          );
        });
      }
      if (element.type == "text") {
        element.addEventListener("input", () => {
          this.#theme.name = element.value;
        });
      }
    });
  }
}

customElements.define("edit-page", EditPage);
