import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReportManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [reportType, setReportType] = useState('revenue');
  const [reportData, setReportData] = useState(null);

  // Mock data for reports
  const mockReportData = {
    revenue: {
      total: 150000000,
      byService: [
        { name: 'Xét nghiệm ADN Cha Con', amount: 75000000, count: 30 },
        { name: 'Xét nghiệm ADN Mẹ Con', amount: 50000000, count: 20 },
        { name: 'Xét nghiệm ADN Họ Hàng', amount: 25000000, count: 10 }
      ],
      byMonth: [
        { month: '1/2024', amount: 45000000 },
        { month: '2/2024', amount: 55000000 },
        { month: '3/2024', amount: 50000000 }
      ]
    },
    appointments: {
      total: 60,
      byStatus: [
        { status: 'Đã xác nhận', count: 30 },
        { status: 'Hoàn thành', count: 20 },
        { status: 'Đã hủy', count: 10 }
      ],
      byDay: [
        { day: '2024-03-18', count: 5 },
        { day: '2024-03-19', count: 8 },
        { day: '2024-03-20', count: 6 }
      ]
    },
    staff: {
      total: 5,
      performance: [
        { name: 'Trần Thị B', completedTests: 150, accuracy: 99.5, rating: 4.8 },
        { name: 'Nguyễn Văn E', completedTests: 200, accuracy: 98.9, rating: 4.7 },
        { name: 'Lê Văn F', completedTests: 80, accuracy: 99.2, rating: 4.6 }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call
    setReportData(mockReportData);
    setLoading(false);
  }, []);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleGenerateReport = () => {
    // TODO: Implement API call to generate report
    toast.success('Đã tạo báo cáo thành công!');
  };

  const handleExportReport = () => {
    // TODO: Implement export functionality
    toast.success('Đã xuất báo cáo thành công!');
  };

  const renderRevenueReport = () => (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Tổng doanh thu</h5>
          </div>
          <div className="card-body">
            <h3 className="text-primary">
              {reportData.revenue.total.toLocaleString('vi-VN')} VNĐ
            </h3>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Doanh thu theo dịch vụ</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Dịch vụ</th>
                    <th>Số lượng</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.revenue.byService.map((service, index) => (
                    <tr key={index}>
                      <td>{service.name}</td>
                      <td>{service.count}</td>
                      <td>{service.amount.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Doanh thu theo tháng</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.revenue.byMonth.map((month, index) => (
                    <tr key={index}>
                      <td>{month.month}</td>
                      <td>{month.amount.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointmentReport = () => (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Tổng số lịch hẹn</h5>
          </div>
          <div className="card-body">
            <h3 className="text-primary">{reportData.appointments.total}</h3>
          </div>
        </div>
      </div>
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Lịch hẹn theo trạng thái</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Trạng thái</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.appointments.byStatus.map((status, index) => (
                    <tr key={index}>
                      <td>{status.status}</td>
                      <td>{status.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Lịch hẹn theo ngày</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.appointments.byDay.map((day, index) => (
                    <tr key={index}>
                      <td>{day.day}</td>
                      <td>{day.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStaffReport = () => (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Tổng số nhân viên</h5>
          </div>
          <div className="card-body">
            <h3 className="text-primary">{reportData.staff.total}</h3>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Hiệu suất nhân viên</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nhân viên</th>
                    <th>Số xét nghiệm</th>
                    <th>Độ chính xác</th>
                    <th>Đánh giá</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.staff.performance.map((staff, index) => (
                    <tr key={index}>
                      <td>{staff.name}</td>
                      <td>{staff.completedTests}</td>
                      <td>{staff.accuracy}%</td>
                      <td>{staff.rating}/5</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý báo cáo</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={handleExportReport}
          >
            <i className="bi bi-download me-2"></i>
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Loại báo cáo</label>
                <select
                  className="form-select"
                  value={reportType}
                  onChange={handleReportTypeChange}
                >
                  <option value="revenue">Doanh thu</option>
                  <option value="appointments">Lịch hẹn</option>
                  <option value="staff">Nhân viên</option>
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Từ ngày</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Đến ngày</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">&nbsp;</label>
                <button
                  className="btn btn-primary w-100"
                  onClick={handleGenerateReport}
                >
                  Tạo báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {reportData && (
        <>
          {reportType === 'revenue' && renderRevenueReport()}
          {reportType === 'appointments' && renderAppointmentReport()}
          {reportType === 'staff' && renderStaffReport()}
        </>
      )}
    </div>
  );
};

export default ReportManagement; 