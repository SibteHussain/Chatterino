import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  uuid: string | null;
}

const initialState: UserState = {
  uuid: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUUID(state, action: PayloadAction<string>) {
      state.uuid = action.payload;
    },
    clearUUID(state) {
      state.uuid = null;
    },
  },
});

export const {setUUID, clearUUID} = userSlice.actions;
export default userSlice.reducer;
