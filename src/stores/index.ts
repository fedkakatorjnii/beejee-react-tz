import { TaskStore } from "./TaskStore";
import { UserStore } from "./UserStore";

export type RootStoreModel = typeof RootStore;

export class RootStore {
  userStore: UserStore;
  taskStore: TaskStore;

  constructor() {
    this.userStore = new UserStore();
    this.taskStore = new TaskStore(this);
  }
}

export const rootStore = new RootStore();
