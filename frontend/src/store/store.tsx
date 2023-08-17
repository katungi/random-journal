import {create} from 'zustand';

export type IUserResponse = {
  id: number;
  username: string;
  email: string;
  password: string;
  token: string | null;
};

type UserState = {
  user: IUserResponse | null;
  setUser: (user: IUserResponse) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
