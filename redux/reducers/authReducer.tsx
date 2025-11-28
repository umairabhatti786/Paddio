import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface AuthState {
  isRememberMe: any;
  user: any;
  userId: any;
  
}
export const initialState: AuthState = {
  user: {},
  isRememberMe: true,
  userId: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   
    setAuthData: (state, { payload }: PayloadAction<any>) => {
      state.user = payload;
    },
       
    setIsRemember: (state, { payload }: PayloadAction<any>) => {
      state.isRememberMe = payload;
    },
   
    // setUserId: (state, { payload }: PayloadAction<any>) => {
    //   state.userId = payload;
    // },
  },
});

export const { setAuthData,setIsRemember } = authSlice.actions;
export default authSlice.reducer;
// export const getToken = (state: RootState) => state?.auth.user?.us;
export const getAuthData = (state: RootState) => state?.auth.user;
export const getIsRememberMe = (state: RootState) => state?.auth.isRememberMe;


