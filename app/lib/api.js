const { MODE } = process.env;
const devUrl = "http://localhost:3001";
const prodUrl = "";

const endpoints = {
  users: "/users",
  content: "/content",
  auth: "/auth",
};

export class API {
  constructor() {
    console.log(`Connecting to ${MODE} api`);
    this.url = MODE === "dev" ? devUrl : prodUrl;
  }

  async get(endpoint, params) {
    const url = new URL(this.url + endpoint);
    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }
    const response = await fetch(url);
    return await response.json();
  }

  async post(endpoint, body) {
    const response = await fetch(this.url + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  }
}
