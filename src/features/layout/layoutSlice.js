import { createSlice } from '@reduxjs/toolkit';

const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    sidebarExpanded: true,
    theme: 'light',
  },
  reducers: {
    setSidebarExpanded: (state, action) => {
      state.sidebarExpanded = action.payload;
    },
    toggleSidebarExpanded: (state) => {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    setThemeMode: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const { setSidebarExpanded, toggleSidebarExpanded, setThemeMode } = layoutSlice.actions;
export default layoutSlice.reducer;
