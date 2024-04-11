const Store = {
  themes: null,
  themeList: [],
  currentTheme: null,
};

const proxiedStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
    if (property === "themes") {
      window.dispatchEvent(new Event("appthemechange"));
    }
    if (property === "themeList") {
      window.dispatchEvent(new Event("applistchange"));
    }
    if (property === "currentTheme") {
      window.dispatchEvent(new Event("appcurrentthemechange"));
    }
    return true;
  },
  get(target, property) {
    return target[property];
  },
});

export default proxiedStore;
