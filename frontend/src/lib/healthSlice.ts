import { createSlice } from '@reduxjs/toolkit';

interface healthState {
    value: number;
}

const initialState: healthState = {
    value: 100,
};

export const healthSlice = createSlice({
    name: 'health',
    initialState,
    reducers: {
      takeDamage: (state) => {
        state.value -= 1;
      },
      resetHealth: (state) => {
        state.value = 100;
      }
    },
  });

export const { takeDamage, resetHealth } = healthSlice.actions;

export default healthSlice.reducer;
