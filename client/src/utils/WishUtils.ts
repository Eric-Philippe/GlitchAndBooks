import { Wish } from "../models/Wish";

export const fetchUserData = async (): Promise<Wish[]> => {
  const response = await fetch(
    "/api/v1/wishes/get?userid=" + localStorage.getItem("userid"),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );

  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error fetching user data");
  }
};
