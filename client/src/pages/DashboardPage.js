import { useEffect, useState } from 'react';
import { fetchLeads } from '../services/api.js';
import Sidebar from '../components/Sidebar.js';
import StatsCard from '../components/StatsCard.js';

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, newLeads: 0, contacted: 0, converted: 0, sourceStats: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchLeads();
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      }
    };
    loadStats();
  }, []);

  const conversionRate = stats.total ? Math.round((stats.converted / stats.total) * 100) : 0;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-panel">
        <div className="header-row">
          <div>
            <h1>Dashboard</h1>
            <p className="text-muted">Track leads, source performance, and conversion progress.</p>
          </div>
        </div>

        <div className="stats-row" style={{ marginTop: 20 }}>
          <StatsCard title="Total Leads" value={stats.total} detail="All leads in the system" accent="#2563eb" />
          <StatsCard title="New Leads" value={stats.newLeads} detail="Leads waiting for contact" accent="#10b981" />
          <StatsCard title="Contacted" value={stats.contacted} detail="Leads currently in progress" accent="#f59e0b" />
          <StatsCard title="Converted" value={stats.converted} detail="Closed leads" accent="#14b8a6" />
          <StatsCard title="Conversion" value={`${conversionRate}%`} detail="Rate of converted leads" accent="#7c3aed" />
        </div>

        <section className="card" style={{ marginTop: 24 }}>
          <h2>Lead Sources</h2>
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
          <div className="grid-3" style={{ marginTop: 16 }}>
            {stats.sourceStats.length ? (
              stats.sourceStats.map((item) => (
                <div className="card" key={item._id} style={{ padding: 18 }}>
                  <h3>{item._id}</h3>
                  <p style={{ margin: '8px 0 0', fontSize: '1.6rem' }}>{item.count}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">No leads available yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
