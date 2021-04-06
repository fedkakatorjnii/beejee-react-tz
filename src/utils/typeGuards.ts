import { Task, User } from "../API/types";

export const isEditTask = (
  value: any
): value is Pick<Task, "id" | "text" | "status"> =>
  value.id !== undefined &&
  typeof value.id === "number" &&
  value.text !== undefined &&
  typeof value.text === "string" &&
  value.status !== undefined &&
  typeof value.status === "number";

export const isUserFormValue = (value: any): value is User =>
  value.userName !== undefined &&
  value.userName !== "" &&
  value.password !== undefined &&
  value.password !== "";
