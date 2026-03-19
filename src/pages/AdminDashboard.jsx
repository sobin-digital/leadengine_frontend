import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [serviceFilter, setServiceFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchLeads();
    fetchProviders();
  }, [navigate]);

  const [providers, setProviders] = useState([]);

  const fetchProviders = async () => {
    try {
      const res = await fetch(`https://leadengine-backend.onrender.com/api/providers`);
      const data = await res.json();
      if (data.success) {
        setProviders(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch providers', e);
    }
  };

  const handleAssignLead = async (leadId, providerId) => {
    try {
      const res = await fetch(`https://leadengine-backend.onrender.com/api/leads/${leadId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: providerId || null })
      });
      const data = await res.json();
      if (data.success) {
        setLeads(prev => prev.map(l => l._id === leadId ? data.data : l));
      }
    } catch(e) {
      console.error(e);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = [];
      if (serviceFilter) query.push(`service=${encodeURIComponent(serviceFilter)}`);
      if (dateFilter) query.push(`date=${encodeURIComponent(dateFilter)}`);
      
      const queryString = query.length > 0 ? `?${query.join('&')}` : '';
      const response = await fetch(`https://leadengine-backend.onrender.com/api/leads${queryString}`);
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="admin-layout">
      <Helmet>
        <title>Dashboard | LeadEngine UAE</title>
      </Helmet>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>LeadEngine</h2>
          <span>Admin Panel</span>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">📊 Dashboard</a>
          <a href="#" className="nav-item">⚙️ Settings</a>
        </nav>
        <div className="sidebar-bottom">
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Leads Overview</h1>
        </header>

        <div className="dashboard-content">
          {/* Summary Cards */}
          <div className="stats-row">
            <div className="stat-card">
              <h3>Total Leads</h3>
              <p className="stat-value">{leads.length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <form onSubmit={handleFilterSubmit} className="filters-form">
              <div className="filter-group">
                <label>Service Type</label>
                <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)}>
                  <option value="">All Services</option>
                  <option value="AC Repair">AC Repair & Fixing</option>
                  <option value="AC Maintenance">General Maintenance</option>
                  <option value="AC Installation">AC Installation</option>
                  <option value="Duct Cleaning">Duct Cleaning</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Date</label>
                <input 
                  type="date" 
                  value={dateFilter} 
                  onChange={(e) => setDateFilter(e.target.value)} 
                />
              </div>
              <div className="filter-actions">
                <button type="submit" className="btn btn-primary">Apply Filters</button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setServiceFilter('');
                  setDateFilter('');
                  setTimeout(fetchLeads, 0); // Re-fetch immediately without filters
                }}>Clear</button>
              </div>
            </form>
          </div>

          {/* Leads Table */}
          <div className="table-container">
            {loading ? (
              <div className="loading-state">Loading leads...</div>
            ) : leads.length === 0 ? (
              <div className="empty-state">No leads found.</div>
            ) : (
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Date Received</th>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Phone</th>
                    <th>Location</th>
                    <th>Assigned Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id || lead.phone + lead.timestamp}>
                      <td className="date-cell">{new Date(lead.timestamp).toLocaleString()}</td>
                      <td className="bold">{lead.name}</td>
                      <td><span className="badge">{lead.service}</span></td>
                      <td>
                        <a href={`tel:${lead.phone}`} className="phone-link">{lead.phone}</a>
                      </td>
                      <td>{lead.location}</td>
                      <td>
                        <select 
                          value={lead.assignedTo ? (lead.assignedTo._id || lead.assignedTo) : ''} 
                          onChange={(e) => handleAssignLead(lead._id, e.target.value)}
                          style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd', background: lead.assignedTo ? '#e6f0ff' : 'white', cursor: 'pointer', maxWidth: '160px' }}
                        >
                          <option value="">Unassigned</option>
                          {providers.map(p => (
                            <option key={p._id} value={p._id}>{p.name} ({p.services.length} svcs)</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
