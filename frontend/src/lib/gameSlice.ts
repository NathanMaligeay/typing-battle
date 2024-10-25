import { createSlice } from '@reduxjs/toolkit';

interface playState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
}

const initialState: playState = {
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      state.isPlaying = true;
      state.isPaused = false;
      state.isGameOver = false;
    },
    stopGame: (state) => {
      state.isPlaying = false;
      state.isPaused = false;
      state.isGameOver = false;
    },
    endGame: (state) => {
      state.isPlaying = false;
      state.isGameOver = true;
    },
    endGameOver: (state) => {
      state.isGameOver = false;
    },
    togglePausing: (state) => {
      state.isPaused = !state.isPaused;
    }
  },
});

export const { startGame, endGame, stopGame, endGameOver, togglePausing } = gameSlice.actions;

export default gameSlice.reducer;
