export const url = "http://localhost:5000/api";

export const setHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
  };
};
