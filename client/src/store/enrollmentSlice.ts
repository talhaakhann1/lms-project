import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface EnrollmentState {
  hasEnrolled: boolean;
}

const initialState: EnrollmentState = {
  hasEnrolled: false,
};

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    setHasEnrolled: (state, action: PayloadAction<boolean>) => {
      state.hasEnrolled = action.payload;
    },
  },
});

export const { setHasEnrolled } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;