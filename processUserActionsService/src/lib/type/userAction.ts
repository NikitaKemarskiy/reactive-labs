import { UserActionType } from "../enum/userActionType";

export type UserAction = {
  type: UserActionType;
  userId: number;
  url: string;
  timestamp: number;
};
