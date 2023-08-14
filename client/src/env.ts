const { APP_API_URL } = process.env;

if (!APP_API_URL) {
  throw new Error("APP_API_URL is not defined");
}

console.log("APP_API_URL", APP_API_URL);

export { APP_API_URL };
