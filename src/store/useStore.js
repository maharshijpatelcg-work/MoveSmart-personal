// MoveSmart — Zustand Global Store
import { create } from 'zustand';
import { mockUser, mockEmergencyContacts, mockSavedRoutes, mockNotifications } from '../services/mockData';

const useStore = create((set, get) => ({
  // --- Auth State ---
  isAuthenticated: JSON.parse(localStorage.getItem('ms_auth') || 'false'),
  hasSeenOnboarding: JSON.parse(localStorage.getItem('ms_onboarding') || 'false'),
  user: JSON.parse(localStorage.getItem('ms_user') || 'null') || mockUser,

  login: (userData) => {
    const user = { ...mockUser, ...userData };
    localStorage.setItem('ms_auth', 'true');
    localStorage.setItem('ms_user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },

  signup: (userData) => {
    const user = { ...mockUser, ...userData, totalTrips: 0, totalDistance: 0, safetyScore: 100 };
    localStorage.setItem('ms_auth', 'true');
    localStorage.setItem('ms_user', JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },

  logout: () => {
    localStorage.removeItem('ms_auth');
    localStorage.removeItem('ms_user');
    set({ isAuthenticated: false, user: null });
  },

  completeOnboarding: () => {
    localStorage.setItem('ms_onboarding', 'true');
    set({ hasSeenOnboarding: true });
  },

  // --- Theme ---
  darkMode: JSON.parse(localStorage.getItem('ms_dark') || 'false'),
  toggleDarkMode: () => {
    const newVal = !get().darkMode;
    localStorage.setItem('ms_dark', JSON.stringify(newVal));
    document.documentElement.setAttribute('data-theme', newVal ? 'dark' : 'light');
    set({ darkMode: newVal });
  },

  // --- Notifications ---
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.read).length,

  markNotificationRead: (id) => {
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  },

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

  // --- Emergency Contacts ---
  emergencyContacts: JSON.parse(localStorage.getItem('ms_contacts') || 'null') || mockEmergencyContacts,

  addEmergencyContact: (contact) => {
    const contacts = [...get().emergencyContacts, { ...contact, id: 'ec_' + Date.now() }];
    localStorage.setItem('ms_contacts', JSON.stringify(contacts));
    set({ emergencyContacts: contacts });
  },

  removeEmergencyContact: (id) => {
    const contacts = get().emergencyContacts.filter((c) => c.id !== id);
    localStorage.setItem('ms_contacts', JSON.stringify(contacts));
    set({ emergencyContacts: contacts });
  },

  // --- Saved Routes ---
  savedRoutes: JSON.parse(localStorage.getItem('ms_routes') || 'null') || mockSavedRoutes,

  saveRoute: (route) => {
    const routes = [...get().savedRoutes, { ...route, id: 'sr_' + Date.now() }];
    localStorage.setItem('ms_routes', JSON.stringify(routes));
    set({ savedRoutes: routes });
  },

  removeRoute: (id) => {
    const routes = get().savedRoutes.filter((r) => r.id !== id);
    localStorage.setItem('ms_routes', JSON.stringify(routes));
    set({ savedRoutes: routes });
  },

  // --- Location Sharing ---
  isLocationSharing: false,
  toggleLocationSharing: () => set({ isLocationSharing: !get().isLocationSharing }),

  // --- AI Chatbot ---
  isChatOpen: false,
  toggleChat: () => set({ isChatOpen: !get().isChatOpen }),
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
}));

export default useStore;
