import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function MainLayout() {
  return (
    <div className="admin-shell d-flex flex-column min-vh-100">
      <Header />
      <div className="admin-body d-flex flex-fill">
        <Sidebar />
        <div className="main-pane flex-fill d-flex flex-column">
          <main className="content-area p-4 flex-fill">
            <Outlet />
          </main>
        </div>
      </div>
      <footer className="app-footer border-top py-3 px-4 text-muted d-flex justify-content-between align-items-center">
        <span>© 2026 HELIS Commerce. Built for smooth store management.</span>
        {/* <span>Developed by Deepika Adabala</span> */}
        <small>Version 2.0.1</small>
      </footer>
    </div>
  );
}

export default MainLayout;
