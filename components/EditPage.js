import { addToList } from "../services/ConfigureTheme.js";
import { getThemeById } from "../services/ThemeList.js";

export default class EditPage extends HTMLElement {
  #theme = {
    id: "",
    name: "",
    colors: {},
    newTheme: true,
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
    section.classList.add(
      "d-flex",
      "flex-column",
      "p-4",
      "align-items-center",
      "justify-content-center"
    );
    const theme = await getThemeById(this.dataset.themeId);
    if (theme.id !== "") {
      this.#theme.id = theme.id;
      this.#theme.newTheme = false;
    }
    this.#theme.id = this.dataset.themeId;

    let html = `
            <h2 class="border-bottom w-100">${
              theme.id !== "" ? "Editar" : "Criar"
            } tema</h2>
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
      <input name="primary" id="primary" ${
        theme.id === "" ? "required" : ""
      } type="color" value="${theme.colors.primary ?? "#000000"}" />
      <label for="secondary">Cor secundaria</label>
      <input name="secondary" id="secondary" ${
        theme.id === "" ? "required" : ""
      } type="color" value="${theme.colors.secondary ?? "#000000"}" />
      <label for="success">Cor de sucesso</label>
      <input name="success" id="success" ${
        theme.id === "" ? "required" : ""
      } type="color" value="${theme.colors.success ?? "#000000"}" />
      <label for="warning">Cor de aviso</label>
      <input name="warning" id="warning" ${
        theme.id === "" ? "required" : ""
      } type="color" value="${theme.colors.warning ?? "#000000"}" />
      <label for="danger">Cor de perigo</label>
      <input name="danger" id="danger" ${
        theme.id === "" ? "required" : ""
      } type="color" value="${theme.colors.danger ?? "#000000"}" />
      <button type="submit" class="btn btn-primary">Salvar</button>`;

    this.root.querySelector("h3").textContent = "Tema de exemplo";

    this.setFormBindings(this.root.querySelector("form"));
  }

  setFormBindings(form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (Object.keys(this.#theme.colors).length < 5 && this.#theme.newTheme) {
        return alert("Preencha todos os campos");
      }
      addToList(this.#theme);
      app.router.go(`/`);
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
