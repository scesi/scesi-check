export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  active: boolean;
}

export interface UserRole {
  rol: string;
  creationDate: string;
}

export interface CreateUserRequest {
  name: string;
  lastName: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  lastName?: string;
  email?: string;
  active?: boolean;
}