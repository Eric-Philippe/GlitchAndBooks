export const isConnected = async () => {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3005/api/v1/session", {
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
