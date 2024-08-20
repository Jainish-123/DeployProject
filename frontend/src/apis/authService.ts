import axios from "axios";

export const signup = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string
) => {
  return await axios.post(
    `${process.env.REACT_APP_API_GATEWAY_URL}/signup`,
    {
      email,
      password,
      firstname,
      lastname,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const login = async (email: string, password: string) => {
  return await axios.post(
    `${process.env.REACT_APP_API_GATEWAY_URL}/login`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
