import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      return action.payload;
    },
    logout: () => initialState,
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
