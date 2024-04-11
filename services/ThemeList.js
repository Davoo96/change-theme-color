import API from "./Api.js";

export async function loadData() {
  app.store.themes = await API.fetchThemes();
}

export async function getThemeById(id) {
  if (app.store.themes === null) {
    await loadData();
  }
  for (const theme of app.store.themes) {
    if (theme.id == id) {
      return theme;
    }
  }
  return { id: "", name: "", colors: {} };
}
