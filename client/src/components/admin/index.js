/**
 * FILE: Admin Components Index
 * MỤC ĐÍCH: Tập trung export tất cả các component admin để dễ import trong các file khác
 * CHỨC NĂNG: Cung cấp điểm truy cập duy nhất cho tất cả các component admin
 */

// Export các component admin riêng lẻ
// Mỗi component đại diện cho một chức năng quản trị khác nhau
export { default as AdminDashboard } from './AdminDashboard';      // Dashboard chính của admin
export { default as AdminOverview } from './AdminOverview';        // Trang tổng quan với thống kê
export { default as BlogManagement } from './BlogManagement';      // Quản lý bài viết blog
export { default as GuideManagement } from './GuideManagement';    // Quản lý hướng dẫn xét nghiệm
export { default as TechnologyManagement } from './TechnologyManagement'; // Quản lý công nghệ và thiết bị
export { default as AdminReports } from './AdminReports';          // Báo cáo và thống kê chi tiết
export { default as UserManagement } from './UserManagement';      // Quản lý người dùng và khách hàng
export { default as SystemSettings } from './SystemSettings';      // Cài đặt hệ thống và giao diện

// Export nhóm components dưới dạng object để sử dụng linh hoạt
// Có thể import toàn bộ: import { AdminComponents } from './admin'
// Sau đó sử dụng: AdminComponents.Dashboard, AdminComponents.Overview, etc.
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

// Export mặc định là AdminDashboard - component chính
// Cho phép import đơn giản: import AdminDashboard from './admin'
export default AdminDashboard;