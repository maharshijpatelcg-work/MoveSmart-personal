import React, { useState } from 'react';
import { AlertTriangle, MapPin, Plus, X, Phone } from 'lucide-react';
import useStore from '../store/useStore';
import { isNightTime, vibrateDevice } from '../utils/helpers';
import './Safety.css';

export default function Safety() {
  const {
    emergencyContacts,
    addEmergencyContact,
    removeEmergencyContact,
    isLocationSharing,
    toggleLocationSharing,
  } = useStore();

  const [sosActivated, setSosActivated] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });

  const handleSOS = () => {
    vibrateDevice([300, 100, 300, 100, 300]);
    setSosActivated(true);
  };

  const cancelSOS = () => {
    setSosActivated(false);
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      addEmergencyContact(newContact);
      setNewContact({ name: '', phone: '', relation: '' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="page safety-page" id="safety-screen">
      {/* Header */}
      <div className="safety-header animate-fade-in">
        <h1>🛡️ Safety Center</h1>
        <p>Your safety is our #1 priority</p>
      </div>

      {/* Night Mode Banner */}
      {isNightTime() && (
        <div className="night-mode-banner animate-fade-in-up">
          <span className="night-icon">🌙</span>
          <div className="night-info">
            <h4>Night Mode Active</h4>
            <p>Enhanced safety features enabled for night travel</p>
          </div>
        </div>
      )}

      {/* SOS Section */}
      <div className="sos-section">
        <div className="sos-button-wrapper">
          <div className="sos-ripple-1" />
          <div className="sos-ripple-2" />
          <div className="sos-ripple-3" />
          <button
            className="sos-button"
            onClick={handleSOS}
            id="sos-button"
            aria-label="Activate SOS Emergency"
          >
            <span className="sos-icon">🚨</span>
            SOS
            <span className="sos-text">Press for Emergency</span>
          </button>
        </div>
        <p className="sos-label">
          Tap to send emergency alert with your live location
        </p>
      </div>

      {/* SOS Activated State */}
      {sosActivated && (
        <div className="sos-activated">
          <div className="sos-activated-header">
            <AlertTriangle size={16} />
            Emergency Alert Sent!
          </div>
          <p className="sos-activated-text">
            Your live location has been shared with {emergencyContacts.length} emergency contact{emergencyContacts.length !== 1 ? 's' : ''}. 
            Help is on the way.
          </p>
          <button className="sos-cancel-btn" onClick={cancelSOS}>
            Cancel Emergency
          </button>
        </div>
      )}

      {/* Live Location Sharing */}
      <div className="location-sharing-card">
        <div className="sharing-header">
          <h3>
            <MapPin size={16} />
            Live Location Sharing
          </h3>
          <button
            className={`toggle-switch ${isLocationSharing ? 'active' : ''}`}
            onClick={toggleLocationSharing}
            id="location-sharing-toggle"
            aria-label="Toggle location sharing"
          >
            <div className="toggle-knob" />
          </button>
        </div>
        <p className="sharing-description">
          {isLocationSharing
            ? '✅ Your location is being shared with emergency contacts in real-time.'
            : 'Share your real-time location with trusted contacts for added safety.'}
        </p>
      </div>

      {/* Emergency Contacts */}
      <div className="contacts-section">
        <div className="contacts-header">
          <h3>Emergency Contacts</h3>
          <button className="add-contact-btn" onClick={() => setShowAddModal(true)} id="add-contact-btn">
            <Plus size={14} />
            Add
          </button>
        </div>

        {emergencyContacts.map((contact) => (
          <div key={contact.id} className="contact-card">
            <div className="contact-avatar">
              {contact.name.charAt(0)}
            </div>
            <div className="contact-info">
              <h4>{contact.name}</h4>
              <p>{contact.relation} · {contact.phone}</p>
            </div>
            <button
              className="contact-remove"
              onClick={() => removeEmergencyContact(contact.id)}
              aria-label={`Remove ${contact.name}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}

        {emergencyContacts.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
            No emergency contacts yet. Add your trusted contacts above.
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Emergency Contact</h3>

            <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
              <label className="form-label">Name</label>
              <input
                className="input-field"
                placeholder="Contact name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 'var(--space-3)' }}>
              <label className="form-label">Phone Number</label>
              <input
                className="input-field"
                placeholder="+91 98765 43210"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Relation</label>
              <input
                className="input-field"
                placeholder="e.g., Mother, Friend"
                value={newContact.relation}
                onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddContact}>
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
