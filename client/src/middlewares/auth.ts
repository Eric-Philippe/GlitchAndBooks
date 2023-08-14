import { APP_API_URL } from "../env";

export const isConnected = async () => {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem("token");
    if (!token) resolve(false);

    const res = await fetch(APP_API_URL + "/v1/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      resolve(true);
    }

    resolve(false);
  });
};
