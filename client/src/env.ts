const { APP_API_URL } = process.env;

if (!APP_API_URL) {
  throw new Error("APP_API_URL is not defined");
}

export { APP_API_URL };
