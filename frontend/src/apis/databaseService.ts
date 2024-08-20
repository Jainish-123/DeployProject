import axios from "axios";

export const createDatabaseStack = async (
  dbInstanceIdentifier: string,
  dbName: string,
  dbUser: string,
  dbPassword: string
) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_APP_URL}/create-database`,
      {
        dbInstanceIdentifier,
        dbName,
        dbUser,
        dbPassword,
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Error creating stack");
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const storeDatabaseInfo = async (
  userId: string,
  dbInstanceIdentifier: string,
  dbName: string,
  dbUser: string,
  dbPassword: string,
  dbEndpoint: string,
  port: number
) => {
  return await axios.post(
    `${process.env.REACT_APP_API_GATEWAY_URL}/store-database-information`,
    {
      userId,
      dbInstanceIdentifier,
      dbName,
      dbUser,
      dbPassword,
      dbEndpoint,
      port,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const fetchUserDatabases = async (userId: string) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_GATEWAY_URL}/fetch-user-databases`,
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching user databases:", error);
    throw error;
  }
};

export const retriveDbCredentials = async (
  dbId: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_GATEWAY_URL}/get-database-credentials`,
      { dbId, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching user databases:", error);
    throw error;
  }
};

export const checkDbInstanceExists = async (dbInstanceIdentifier: string) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_GATEWAY_URL}/check-db-instance-exists`,
      { dbInstanceIdentifier },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching user databases:", error);
    throw error;
  }
};
