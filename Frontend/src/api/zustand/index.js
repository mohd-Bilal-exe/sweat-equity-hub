import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,

      addUser: newUser => set({ user: newUser }),

      updateUser: updatedFields => set({ user: { ...get().user, ...updatedFields } }),

      removeUser: () => set({ user: null }),
    }),
    {
      name: 'zustand-storage-sweatquity', // Key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: state => {
        // Only store non-reference data for both user and admin
        const { user, admin, ...rest } = state;

        const cleanUserData = userData => {
          if (!userData) return null;
          const { jobs, payments, applications, ...cleanData } = userData;
          return cleanData;
        };

        return {
          ...rest,
          user: user ? cleanUserData(user) : null,
        };
      },
    }
  )
);

export default useUserStore;
