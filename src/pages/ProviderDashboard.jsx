import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('providerToken');
  const user = JSON.parse(localStorage.getItem('providerUser') || '{}');

  useEffect(() => {
    if (!token) {
      navigate('/provider/login');
      return;
    }
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`https://leadengine-backend.onrender.com/api/providers/leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('providerToken');
    localStorage.removeItem('providerUser');
    navigate('/provider/login');
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', minHeight: '100vh', background: '#f4f6f8' }}>
      <aside className="sidebar" style={{ width: '250px', background: '#172b4d', color: 'white', padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#00d4ff', padding: '0 0.5rem' }}>Vendor Portal</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', padding: '0.75rem', background: 'rgba(255,255,255,0.1)', borderLeft: '4px solid #00d4ff', borderRadius: '0 4px 4px 0' }}>📋 My Assigned Leads</a>
          <a href="#" style={{ color: '#aaa', textDecoration: 'none', padding: '0.75rem' }}>👤 Profile Settings</a>
          <button onClick={handleLogout} style={{ marginTop: 'auto', background: 'transparent', color: '#ff4d4d', border: 'none', textAlign: 'left', padding: '0.75rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>⎋ Logout</button>
        </nav>
      </aside>
      
      <main className="dashboard-content" style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: '#172b4d' }}>Welcome, {user.name}</h1>
          <span style={{ background: 'white', border: '1px solid #e1e4e8', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.95rem', fontWeight: 'bold', color: '#0052cc', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            {leads.length} Leads Assigned
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Fetching secure leads...</div>
        ) : leads.length === 0 ? (
          <div style={{ background: 'white', padding: '4rem', textAlign: 'center', borderRadius: '12px', border: '1px dashed #ccc' }}>
            <h3 style={{ color: '#333', marginBottom: '0.5rem' }}>You have no assigned leads yet.</h3>
            <p style={{ color: '#777' }}>When the central dispatch assigns a new job request to you, it will appear right here instantly.</p>
          </div>
        ) : (
          <div className="leads-table-container" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="leads-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                <thead style={{ background: '#fafbfc', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '1.25rem', borderBottom: '2px solid #eaeaea', color: '#555', fontSize: '0.9rem', textTransform: 'uppercase' }}>Date / Time</th>
                    <th style={{ padding: '1.25rem', borderBottom: '2px solid #eaeaea', color: '#555', fontSize: '0.9rem', textTransform: 'uppercase' }}>Customer Name</th>
                    <th style={{ padding: '1.25rem', borderBottom: '2px solid #eaeaea', color: '#555', fontSize: '0.9rem', textTransform: 'uppercase' }}>Phone Contact</th>
                    <th style={{ padding: '1.25rem', borderBottom: '2px solid #eaeaea', color: '#555', fontSize: '0.9rem', textTransform: 'uppercase' }}>Requested Service</th>
                    <th style={{ padding: '1.25rem', borderBottom: '2px solid #eaeaea', color: '#555', fontSize: '0.9rem', textTransform: 'uppercase' }}>Area Location</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead._id} style={{ borderBottom: '1px solid #f4f5f7', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafd'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '1.25rem', color: '#6b778c', fontSize: '0.95rem' }}>{new Date(lead.timestamp).toLocaleString()}</td>
                      <td style={{ padding: '1.25rem', fontWeight: 'bold', color: '#172b4d' }}>{lead.name}</td>
                      <td style={{ padding: '1.25rem' }}>
                        <a href={`tel:${lead.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e6f0ff', color: '#0052cc', padding: '0.5rem 0.8rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                          📞 {lead.phone}
                        </a>
                      </td>
                      <td style={{ padding: '1.25rem' }}>
                        <span style={{ display: 'inline-block', border: '1px solid #e1e4e8', background: '#fafbfc', color: '#333', padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500' }}>
                          {lead.service}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem', color: '#444' }}>📍 {lead.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default ProviderDashboard;
