/**
 * COMPONENT: AdminReports
 * MỤC ĐÍCH: Trang báo cáo và thống kê chi tiết cho admin
 * CHỨC NĂNG:
 * - Báo cáo tổng quan về doanh thu, xét nghiệm, người dùng
 * - Thống kê theo loại xét nghiệm và nguồn khách hàng
 * - Phân tích hiệu suất và độ chính xác
 * - Xuất báo cáo theo các định dạng khác nhau
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Form, Table, Badge, 
  InputGroup, Dropdown, DatePicker, Alert, Tab, Tabs 
} from 'react-bootstrap';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { getDashboardReports } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminReports = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState({
    profits: { total: 0, daily: [] },
    tests: { total: 0, daily: [], popularServices: [] },
    bookings: { 
      total: 0, 
      daily: [], 
      popularServices: [], 
      statusBreakdown: { EXPIRED: 0, CANCELLED: 0, COMPLETE: 0, PENDING: 0, REFUNDED: 0 },
      staffPerformance: []
    },
    users: { 
      total: 0,
      customers: 0,
      staff: 0,
      managers: 0,
      admins: 0,
      active: 0,
      inactive: 0,
      dailyCustomerRegistrations: [],
      breakdown: {
        customers: { count: 0, percentage: 0 },
        staff: { count: 0, percentage: 0 },
        managers: { count: 0, percentage: 0 },
        admins: { count: 0, percentage: 0 },
        active: { count: 0, percentage: 0 },
        inactive: { count: 0, percentage: 0 }
      }
    }
  });

  const loadReports = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let requestData = { timeFilter: dateRange, ...filters };
      
      // If custom date range is being used, include start and end dates
      if (dateRange === 'custom' && customStartDate && customEndDate) {
        requestData = {
          startDate: customStartDate,
          endDate: customEndDate,
          ...filters
        };
      }
      
      const data = await getDashboardReports(requestData);
      console.log('Dashboard report data:', data);
      setReportData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading reports:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi tải dữ liệu',
        text: 'Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange !== 'custom') {
      loadReports();
    } else if (customStartDate && customEndDate) {
      loadReports();
    }
  }, [dateRange, customStartDate, customEndDate]);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    if (newRange === 'custom') {
      setShowCustomDateRange(true);
    } else {
      setShowCustomDateRange(false);
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const validateCustomDateRange = () => {
    if (!customStartDate || !customEndDate) {
      setError('Vui lòng chọn ngày bắt đầu và ngày kết thúc');
      Swal.fire({
        icon: 'warning',
        title: 'Thông tin không đầy đủ',
        text: 'Vui lòng chọn ngày bắt đầu và ngày kết thúc',
        confirmButtonColor: '#ffc107'
      });
      return false;
    }

    const start = new Date(customStartDate);
    const end = new Date(customEndDate);

    if (start > end) {
      setError('Ngày bắt đầu không thể sau ngày kết thúc');
      Swal.fire({
        icon: 'warning',
        title: 'Ngày không hợp lệ',
        text: 'Ngày bắt đầu không thể sau ngày kết thúc',
        confirmButtonColor: '#ffc107'
      });
      return false;
    }

    // Check if date range exceeds 1 year
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (end - start > oneYear) {
      setError('Khoảng thời gian không được vượt quá 1 năm');
      Swal.fire({
        icon: 'warning',
        title: 'Khoảng thời gian quá dài',
        text: 'Khoảng thời gian không được vượt quá 1 năm',
        confirmButtonColor: '#ffc107'
      });
      return false;
    }

    setError(null);
    return true;
  };

  const handleCustomDateSubmit = () => {
    if (validateCustomDateRange()) {
      loadReports();
      Swal.fire({
        icon: 'success',
        title: 'Áp dụng thành công!',
        text: 'Khoảng thời gian tùy chỉnh đã được áp dụng',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  };

  const handleRefresh = async () => {
    await loadReports();
    Swal.fire({
      icon: 'success',
      title: 'Làm mới thành công!',
      text: 'Dữ liệu báo cáo đã được cập nhật',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end'
    });
  };

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  // Revenue trend chart
  const revenueData = {
    labels: reportData.profits?.daily?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: reportData.profits?.daily?.map(item => item.amount) || [],
        borderColor: 'rgb(220, 53, 69)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Tests trend chart
  const testsData = {
    labels: reportData.tests?.daily?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Số xét nghiệm',
        data: reportData.tests?.daily?.map(item => item.count) || [],
        borderColor: 'rgb(13, 110, 253)',
        backgroundColor: 'rgba(13, 110, 253, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Customer registration trend chart
  const customerRegistrationData = {
    labels: reportData.users?.dailyCustomerRegistrations?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Khách hàng đăng ký mới',
        data: reportData.users?.dailyCustomerRegistrations?.map(item => item.count) || [],
        borderColor: 'rgb(25, 135, 84)',
        backgroundColor: 'rgba(25, 135, 84, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Popular services chart (from bookings data)
  const popularServicesData = {
    labels: reportData.bookings?.popularServices?.map(item => item.name) || [],
    datasets: [
      {
        data: reportData.bookings?.popularServices?.map(item => item.count) || [],
        backgroundColor: [
          '#dc3545', '#198754', '#0d6efd', '#ffc107', '#fd7e14',
          '#6f42c1', '#20c997', '#e83e8c', '#6c757d', '#f8f9fa'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Booking status breakdown chart
  const bookingStatusData = {
    labels: ['Hoàn thành', 'Đang chờ', 'Đã hủy', 'Hết hạn', 'Hoàn tiền'],
    datasets: [
      {
        data: [
          reportData.bookings?.statusBreakdown?.COMPLETE || 0,
          reportData.bookings?.statusBreakdown?.PENDING || 0,
          reportData.bookings?.statusBreakdown?.CANCELLED || 0,
          reportData.bookings?.statusBreakdown?.EXPIRED || 0,
          reportData.bookings?.statusBreakdown?.REFUNDED || 0
        ],
        backgroundColor: [
          '#198754', // green for completed
          '#ffc107', // yellow for pending
          '#dc3545', // red for cancelled
          '#6c757d', // gray for expired
          '#fd7e14'  // orange for refunded
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Daily bookings trend chart
  const dailyBookingsData = {
    labels: reportData.bookings?.daily?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Số đặt lịch',
        data: reportData.bookings?.daily?.map(item => item.count) || [],
        borderColor: 'rgb(102, 16, 242)',
        backgroundColor: 'rgba(102, 16, 242, 0.1)',
        tension: 0.4
      }
    ]
  };
  const userRoleData = {
    labels: ['Khách hàng', 'Nhân viên', 'Quản lý', 'Admin'],
    datasets: [
      {
        data: [
          reportData.users?.customers || 0,
          reportData.users?.staff || 0,
          reportData.users?.managers || 0,
          reportData.users?.admins || 0
        ],
        backgroundColor: [
          '#198754', // green for customers
          '#0dcaf0', // cyan for staff
          '#fd7e14', // orange for managers  
          '#dc3545'  // red for admins
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // User account status chart
  const userAccountStatusData = {
    labels: ['Hoạt động', 'Không hoạt động'],
    datasets: [
      {
        data: [
          reportData.users?.active || 0,
          reportData.users?.inactive || 0
        ],
        backgroundColor: [
          '#198754', // green for active
          '#dc3545'  // red for inactive
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const monthlyComparisonOptions = {
    ...chartOptions,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const dropdownItemStyle = {
    transition: 'all 0.2s ease',
    borderRadius: '6px',
    margin: '2px 8px'
  };

  // Add spin animation style
  const spinStyle = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spin {
      animation: spin 1s linear infinite;
    }
  `;

  // Inject CSS if not already present
  if (!document.querySelector('#spin-styles')) {
    const style = document.createElement('style');
    style.id = 'spin-styles';
    style.textContent = spinStyle;
    document.head.appendChild(style);
  }

  const exportReport = async (type) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: `Xuất báo cáo ${type}?`,
      text: `Bạn có muốn xuất báo cáo dưới định dạng ${type} không?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Xuất báo cáo',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      if (type === 'Excel') {
        exportToExcel();
      } else if (type === 'CSV') {
        exportToCSV();
      } else {
        // For other types like PDF (future implementation)
        Swal.fire({
          icon: 'info',
          title: 'Đang phát triển',
          text: `Chức năng xuất ${type} đang được phát triển`,
          confirmButtonColor: '#0d6efd'
        });
      }
    }
  };

  const exportToExcel = () => {
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Summary Sheet
      const summaryData = [
        ['BÁO CÁO TỔNG QUAN DASHBOARD'],
        ['Thời gian tạo:', new Date().toLocaleString('vi-VN')],
        ['Khoảng thời gian:', getDateRangeText()],
        [''],
        ['TỔNG QUAN'],
        ['Tổng doanh thu', formatCurrency(reportData.profits?.total || 0)],
        ['Tổng xét nghiệm', (reportData.tests?.total || 0).toLocaleString()],
        ['Tổng đặt lịch', (reportData.bookings?.total || 0).toLocaleString()],
        ['Tổng người dùng', (reportData.users?.total || 0).toLocaleString()],
        [''],
        ['PHÂN TÍCH NGƯỜI DÙNG'],
        ['Khách hàng', (reportData.users?.customers || 0).toLocaleString()],
        ['Nhân viên', (reportData.users?.staff || 0).toLocaleString()],
        ['Quản lý', (reportData.users?.managers || 0).toLocaleString()],
        ['Admin', (reportData.users?.admins || 0).toLocaleString()],
        ['Tài khoản hoạt động', (reportData.users?.active || 0).toLocaleString()],
        ['Tài khoản không hoạt động', (reportData.users?.inactive || 0).toLocaleString()],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Tổng quan');

      // Revenue Daily Data Sheet
      if (reportData.profits?.daily?.length > 0) {
        const revenueHeaders = [['Ngày', 'Doanh thu (VNĐ)']];
        const revenueData = reportData.profits.daily.map(item => [
          new Date(item.date).toLocaleDateString('vi-VN'),
          item.amount
        ]);
        const revenueSheet = XLSX.utils.aoa_to_sheet([...revenueHeaders, ...revenueData]);
        XLSX.utils.book_append_sheet(workbook, revenueSheet, 'Doanh thu theo ngày');
      }

      // Booking Status Sheet
      const bookingStatusHeaders = [['Trạng thái', 'Số lượng', 'Tỷ lệ (%)']];
      const bookingStatusData = [
        ['Hoàn thành', reportData.bookings?.statusBreakdown?.COMPLETE || 0, 
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.COMPLETE / reportData.bookings.total) * 100).toFixed(1) : 0],
        ['Đang chờ', reportData.bookings?.statusBreakdown?.PENDING || 0,
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.PENDING / reportData.bookings.total) * 100).toFixed(1) : 0],
        ['Đã hủy', reportData.bookings?.statusBreakdown?.CANCELLED || 0,
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.CANCELLED / reportData.bookings.total) * 100).toFixed(1) : 0],
        ['Hết hạn', reportData.bookings?.statusBreakdown?.EXPIRED || 0,
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.EXPIRED / reportData.bookings.total) * 100).toFixed(1) : 0],
        ['Hoàn tiền', reportData.bookings?.statusBreakdown?.REFUNDED || 0,
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.REFUNDED / reportData.bookings.total) * 100).toFixed(1) : 0]
      ];
      const bookingStatusSheet = XLSX.utils.aoa_to_sheet([...bookingStatusHeaders, ...bookingStatusData]);
      XLSX.utils.book_append_sheet(workbook, bookingStatusSheet, 'Trạng thái đặt lịch');

      // Staff Performance Sheet
      if (reportData.bookings?.staffPerformance?.length > 0) {
        const staffHeaders = [['Nhân viên', 'Tổng đặt lịch', 'Hoàn thành', 'Đã hủy', 'Hết hạn', 'Hoàn tiền', 'Đang chờ', 'Tỷ lệ hoàn thành (%)']];
        const staffData = reportData.bookings.staffPerformance.map(staff => [
          staff.name,
          staff.total,
          staff.completed,
          staff.cancelled,
          staff.expired,
          staff.refunded || 0,
          staff.pending,
          staff.completionRate
        ]);
        const staffSheet = XLSX.utils.aoa_to_sheet([...staffHeaders, ...staffData]);
        XLSX.utils.book_append_sheet(workbook, staffSheet, 'Hiệu suất nhân viên');
      }

      // Popular Services Sheet
      if (reportData.bookings?.popularServices?.length > 0) {
        const servicesHeaders = [['Thứ hạng', 'Tên dịch vụ', 'Số lần chọn', 'Tỷ lệ (%)']];
        const servicesData = reportData.bookings.popularServices.map((service, index) => [
          index + 1,
          service.name,
          service.count,
          ((service.count / reportData.bookings.total) * 100).toFixed(1)
        ]);
        const servicesSheet = XLSX.utils.aoa_to_sheet([...servicesHeaders, ...servicesData]);
        XLSX.utils.book_append_sheet(workbook, servicesSheet, 'Dịch vụ phổ biến');
      }

      // Tests Daily Data Sheet
      if (reportData.tests?.daily?.length > 0) {
        const testsHeaders = [['Ngày', 'Số xét nghiệm']];
        const testsData = reportData.tests.daily.map(item => [
          new Date(item.date).toLocaleDateString('vi-VN'),
          item.count
        ]);
        const testsSheet = XLSX.utils.aoa_to_sheet([...testsHeaders, ...testsData]);
        XLSX.utils.book_append_sheet(workbook, testsSheet, 'Xét nghiệm theo ngày');
      }

      // Customer Registration Sheet
      if (reportData.users?.dailyCustomerRegistrations?.length > 0) {
        const customerHeaders = [['Ngày', 'Khách hàng đăng ký mới']];
        const customerData = reportData.users.dailyCustomerRegistrations.map(item => [
          new Date(item.date).toLocaleDateString('vi-VN'),
          item.count
        ]);
        const customerSheet = XLSX.utils.aoa_to_sheet([...customerHeaders, ...customerData]);
        XLSX.utils.book_append_sheet(workbook, customerSheet, 'Đăng ký khách hàng');
      }

      // Generate filename
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `bao-cao-dashboard-${dateStr}.xlsx`;

      // Write the workbook
      XLSX.writeFile(workbook, filename);
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Xuất báo cáo thành công!',
        text: `Báo cáo Excel đã được tải về: ${filename}`,
        confirmButtonColor: '#198754',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Lỗi xuất báo cáo',
        text: 'Có lỗi xảy ra khi xuất báo cáo Excel. Vui lòng thử lại.',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'OK'
      });
    }
  };

  const exportToCSV = () => {
    try {
      // Create summary data for CSV
      const csvData = [
        ['BÁO CÁO TỔNG QUAN DASHBOARD'],
        ['Thời gian tạo', new Date().toLocaleString('vi-VN')],
        ['Khoảng thời gian', getDateRangeText()],
        [''],
        ['TỔNG QUAN'],
        ['Tổng doanh thu', reportData.profits?.total || 0],
        ['Tổng xét nghiệm', reportData.tests?.total || 0],
        ['Tổng đặt lịch', reportData.bookings?.total || 0],
        ['Tổng người dùng', reportData.users?.total || 0],
        [''],
        ['TRẠNG THÁI ĐẶT LỊCH'],
        ['Trạng thái', 'Số lượng', 'Tỷ lệ (%)'],
        ['Hoàn thành', reportData.bookings?.statusBreakdown?.COMPLETE || 0, 
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.COMPLETE / reportData.bookings.total) * 100).toFixed(1) : 0],
        ['Đang chờ', reportData.bookings?.statusBreakdown?.PENDING || 0,
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.PENDING / reportData.bookings.total) * 100).toFixed(1) : 0],
        ['Đã hủy', reportData.bookings?.statusBreakdown?.CANCELLED || 0,
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.CANCELLED / reportData.bookings.total) * 100).toFixed(1) : 0],
        ['Hết hạn', reportData.bookings?.statusBreakdown?.EXPIRED || 0,
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.EXPIRED / reportData.bookings.total) * 100).toFixed(1) : 0],
        ['Hoàn tiền', reportData.bookings?.statusBreakdown?.REFUNDED || 0,
         reportData.bookings?.total > 0 ? ((reportData.bookings.statusBreakdown.REFUNDED / reportData.bookings.total) * 100).toFixed(1) : 0]
      ];

      // Convert to CSV string
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      const dateStr = new Date().toISOString().slice(0, 10);
      link.setAttribute('download', `bao-cao-dashboard-${dateStr}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Xuất báo cáo thành công!',
        text: `Báo cáo CSV đã được tải về: bao-cao-dashboard-${dateStr}.csv`,
        confirmButtonColor: '#198754',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Lỗi xuất báo cáo',
        text: 'Có lỗi xảy ra khi xuất báo cáo CSV. Vui lòng thử lại.',
        confirmButtonColor: '#dc3545',
        confirmButtonText: 'OK'
      });
    }
  };

  const getDateRangeText = () => {
    if (dateRange === 'custom' && customStartDate && customEndDate) {
      return `${new Date(customStartDate).toLocaleDateString('vi-VN')} - ${new Date(customEndDate).toLocaleDateString('vi-VN')}`;
    }
    
    switch (dateRange) {
      case '7days': return '7 ngày qua';
      case '30days': return '30 ngày qua';
      case '3months': return '3 tháng qua';
      case '6months': return '6 tháng qua';
      case '1year': return '1 năm qua';
      default: return dateRange;
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1">
              <i className="bi bi-graph-up text-danger me-2"></i>
              Báo cáo & Thống kê
            </h2>
            <p className="text-muted mb-0">Phân tích dữ liệu và hiệu suất hoạt động</p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              onClick={handleRefresh}
              disabled={loading}
              className="d-flex align-items-center"
              size="sm"
            >
              <i className={`bi bi-arrow-clockwise me-2 ${loading ? 'spin' : ''}`}></i>
              Làm mới
            </Button>
            
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-danger" 
                className="d-flex align-items-center px-3 py-2 border-2"
                size="sm"
                style={{ 
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
              >
                <i className="bi bi-download me-2"></i>
                Xuất báo cáo
                <i className="bi bi-chevron-down ms-2"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu 
                className="shadow-lg border-0" 
                style={{ 
                  minWidth: '220px',
                  borderRadius: '12px',
                  padding: '8px 0'
                }}
              >
                <Dropdown.Header className="text-muted small">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Chọn định dạng xuất
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item 
                  onClick={() => exportReport('Excel')}
                  className="d-flex align-items-center py-2"
                  style={dropdownItemStyle}
                >
                  <div className="me-3 text-success">
                    <i className="bi bi-file-earmark-excel fs-5"></i>
                  </div>
                  <div>
                    <div className="fw-medium">Xuất Excel</div>
                    <small className="text-muted">Tệp .xlsx với nhiều sheet</small>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => exportReport('CSV')}
                  className="d-flex align-items-center py-2"
                  style={dropdownItemStyle}
                >
                  <div className="me-3 text-primary">
                    <i className="bi bi-file-earmark-spreadsheet fs-5"></i>
                  </div>
                  <div>
                    <div className="fw-medium">Xuất CSV</div>
                    <small className="text-muted">Tệp .csv đơn giản</small>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        
        {/* Filters Row */}
        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
          <div className="d-flex align-items-center gap-2">
            <label className="form-label mb-0 fw-medium text-nowrap">
              <i className="bi bi-calendar3 me-2"></i>
              Khoảng thời gian:
            </label>
            <Form.Select 
              value={dateRange} 
              onChange={(e) => handleDateRangeChange(e.target.value)} 
              style={{width: '180px'}}
              disabled={loading}
            >
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="3months">3 tháng qua</option>
              <option value="6months">6 tháng qua</option>
              <option value="1year">1 năm qua</option>
              <option value="custom">Tùy chỉnh</option>
            </Form.Select>
          </div>
          
          {showCustomDateRange && (
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                placeholder="Ngày bắt đầu"
                style={{width: '150px'}}
                disabled={loading}
              />
              <span className="text-muted">đến</span>
              <Form.Control
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                placeholder="Ngày kết thúc"
                style={{width: '150px'}}
                disabled={loading}
              />
              <Button 
                variant="primary" 
                onClick={handleCustomDateSubmit}
                disabled={loading || !customStartDate || !customEndDate}
                size="sm"
              >
                <i className="bi bi-search me-2"></i>
                Áp dụng
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2 text-muted">Đang tải dữ liệu báo cáo...</p>
        </div>
      )}

      {/* Key Metrics Summary */}
      {!loading && (
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <div className="text-danger fs-4 mb-2">
                  <i className="bi bi-currency-dollar"></i>
                </div>
                <h4 className="mb-0">{formatCurrency(reportData.profits?.total || 0)}</h4>
                <small className="text-muted">Tổng doanh thu</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <div className="text-success fs-4 mb-2">
                  <i className="bi bi-clipboard-data"></i>
                </div>
                <h4 className="mb-0">{(reportData.tests?.total || 0).toLocaleString()}</h4>
                <small className="text-muted">Tổng xét nghiệm</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <div className="text-info fs-4 mb-2">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h4 className="mb-0">{(reportData.bookings?.total || 0).toLocaleString()}</h4>
                <small className="text-muted">Tổng đặt lịch</small>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3} md={6} className="mb-3">
            <Card className="border-0 shadow-sm text-center h-100">
              <Card.Body>
                <div className="text-primary fs-4 mb-2">
                  <i className="bi bi-people"></i>
                </div>
                <h4 className="mb-0">{(reportData.users?.total || 0).toLocaleString()}</h4>
                <small className="text-muted">Tổng khách hàng</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Detailed Reports Tabs */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="border-0"
          >
            <Tab eventKey="overview" title={
              <span>
                <i className="bi bi-speedometer2 me-2"></i>
                Tổng quan
              </span>
            } />
            <Tab eventKey="tests" title={
              <span>
                <i className="bi bi-clipboard-data me-2"></i>
                Xét nghiệm
              </span>
            } />
            <Tab eventKey="bookings" title={
              <span>
                <i className="bi bi-calendar-check me-2"></i>
                Đặt lịch
              </span>
            } />
            <Tab eventKey="users" title={
              <span>
                <i className="bi bi-people me-2"></i>
                Khách hàng
              </span>
            } />
          </Tabs>
        </Card.Header>

        <Card.Body>
          {/* Overview Tab */}
          {activeTab === 'overview' && !loading && (
            <Row>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-graph-up text-danger me-2"></i>
                      Xu hướng doanh thu
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Line data={revenueData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-graph-up text-info me-2"></i>
                      Xu hướng đặt lịch
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Line data={dailyBookingsData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-graph-up text-success me-2"></i>
                      Xu hướng đăng ký khách hàng
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Line data={customerRegistrationData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-graph-up text-primary me-2"></i>
                      Xu hướng xét nghiệm
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Line data={testsData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Tests Tab */}
          {activeTab === 'tests' && !loading && (
            <Row>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Dịch vụ được chọn nhiều nhất</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    {reportData.bookings?.popularServices?.length > 0 ? (
                      <Table hover>
                        <thead className="bg-light">
                          <tr>
                            <th>Thứ hạng</th>
                            <th>Tên dịch vụ</th>
                            <th>Số lần chọn</th>
                            <th>Tỷ lệ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.bookings.popularServices.map((service, index) => (
                            <tr key={index}>
                              <td className="fw-medium">
                                <Badge bg={index < 3 ? 'warning' : 'secondary'}>
                                  #{index + 1}
                                </Badge>
                              </td>
                              <td>{service.name}</td>
                              <td>{service.count.toLocaleString()}</td>
                              <td>
                                <Badge bg="primary">
                                  {((service.count / reportData.bookings.total) * 100).toFixed(1)}%
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted">Không có dữ liệu dịch vụ trong khoảng thời gian này</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Thống kê xét nghiệm theo ngày</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    {reportData.tests?.daily?.length > 0 ? (
                      <Table hover>
                        <thead className="bg-light">
                          <tr>
                            <th>Ngày</th>
                            <th>Số xét nghiệm</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.tests.daily.map((day, index) => (
                            <tr key={index}>
                              <td className="fw-medium">{new Date(day.date).toLocaleDateString('vi-VN')}</td>
                              <td>{day.count.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted">Không có dữ liệu xét nghiệm trong khoảng thời gian này</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && !loading && (
            <Row>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-pie-chart text-info me-2"></i>
                      Trạng thái đặt lịch
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Doughnut data={bookingStatusData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-pie-chart text-warning me-2"></i>
                      Dịch vụ phổ biến
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Doughnut data={popularServicesData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Chi tiết trạng thái đặt lịch</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Trạng thái</th>
                          <th>Số lượng</th>
                          <th>Tỷ lệ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-check-circle text-success me-2"></i>
                            Hoàn thành
                          </td>
                          <td>{(reportData.bookings?.statusBreakdown?.COMPLETE || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="success">
                              {reportData.bookings?.total > 0 ? 
                                ((reportData.bookings.statusBreakdown.COMPLETE / reportData.bookings.total) * 100).toFixed(1) : 0}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-clock text-warning me-2"></i>
                            Đang chờ
                          </td>
                          <td>{(reportData.bookings?.statusBreakdown?.PENDING || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="warning">
                              {reportData.bookings?.total > 0 ? 
                                ((reportData.bookings.statusBreakdown.PENDING / reportData.bookings.total) * 100).toFixed(1) : 0}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-x-circle text-danger me-2"></i>
                            Đã hủy
                          </td>
                          <td>{(reportData.bookings?.statusBreakdown?.CANCELLED || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="danger">
                              {reportData.bookings?.total > 0 ? 
                                ((reportData.bookings.statusBreakdown.CANCELLED / reportData.bookings.total) * 100).toFixed(1) : 0}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-hourglass text-secondary me-2"></i>
                            Hết hạn
                          </td>
                          <td>{(reportData.bookings?.statusBreakdown?.EXPIRED || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="secondary">
                              {reportData.bookings?.total > 0 ? 
                                ((reportData.bookings.statusBreakdown.EXPIRED / reportData.bookings.total) * 100).toFixed(1) : 0}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-arrow-return-left text-warning me-2"></i>
                            Hoàn tiền
                          </td>
                          <td>{(reportData.bookings?.statusBreakdown?.REFUNDED || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="warning">
                              {reportData.bookings?.total > 0 ? 
                                ((reportData.bookings.statusBreakdown.REFUNDED / reportData.bookings.total) * 100).toFixed(1) : 0}%
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Hiệu suất nhân viên</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    {reportData.bookings?.staffPerformance?.length > 0 ? (
                      <Table hover>
                        <thead className="bg-light">
                          <tr>
                            <th>Nhân viên</th>
                            <th>Tổng đặt lịch</th>
                            <th>Hoàn thành</th>
                            <th>Đã hủy</th>
                            <th>Hết hạn</th>
                            <th>Hoàn tiền</th>
                            <th>Đang chờ</th>
                            <th>Tỷ lệ hoàn thành</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.bookings.staffPerformance.map((staff, index) => (
                            <tr key={index}>
                              <td className="fw-medium">{staff.name}</td>
                              <td>{staff.total.toLocaleString()}</td>
                              <td>
                                <Badge bg="success">
                                  {staff.completed}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg="danger">
                                  {staff.cancelled}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg="secondary">
                                  {staff.expired}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg="warning">
                                  {staff.refunded || 0}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg="info">
                                  {staff.pending}
                                </Badge>
                              </td>
                              <td>
                                <Badge bg={staff.completionRate >= 80 ? 'success' : staff.completionRate >= 60 ? 'warning' : 'danger'}>
                                  {staff.completionRate}%
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted">Không có dữ liệu hiệu suất nhân viên trong khoảng thời gian này</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && !loading && (
            <Row>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-pie-chart text-primary me-2"></i>
                      Phân bổ người dùng theo vai trò
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Doughnut data={userRoleData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Chi tiết thống kê người dùng</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Vai trò</th>
                          <th>Số lượng</th>
                          <th>Tỷ lệ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-person text-success me-2"></i>
                            Khách hàng
                          </td>
                          <td>{(reportData.users?.customers || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="success">
                              {reportData.users?.breakdown?.customers?.percentage || 0}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-person-badge text-info me-2"></i>
                            Nhân viên
                          </td>
                          <td>{(reportData.users?.staff || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="info">
                              {reportData.users?.breakdown?.staff?.percentage || 0}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-person-gear text-warning me-2"></i>
                            Quản lý
                          </td>
                          <td>{(reportData.users?.managers || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="warning">
                              {reportData.users?.breakdown?.managers?.percentage || 0}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-person-fill-gear text-danger me-2"></i>
                            Admin
                          </td>
                          <td>{(reportData.users?.admins || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="danger">
                              {reportData.users?.breakdown?.admins?.percentage || 0}%
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-pie-chart text-warning me-2"></i>
                      Trạng thái tài khoản người dùng
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Doughnut data={userAccountStatusData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Chi tiết trạng thái tài khoản</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Trạng thái</th>
                          <th>Số lượng</th>
                          <th>Tỷ lệ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-check-circle text-success me-2"></i>
                            Hoạt động
                          </td>
                          <td>{(reportData.users?.active || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="success">
                              {reportData.users?.breakdown?.active?.percentage || 0}%
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            <i className="bi bi-x-circle text-danger me-2"></i>
                            Không hoạt động
                          </td>
                          <td>{(reportData.users?.inactive || 0).toLocaleString()}</td>
                          <td>
                            <Badge bg="danger">
                              {reportData.users?.breakdown?.inactive?.percentage || 0}%
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={12} className="mb-4">
                <Card className="border-0 shadow-sm text-center">
                  <Card.Header>
                    <h5 className="mb-0">Tổng quan người dùng</h5>
                  </Card.Header>
                  <Card.Body className="py-4">
                    <Row className="justify-content-between align-items-center text-center gx-2">
                      <Col className="d-flex flex-column align-items-center px-2">
                        <div className="text-primary fs-1 mb-3">
                          <i className="bi bi-people"></i>
                        </div>
                        <h2 className="mb-2 fw-bold">{(reportData.users?.total || 0).toLocaleString()}</h2>
                        <h6 className="text-muted mb-0">Tổng người dùng</h6>
                      </Col>
                      <Col className="d-flex flex-column align-items-center px-2">
                        <div className="text-success fs-1 mb-3">
                          <i className="bi bi-person"></i>
                        </div>
                        <h2 className="mb-2 fw-bold">{(reportData.users?.customers || 0).toLocaleString()}</h2>
                        <h6 className="text-muted mb-0">Khách hàng</h6>
                      </Col>
                      <Col className="d-flex flex-column align-items-center px-2">
                        <div className="text-info fs-1 mb-3">
                          <i className="bi bi-person-badge"></i>
                        </div>
                        <h2 className="mb-2 fw-bold">{(reportData.users?.staff || 0).toLocaleString()}</h2>
                        <h6 className="text-muted mb-0">Nhân viên</h6>
                      </Col>
                      <Col className="d-flex flex-column align-items-center px-2">
                        <div className="text-warning fs-1 mb-3">
                          <i className="bi bi-person-gear"></i>
                        </div>
                        <h2 className="mb-2 fw-bold">{(reportData.users?.managers || 0).toLocaleString()}</h2>
                        <h6 className="text-muted mb-0">Quản lý</h6>
                      </Col>
                      <Col className="d-flex flex-column align-items-center px-2">
                        <div className="text-danger fs-1 mb-3">
                          <i className="bi bi-person-fill-gear"></i>
                        </div>
                        <h2 className="mb-2 fw-bold">{(reportData.users?.admins || 0).toLocaleString()}</h2>
                        <h6 className="text-muted mb-0">Admin</h6>
                      </Col>
                      <Col className="d-flex flex-column align-items-center px-2">
                        <div className="text-success fs-1 mb-3">
                          <i className="bi bi-check-circle"></i>
                        </div>
                        <h2 className="mb-2 fw-bold">{(reportData.users?.active || 0).toLocaleString()}</h2>
                        <h6 className="text-muted mb-0">Hoạt động</h6>
                      </Col>
                      <Col className="d-flex flex-column align-items-center px-2">
                        <div className="text-danger fs-1 mb-3">
                          <i className="bi bi-x-circle"></i>
                        </div>
                        <h2 className="mb-2 fw-bold">{(reportData.users?.inactive || 0).toLocaleString()}</h2>
                        <h6 className="text-muted mb-0">Không hoạt động</h6>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminReports;