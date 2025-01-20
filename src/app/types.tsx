import { Url } from "next/dist/shared/lib/router/router";
import Client, { AuthModel, RecordModel } from "pocketbase";
export interface ValidationError {
  data(data: any): unknown;
  code: string;
  message: string
}

export interface AuthContextType {
  pb: Client;
  login: (user: FormData) => Promise<AuthResponse>;
  signup: (user: FormData) => Promise<AuthResponse>;
  user: AuthModel | null;
  logout: () => Promise<AuthResponse>;
  getAvatarUrl: (record: AuthModel, avatar: string) => Promise<string>;
  updateAvatar: (id: string, file: File) => Promise<boolean>;
  getUserRecord: (id: string, key: string | null) => Promise<RecordModel>;
}

export interface ValidationErrors {
  [key: string]: ValidationError
}

export interface User {
  id: string;
  avatarUrl: string;
  username: string;
  email: string;
  created: Date;
}

export interface ChatMessage {
  message: string;
  guestName: string;
  avatarUrl?: Url;
  reactions: AuthModel[];
  author: AuthModel;
  timestamp: Date;
  uuid: string;
}

export interface AuthResponse { success: boolean; message: string }
