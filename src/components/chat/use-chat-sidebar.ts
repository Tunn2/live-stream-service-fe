import { create } from "zustand";

interface ChatSidebarStore {
    collapsed: boolean,
    onExpand: () => void,
    onCollapse: () => void,
};

export const useChatSidebar = create<ChatSidebarStore>((set) => ({
    collapsed: false,
    onExpand: () => set(() => ({ collapsed: false })),
    onCollapse: () => set(() => ({ collapsed: true })),
}));