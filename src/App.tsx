import { useEffect } from 'react';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import type { RootState } from './store';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function App() {
  const theme = useAppSelector((state) => state.layout.theme);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return <AppRoutes />;
}

export default App;
