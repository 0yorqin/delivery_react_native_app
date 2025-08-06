import { getCurrentUser } from "@/lib/appwrite";
import { User } from "@/type";
import { setUser } from "@sentry/react-native";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (value: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setUser: (user: User | null) => set({ user }),
  setIsLoading: (value: boolean) => set({ isLoading: value }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      if (user) {
        set({ isAuthenticated: true, user: user as unknown as User });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.log("fetchAuthenticatedUser Error", error);
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
