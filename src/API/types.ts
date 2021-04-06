export enum ResponseStatus {
  OK = "ok",
  ERROR = "error",
}

interface Collection<T> {
  tasks: T[];
  total_task_count: number;
}

export interface Task {
  id: number;
  username: string;
  email: string;
  text: string;
  status: number;
}

// create

export interface CreateResponse {
  status: ResponseStatus.OK;
  message: Task;
}

export type CreateError = {
  username?: string;
  email?: string;
  text?: string;
  status?: string;
};

// list

export interface ListResponse {
  status: ResponseStatus.OK;
  message: Collection<Task>;
}

type ListError = string;

// edit

export interface EditResponse {
  status: ResponseStatus.OK;
}

type EditError = {
  username?: string;
  email?: string;
  text?: string;
  status?: string;
  token?: string;
};

// login

type LoginError = {
  username?: string;
  password?: string;
};

export interface LoginResponse {
  status: ResponseStatus.OK;
  message: {
    token: string;
  };
}

//

export type TaskFormValue = Omit<Task, "id"> & { id?: number };

export type Pagination = {
  page: number;
  sort_field: string;
  sort_direction: "asc" | "desc";
};

export type PaginationValue = Partial<Pagination>;

//

export type TaskErrors = {
  list: ListError | null;
  edit: EditError | null;
};

export type UserErrors = {
  login: LoginError | null;
};

export type User = { userName: string; password: string };
