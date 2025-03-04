import { create } from "zustand";
import { WhoAmIResponse } from "@/app/api/whoAmI/route";

type AuthState = {
  user: WhoAmIResponse | null;
  fetchUser: () => Promise<boolean>; // Returns true if user exists
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
   
      // if (!res.ok) throw new Error("Failed to fetch user");

      const data: WhoAmIResponse = await res.json();
      if (data.ok) {
        set({ user: data });
        return true;
      } else {
        set({ user: null });
        return false;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      set({ user: null });
      return false;
    }
  },

  clearUser: () => set({ user: null }),
}));
