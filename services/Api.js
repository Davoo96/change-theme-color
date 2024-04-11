const API = {
  url: "/data/themes.json",
  fetchThemes: async () => {
    const result = await fetch(API.url);
    return await result.json();
  },
};

export default API;
