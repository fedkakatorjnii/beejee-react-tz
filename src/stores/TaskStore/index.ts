import { makeAutoObservable, observable, action } from "mobx";
import {
  Task,
  TaskFormValue,
  PaginationValue,
  TaskErrors,
} from "../../API/types";
import { apiClient } from "../../API/APIClient";
import { RootStore } from "../";

enum Status {
  done = 10,
}

const isTaskFormValue = (value: any): value is TaskFormValue =>
  value.username !== undefined &&
  value.username !== "" &&
  value.email !== undefined &&
  value.email !== "" &&
  value.text !== undefined &&
  value.text !== "" &&
  value.status !== undefined &&
  value.status !== "";

export class TaskStore {
  private _store: RootStore;

  constructor(store: RootStore) {
    makeAutoObservable(this);
    this._fetchTasks();

    this._store = store;
  }

  @observable tasks: Task[] = [];
  @observable total_task_count: number = 0;
  @observable loading: boolean = false;
  @observable error: Error | null = null;
  @observable errors: TaskErrors = {
    list: null,
    edit: null,
  };
  @observable editTask: Partial<TaskFormValue> | null = null;

  private _pagination: PaginationValue = {};

  private _createSearchParams = () => {
    const { page, sort_field, sort_direction } = this._pagination;
    const searchParams = new URLSearchParams();

    page && searchParams.set("page", "" + page);
    sort_field && searchParams.set("sort_field", "" + sort_field);
    sort_direction && searchParams.set("sort_direction", "" + sort_direction);

    return searchParams.toString();
  };

  private _fetchTasks = async () => {
    const searchParams = this._createSearchParams();
    this.loading = true;
    try {
      const res = await apiClient.list(searchParams);
      const { tasks, total_task_count } = res.data.message;

      this.tasks = tasks;
      this.total_task_count = total_task_count;
    } catch (err) {
      this.errors.list = err;
    }
    this.loading = false;
  };

  private _fetchCreateTask = async (task: Partial<TaskFormValue>) => {
    await apiClient.create(task);
    this.editTask = null;
  };

  private _fetchEditTask = async (task: Partial<TaskFormValue>) => {
    const { id, text, status } = task;
    const findTask = this.tasks.find((task) => task.id === id);

    if (findTask === undefined) {
      return;
    }

    const oldStatus = "" + findTask.status;

    const isChangeText = findTask.text !== text;

    await apiClient.edit({ id, text, status }, this._store.userStore.token);
    this.editTask = null;
  };

  @action
  storeTask = async () => {
    if (this.editTask === null) {
      return;
    }

    const { id } = this.editTask;

    this.loading = true;
    this.errors.edit = null;
    try {
      if (id === undefined) {
        await this._fetchCreateTask(this.editTask);
      } else {
        await this._fetchEditTask(this.editTask);
      }
      await this._fetchTasks();
    } catch (err) {
      this.errors.edit = err;
    }

    this.loading = false;
  };

  @action
  changePagination(pagination: PaginationValue) {
    this._pagination = pagination;
    this._fetchTasks();
  }

  @action
  changeEditTask = <T extends TaskFormValue, K extends keyof TaskFormValue>(
    key: K,
    value: T[K] | undefined
  ) => {
    this.editTask = {
      ...this.editTask,
      [key]: value,
    };
  };

  @action
  setEditTask = (value: Partial<TaskFormValue> | null) => {
    this.editTask = value;
  };
}
