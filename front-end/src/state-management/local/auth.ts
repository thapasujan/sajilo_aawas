import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store/store";



interface stateTypes {
  userToken: Storage | null;
  user: Storage | null;
}

const initialState: stateTypes = {
  userToken: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") as string)
    : null,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
};

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.user = action.payload.user;
      state.userToken = action.payload.token;
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.removeItem("signuptoken");
    },

    updateCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    logOut: (state) => {
   
      state.user = null;
      state.userToken = null;
      localStorage.clear();

    },
  },
});

export const { logIn, logOut, updateCredentials } = auth.actions;
export const userToken = (state: RootState) => state.localAuth.userToken;
export const user = (state: RootState) => state.localAuth.user;

export default auth.reducer;
