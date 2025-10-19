import { create } from "zustand";

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  isDesktop: boolean;
  setCollapsed: (value: boolean) => void;
  setMobileOpen: (value: boolean) => void;
  setDesktop: (value: boolean) => void;
  toggleCollapsed: () => void;
  toggleMobileOpen: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  isDesktop: false,
  setCollapsed: (value) => set({ isCollapsed: value }),
  setMobileOpen: (value) => set({ isMobileOpen: value }),
  setDesktop: (value) => set({ isDesktop: value }),
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  toggleMobileOpen: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
}));
