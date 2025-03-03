import { create } from "zustand";
import { WhoAmIResponse } from "@/app/api/whoAmI/route";

type AuthState = {
  user: WhoAmIResponse | null;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  fetchUser: async () => {

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND;
      const res = await fetch(`${backendUrl}/whoAmI`, {
        credentials: "include",
      });
      console.log("res from useauth", res);

      const data: WhoAmIResponse = await res.json();
      if (data.ok) {
        set({ user: data });
      } else {
        set({ user: null });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null });
    }
  },

  clearUser: () => set({ user: null }),
}));
