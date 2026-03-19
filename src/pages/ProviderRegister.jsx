import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const availableServices = [
  { id: 'ac-repair-dubai', label: 'AC Repair' },
  { id: 'plumber-dubai', label: 'Plumbing' },
  { id: 'cleaning-dubai', label: 'Cleaning' },
  { id: 'car-recovery-dubai', label: 'Car Recovery' },
  { id: 'electrician-dubai', label: 'Electrician Services' },
  { id: 'appliance-repair-dubai', label: 'Home Appliance Repair' }
];

const ProviderRegister = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', location: '', services: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckbox = (serviceId) => {
    setFormData(prev => {
      const services = prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.services.length === 0) return setError('Please select at least one service');
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://leadengine-backend.onrender.com/api/providers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('providerToken', data.token);
        localStorage.setItem('providerUser', JSON.stringify(data.provider));
        navigate('/provider/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container" style={{ alignItems: 'flex-start', paddingTop: '3rem', minHeight: '100vh' }}>
      <div className="login-box" style={{ maxWidth: '500px', width: '100%' }}>
        <h2>Vendor Registration</h2>
        <p>Join LeadEngine UAE as a Service Provider</p>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem', fontSize: '0.9rem'}}>{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group"><input type="text" name="name" placeholder="Company / Full Name" value={formData.name} onChange={handleChange} required /></div>
          <div className="form-group"><input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required /></div>
          <div className="form-group"><input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required /></div>
          <div className="form-group"><input type="password" name="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} required minLength="6" /></div>
          <div className="form-group"><input type="text" name="location" placeholder="Primary Location (e.g. Dubai)" value={formData.location} onChange={handleChange} required /></div>
          
          <div className="form-group" style={{ textAlign: 'left', marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select Services Provided:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {availableServices.map(svc => (
                <label key={svc.id} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.services.includes(svc.id)} onChange={() => handleCheckbox(svc.id)} /> {svc.label}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
            {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already registered? <Link to="/provider/login" style={{ color: '#0052cc', fontWeight: 'bold' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};
export default ProviderRegister;
