import { loadData } from "./services/ThemeList.js";
import Router from "./services/Router.js";
import Store from "./services/Store.js";

import ThemesPage from "./components/ThemesPage.js";
import ThemeDescription from "./components/ThemeDescripiton.js";
import EditPage from "./components/EditPage.js";

window.app = {};
app.store = Store;
app.router = Router;

window.addEventListener("DOMContentLoaded", async () => {
  loadData();
  app.router.init();
});
