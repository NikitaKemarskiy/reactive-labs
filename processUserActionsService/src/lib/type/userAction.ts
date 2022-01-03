import { UserActionType } from "../enum/userActionType";

export type UserAction = {
  type: UserActionType;
  userId: string;
  url: string;
  timestamp: number;
};
