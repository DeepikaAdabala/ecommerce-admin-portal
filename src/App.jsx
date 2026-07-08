import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';

function App() {
  const theme = useSelector((state) => state.layout.theme);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return <AppRoutes />;
}

export default App;
