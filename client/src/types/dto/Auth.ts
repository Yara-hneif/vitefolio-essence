export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export type OAuthProvider = 'google' | 'github' | 'facebook';
