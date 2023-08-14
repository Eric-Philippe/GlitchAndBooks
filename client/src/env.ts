const { REACT_API_URL } = process.env;

if (!REACT_API_URL) {
  throw new Error("APP_API_URL is not defined");
}

console.log("APP_API_URL", REACT_API_URL);

export { REACT_API_URL as APP_API_URL };
