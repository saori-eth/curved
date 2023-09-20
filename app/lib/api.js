const { MODE } = process.env;
const devUrl = "http://localhost:3001";
const prodUrl = "";

const endpoints = {
  auth: "/auth",
  content: "/content",
  users: "/users",
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
        url.searchParams.append(key, params[key]),
      );
    }
    const response = await fetch(url);
    return await response.json();
  }

  async post(endpoint, body) {
    const response = await fetch(this.url + endpoint, {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    return await response.json();
  }
}
