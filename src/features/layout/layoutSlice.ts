import { createSlice } from '@reduxjs/toolkit';

interface LayoutState {
  sidebarExpanded: boolean;
  theme: 'light' | 'dark';
}

const initialState: LayoutState = {
  sidebarExpanded: true,
  theme: 'light',
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
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
