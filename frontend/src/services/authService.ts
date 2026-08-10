import api from "./api";

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const response = await api.post(
    "/api/v1/auth/signup",
    data
  );

  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post(
    "/api/v1/auth/login",
    data
  );

  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(
    "/api/v1/users/profile"
  );

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};