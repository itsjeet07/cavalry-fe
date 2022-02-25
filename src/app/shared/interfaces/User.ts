export interface UserLoginRequest {
  email?: string;
  password?: string;
}

export interface UserResponse {
  statusCode?: number;
  data: {
    token: string,
    user: any
  };
  message?: string;
}

export interface UserRegisterRequest {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  email?: string;
  password?: string;
}

