import type { FieldValue } from "firebase/firestore";


export interface UserType {
  id: string;
  createdAt?: FieldValue | null;
  name: string;
  email: string;
  photoURL: string;
  type: UserTypeEnum;
  tickets: number;
}

export enum UserTypeEnum {
  HOST = "host",
  GUEST = "guest",
  BAR = "bar",
  DEFAULT = "default",
}