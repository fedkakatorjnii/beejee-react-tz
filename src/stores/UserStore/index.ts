import { makeAutoObservable, observable, action, computed } from "mobx";
import { apiClient } from "../../API/APIClient";
import { UserErrors } from "../../API/types";
import { User } from "./types";

export class UserStore {
  constructor() {
    makeAutoObservable(this);
  }

  userName: string | null = null;
  @observable password: string | null = null;
  @observable token: string | null = null;
  @observable loading: boolean = false;
  @observable errors: UserErrors = {
    login: null,
  };

  @action
  loginAPI = async () => {
    this.errors.login = null;
    this.loading = true;
    try {
      const res = await apiClient.login(this.userName, this.password);

      this.token = res.data.message.token;
    } catch (err) {
      this.errors.login = err;
    }
    this.loading = false;
  };

  logoutAPI = () => {
    this.token = null;
  };

  setUserName = (value: string | undefined) => {
    this.userName = value === undefined || value.length === 0 ? null : value;
  };

  setPassword = (value: string | undefined) => {
    this.password = value === undefined || value.length === 0 ? null : value;
  };

  setUser = <T extends User, K extends keyof User>(
    key: K,
    value: T[K] | undefined
  ) => {};

  @computed get isLogin() {
    if (typeof this.token === "string" && typeof this.userName === "string") {
      return true;
    }

    return false;
  }
}
