// state-management/redux/notificationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface Notification {
  id: string;
  message: string;
  type?: string;
  createdAt: number;
}

interface NotificationState {
  messages: Notification[];
}

const initialState: NotificationState = {
  messages: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.messages.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.messages = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
