import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_admin');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h2>Mini CRM</h2>
      <p className="text-muted">Lead management for agencies and small teams.</p>
      <nav>
        <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Dashboard
        </NavLink>
        <NavLink to="/leads" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Leads
        </NavLink>
      </nav>
      <div style={{ marginTop: 24 }}>
        <button className="button secondary" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
