const Store = {
  themes: null,
  currentTheme: null,
};

const proxiedStore = new Proxy(Store, {
  set(target, property, value) {
    target[property] = value;
    if (property === "themes") {
      window.dispatchEvent(new Event("appthemechange"));
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
