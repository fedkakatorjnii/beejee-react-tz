import { makeAutoObservable } from "mobx";
import { apiClient } from "../../API/APIClient";
import { User, UserErrors } from "../../API/types";

export class UserStore {
  constructor() {
    makeAutoObservable(this);

    const token = localStorage.getItem("token");
    this.token = token;
  }

  userName: string | null = null;
  password: string | null = null;
  token: string | null = null;
  loading: boolean = false;
  errors: UserErrors = {
    login: null,
  };

  getToken = () => {
    const token = localStorage.getItem("token");

    return token;
  };

  loginAPI = async () => {
    this.errors.login = null;
    this.loading = true;
    try {
      const res = await apiClient.login(this.userName, this.password);

      localStorage.setItem("token", res.data.message.token);
      this.token = res.data.message.token;
    } catch (err) {
      this.errors.login = err;
    }
    this.loading = false;
  };

  logoutAPI = () => {
    localStorage.removeItem("token");
    this.token = null;
  };

  setUserName = (value: string | undefined) => {
    this.userName = value === undefined || value.length === 0 ? null : value;
  };

  setPassword = (value: string | undefined) => {
    this.password = value === undefined || value.length === 0 ? null : value;
  };

  get isLogin() {
    if (typeof this.token === "string") {
      return true;
    }

    return false;
  }
}
