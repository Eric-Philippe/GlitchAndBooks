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

interface Author {
  firstname: string;
  lastname: string;
}

const isUpperCase = (str: string): boolean => {
  return str === str.toUpperCase();
};

export const getAuthors = (authors: string): Author[] => {
  // Format : lower UPPER, lower UPPER-UPPER, lower lower UPPER
  const authorsArray = authors.split(", ");
  const authorsObjects: Author[] = [];

  // The first part is what's before the full UPPERCASE part
  for (let i = 0; i < authorsArray.length; i++) {
    let firstname = "";
    let lastname = "";
    let words = authorsArray[i].split(" ");
    for (let j = 0; j < words.length; j++) {
      if (!isUpperCase(words[j])) {
        firstname += words[j] + " ";
      } else {
        lastname = words[j];
      }
    }

    authorsObjects.push({
      firstname: firstname.trim(),
      lastname: lastname,
    });
  }

  return authorsObjects;
};
