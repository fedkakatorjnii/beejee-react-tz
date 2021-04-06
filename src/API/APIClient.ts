import axios, { AxiosResponse } from "axios";
import { Singleton } from "./../utils/Singleton";
import { URL, URL_PREFIX } from "./constants";
import {
  ListResponse,
  CreateResponse,
  EditResponse,
  Task,
  LoginResponse,
  ResponseStatus,
} from "./types";

axios.interceptors.response.use(
  function(response) {
    if (response.data.status == ResponseStatus.ERROR) {
      return Promise.reject(response.data.message);
    } else {
      return response;
    }
  },
  function(error) {
    return Promise.reject(error);
  }
);

@Singleton
class APIClient {
  private _url = URL;

  private _createSearchParams(query?: string) {
    const searchParams = new URLSearchParams(query);

    searchParams.set(URL_PREFIX.name, URL_PREFIX.value);

    return searchParams;
  }

  login(
    userName: string | null,
    password: string | null
  ): Promise<AxiosResponse<LoginResponse>> {
    const params = this._createSearchParams();
    const data = new FormData();

    userName && data.append("username", userName);
    password && data.append("password", password);

    return axios.post<LoginResponse>(`${this._url}login/`, data, { params });
  }

  list(query: string): Promise<AxiosResponse<ListResponse>> {
    const params = this._createSearchParams(query);

    return axios.get<ListResponse>(this._url, { params });
  }

  create({
    username,
    email,
    text,
  }: Partial<Omit<Task, "id">>): Promise<AxiosResponse<CreateResponse>> {
    const params = this._createSearchParams();
    const data = new FormData();

    username && data.append("username", username);
    email && data.append("email", email);
    text && data.append("text", text);

    return axios.post<CreateResponse>(`${this._url}create/`, data, {
      params,
    });
  }

  edit(
    data: Partial<Pick<Task, "id" | "text" | "status">>,
    token: string | null
  ): Promise<AxiosResponse<EditResponse>> {
    const params = this._createSearchParams();
    const newData = new FormData();
    const { id, text, status } = data;

    text !== undefined && newData.append("text", text);
    status !== undefined && newData.append("status", "" + status);
    !!token && newData.append("token", token);

    return axios.post<EditResponse>(`${this._url}edit/${id}/`, newData, {
      params,
      headers: {},
    });
  }
}

export const apiClient = new APIClient();
