// Admin Components Index
// This file exports all admin components for easy importing

export { default as AdminDashboard } from './AdminDashboard';
export { default as AdminOverview } from './AdminOverview';
export { default as BlogManagement } from './BlogManagement';
export { default as GuideManagement } from './GuideManagement';
export { default as TechnologyManagement } from './TechnologyManagement';
export { default as AdminReports } from './AdminReports';
export { default as UserManagement } from './UserManagement';
export { default as SystemSettings } from './SystemSettings';

// You can also create grouped exports if needed
export const AdminComponents = {
  Dashboard: AdminDashboard,
  Overview: AdminOverview,
  BlogManagement,
  GuideManagement,
  TechnologyManagement,
  Reports: AdminReports,
  UserManagement,
  SystemSettings
};

// Default export for the main dashboard
export default AdminDashboard;