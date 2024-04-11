export function placeOrder() {
  app.store.themes = [];
}

function editTheme(themeId, updatedTheme) {
  const index = app.store.themes.findIndex((theme) => theme.id == themeId);
  if (index !== -1) {
    const currentTheme = app.store.themes[index];
    const mergedTheme = mergeThemes(currentTheme, updatedTheme);

    app.store.themes[index] = mergedTheme;
  } else {
    console.error(`Theme with id ${themeId} not found.`);
  }
}

function mergeThemes(currentTheme, updatedTheme) {
  const mergedTheme = { ...currentTheme };

  for (const key in updatedTheme) {
    if (updatedTheme.hasOwnProperty(key)) {
      if (
        typeof updatedTheme[key] === "object" &&
        !Array.isArray(updatedTheme[key])
      ) {
        mergedTheme[key] = mergeThemes(
          currentTheme[key] || {},
          updatedTheme[key]
        );
      } else {
        mergedTheme[key] =
          updatedTheme[key] !== undefined
            ? updatedTheme[key]
            : currentTheme[key];
      }
    }
  }

  if (updatedTheme.name === "") {
    mergedTheme.name = currentTheme.name;
  }

  return mergedTheme;
}

export function addNewThemeList(id, name, colors) {
  app.store.themes.push({ id, name, colors });
}

export async function addToList(updatedTheme) {
  const theme = app.store.themes.find((theme) => theme.id == updatedTheme.id);
  if (!theme) {
    return addNewThemeList(
      updatedTheme.id,
      updatedTheme.name,
      updatedTheme.colors
    );
  }
  return editTheme(updatedTheme.id, updatedTheme);
}

export function removeFromthemeList(id) {
  app.store.themes = app.store.themes.filter(
    (themeInList) => themeInList.id !== id
  );
}

export function setCurrentTheme(theme) {
  app.store.currentTheme = theme;
  document.documentElement.style.cssText = `--primary: ${theme.colors.primary}; --secondary: ${theme.colors.secondary}; --success: ${theme.colors.success}; --warning: ${theme.colors.warning}; --danger: ${theme.colors.danger};`;
}
