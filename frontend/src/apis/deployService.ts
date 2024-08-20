import axios from "axios";

export const deployBackend = async (
  repoUrl: string,
  baseDir: string,
  environment: string,
  runCommand: string
) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_APP_URL}/deploy-backend`,
      {
        repoUrl,
        baseDir,
        environment,
        runCommand,
      }
    );
    return response;
  } catch (error) {
    console.error("Error deploying backend: ", error);
    throw error;
  }
};

export const storeDeployedBackendInfo = async (
  userId: string,
  project: string,
  url: string
) => {
  return await axios.post(
    `${process.env.REACT_APP_API_GATEWAY_URL}/store-project-information`,
    {
      userId,
      project,
      url,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const fetchUserProjects = async (userId: string) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_GATEWAY_URL}/fetch-user-projects`,
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw error;
  }
};
