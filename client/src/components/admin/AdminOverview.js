/**
 * COMPONENT: AdminOverview
 * CHỨC NĂNG: Trang tổng quan dashboard cho admin hiển thị các thống kê và biểu đồ quan trọng
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải dữ liệu tổng quan từ API getOverviewReports()
 * 2. Xử lý và chuẩn bị dữ liệu cho các biểu đồ Chart.js
 * 3. Hiển thị các thống kê chính (người dùng, xét nghiệm, hoạt động)
 * 4. Render các biểu đồ: Line chart (tăng trưởng người dùng), Doughnut chart (phương pháp xét nghiệm), Bar chart (thống kê theo tháng)
 * 5. Hiển thị phân loại người dùng với progress bars
 * 6. Hiển thị danh sách người dùng đăng ký gần đây
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, ProgressBar, Alert, Table } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
import { getOverviewReports } from '../../services/api';

// REGISTER CHART.JS COMPONENTS: Đăng ký các component cần thiết cho Chart.js
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

const AdminOverview = ({ user }) => {
  // STATE QUẢN LÝ DỮ LIỆU DASHBOARD
  const [dashboardData, setDashboardData] = useState({
    totals: {
      tests: 0,           // Tổng số xét nghiệm
      users: 0,           // Tổng số người dùng
      customers: 0,       // Tổng số khách hàng
      staff: 0,           // Tổng số nhân viên
      managers: 0,        // Tổng số quản lý
      admins: 0,          // Tổng số admin
      activeUsers: 0,     // Người dùng hoạt động
      inactiveUsers: 0    // Người dùng không hoạt động
    },
    monthly: {
      tests: [],          // Dữ liệu xét nghiệm theo tháng
      users: [],          // Dữ liệu người dùng theo tháng
      customers: []       // Dữ liệu khách hàng theo tháng
    },
    testMethods: {
      popular: [],        // Phương pháp xét nghiệm phổ biến
      total: 0            // Tổng số loại phương pháp
    },
    recentActivity: {
      tests: 0,           // Số xét nghiệm gần đây
      users: 0,           // Số người dùng gần đây
      testGrowth: 0,      // Tăng trưởng xét nghiệm
      userGrowth: 0,      // Tăng trưởng người dùng
      newUsers: []        // Danh sách người dùng mới
    },
    userBreakdown: {
      customers: { count: 0, percentage: 0 },    // Phân loại khách hàng
      staff: { count: 0, percentage: 0 },        // Phân loại nhân viên
      managers: { count: 0, percentage: 0 },     // Phân loại quản lý
      admins: { count: 0, percentage: 0 },       // Phân loại admin
      active: { count: 0, percentage: 0 },       // Người dùng hoạt động
      inactive: { count: 0, percentage: 0 }      // Người dùng không hoạt động
    }
  });
  
  // STATE QUẢN LÝ UI
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  /**
   * EFFECT: Load dữ liệu tổng quan từ API
   * BƯỚC 1: Gọi API getOverviewReports() để lấy dữ liệu dashboard
   * BƯỚC 2: Cập nhật state dashboardData với dữ liệu nhận được
   * BƯỚC 3: Xử lý lỗi nếu có
   * BƯỚC 4: Set loading state thành false
   */
  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setLoading(true);
        setError(null);
        // BƯỚC 1: Gọi API getOverviewReports()
        const data = await getOverviewReports();
        // BƯỚC 2: Cập nhật state dashboardData với dữ liệu nhận được
        setDashboardData(data);
      } catch (err) {
        // BƯỚC 3: Xử lý lỗi nếu có
        setError(err.message);
      } finally {
        // BƯỚC 4: Set loading state thành false
        setLoading(false);
      }
    };

    loadOverviewData();
  }, []);

  /**
   * CHART CONFIGURATION: Dữ liệu cho biểu đồ tăng trưởng người dùng (Line Chart)
   * BƯỚC 1: Lấy labels từ dữ liệu monthly.users (12 tháng gần nhất)
   * BƯỚC 2: Lấy data từ count của mỗi tháng
   * BƯỚC 3: Cấu hình màu sắc và style cho line chart
   */
  const userGrowthData = {
    labels: dashboardData.monthly.users?.slice(0, 12).reverse().map(item => item.monthName) || [],
    datasets: [
      {
        label: 'Người dùng mới',
        data: dashboardData.monthly.users?.slice(0, 12).reverse().map(item => item.count) || [],
        borderColor: 'rgb(220, 53, 69)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4
      }
    ]
  };

  /**
   * CHART CONFIGURATION: Dữ liệu cho biểu đồ phương pháp xét nghiệm (Doughnut Chart)
   * BƯỚC 1: Lấy labels từ tên phương pháp phổ biến (top 5)
   * BƯỚC 2: Lấy data từ số lượng sử dụng mỗi phương pháp
   * BƯỚC 3: Cấu hình màu sắc cho từng phần của doughnut
   */
  const testMethodsData = {
    labels: dashboardData.testMethods.popular?.slice(0, 5).map(item => item.name) || [],
    datasets: [
      {
        data: dashboardData.testMethods.popular?.slice(0, 5).map(item => item.count) || [],
        backgroundColor: [
          '#dc3545',  // Đỏ
          '#fd7e14',  // Cam
          '#ffc107',  // Vàng
          '#198754',  // Xanh lá
          '#6f42c1'   // Tím
        ]
      }
    ]
  };

  /**
   * CHART CONFIGURATION: Dữ liệu cho biểu đồ thống kê theo tháng (Bar Chart)
   * BƯỚC 1: Lấy labels từ tên tháng (6 tháng gần nhất)
   * BƯỚC 2: Tạo 2 datasets: xét nghiệm và người dùng mới
   * BƯỚC 3: Cấu hình màu sắc cho từng dataset
   */
  const monthlyStatsData = {
    labels: dashboardData.monthly.tests?.slice(0, 6).reverse().map(item => item.monthName) || [],
    datasets: [
      {
        label: 'Xét nghiệm',
        data: dashboardData.monthly.tests?.slice(0, 6).reverse().map(item => item.count) || [],
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
      },
      {
        label: 'Người dùng mới',
        data: dashboardData.monthly.users?.slice(0, 6).reverse().map(item => item.count) || [],
        backgroundColor: 'rgba(13, 110, 253, 0.8)',
      }
    ]
  };

  /**
   * CONSTANT DATA: Cấu hình chung cho tất cả biểu đồ
   * BƯỚC 1: Set responsive và maintainAspectRatio
   * BƯỚC 2: Cấu hình legend position
   */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  return (
    <div>
      {/* ERROR ALERT: Hiển thị lỗi nếu có */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* LOADING STATE: Hiển thị loading trong khi tải dữ liệu */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2 text-muted">Đang tải dữ liệu tổng quan...</p>
        </div>
      )}

      {/* MAIN CONTENT: Hiển thị dashboard khi đã tải xong */}
      {!loading && (
        <>
          {/* KEY METRICS CARDS: Các thống kê chính */}
          <Row className="mb-4">
            {/* CARD 1: Tổng người dùng */}
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                        <i className="bi bi-people text-primary fs-4"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h3 className="mb-0">{dashboardData.totals.users.toLocaleString()}</h3>
                      <p className="text-muted mb-0">Tổng người dùng</p>
                      <small className={`${dashboardData.recentActivity.userGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
                        <i className={`bi ${dashboardData.recentActivity.userGrowth >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i> 
                        {Math.abs(dashboardData.recentActivity.userGrowth)}% so với 30 ngày trước
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* CARD 2: Tổng xét nghiệm */}
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-success bg-opacity-10 rounded-3 p-3">
                        <i className="bi bi-clipboard-data text-success fs-4"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h3 className="mb-0">{dashboardData.totals.tests.toLocaleString()}</h3>
                      <p className="text-muted mb-0">Tổng xét nghiệm</p>
                      <small className={`${dashboardData.recentActivity.testGrowth >= 0 ? 'text-success' : 'text-danger'}`}>
                        <i className={`bi ${dashboardData.recentActivity.testGrowth >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i> 
                        {Math.abs(dashboardData.recentActivity.testGrowth)}% so với 30 ngày trước
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* CARD 3: Người dùng hoạt động */}
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-info bg-opacity-10 rounded-3 p-3">
                        <i className="bi bi-person-check text-info fs-4"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h3 className="mb-0">{dashboardData.totals.activeUsers.toLocaleString()}</h3>
                      <p className="text-muted mb-0">Người dùng hoạt động</p>
                      <small className="text-info">
                        {dashboardData.userBreakdown.active.percentage}% tổng người dùng
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* CARD 4: Đăng ký gần đây */}
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-warning bg-opacity-10 rounded-3 p-3">
                        <i className="bi bi-graph-up text-warning fs-4"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h3 className="mb-0">{dashboardData.recentActivity.users}</h3>
                      <p className="text-muted mb-0">Đăng ký gần đây</p>
                      <small className="text-muted">30 ngày qua</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* CHARTS ROW: Biểu đồ tăng trưởng và phương pháp xét nghiệm */}
          <Row className="mb-4">
            {/* LINE CHART: Tăng trưởng người dùng theo tháng */}
            <Col lg={8} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-graph-up text-danger me-2"></i>
                    Tăng trưởng người dùng theo tháng
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '300px' }}>
                    <Line data={userGrowthData} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* DOUGHNUT CHART: Phương pháp xét nghiệm phổ biến */}
            <Col lg={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-pie-chart text-success me-2"></i>
                    Phương pháp xét nghiệm phổ biến
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '300px' }}>
                    <Doughnut data={testMethodsData} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* MONTHLY STATISTICS: Thống kê theo tháng và phân loại người dùng */}
          <Row className="mb-4">
            {/* BAR CHART: Thống kê theo tháng */}
            <Col lg={8} className="mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-bar-chart text-primary me-2"></i>
                    Thống kê theo tháng
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '350px' }}>
                    <Bar data={monthlyStatsData} options={chartOptions} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* USER BREAKDOWN: Phân loại người dùng với progress bars */}
            <Col lg={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-person-lines-fill text-info me-2"></i>
                    Phân loại người dùng
                  </h5>
                </Card.Header>
                <Card.Body>
                  {/* Khách hàng */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Khách hàng</span>
                      <Badge bg="success">{dashboardData.userBreakdown.customers.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="success" now={dashboardData.userBreakdown.customers.percentage} />
                  </div>

                  {/* Nhân viên */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Nhân viên</span>
                      <Badge bg="info">{dashboardData.userBreakdown.staff.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="info" now={dashboardData.userBreakdown.staff.percentage} />
                  </div>

                  {/* Quản lý */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Quản lý</span>
                      <Badge bg="warning">{dashboardData.userBreakdown.managers.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="warning" now={dashboardData.userBreakdown.managers.percentage} />
                  </div>

                  {/* Admin */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Admin</span>
                      <Badge bg="danger">{dashboardData.userBreakdown.admins.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="danger" now={dashboardData.userBreakdown.admins.percentage} />
                  </div>

                  <hr />

                  {/* Hoạt động */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Hoạt động</span>
                      <Badge bg="primary">{dashboardData.userBreakdown.active.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="primary" now={dashboardData.userBreakdown.active.percentage} />
                  </div>

                  {/* Không hoạt động */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Không hoạt động</span>
                      <Badge bg="secondary">{dashboardData.userBreakdown.inactive.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="secondary" now={dashboardData.userBreakdown.inactive.percentage} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* RECENT ACTIVITY SUMMARY: Tổng quan hoạt động gần đây */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-activity text-warning me-2"></i>
                    Tổng quan hoạt động gần đây (30 ngày)
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="text-center">
                    <Col md={3}>
                      <div className="border-end">
                        <h4 className="text-primary">{dashboardData.recentActivity.users}</h4>
                        <p className="text-muted mb-0">Người dùng mới</p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border-end">
                        <h4 className="text-success">{dashboardData.recentActivity.tests}</h4>
                        <p className="text-muted mb-0">Xét nghiệm mới</p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="border-end">
                        <h4 className="text-warning">{dashboardData.testMethods.total}</h4>
                        <p className="text-muted mb-0">Loại xét nghiệm</p>
                      </div>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-info">{dashboardData.totals.activeUsers}</h4>
                      <p className="text-muted mb-0">Tài khoản hoạt động</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* RECENT NEW USERS: Danh sách người dùng đăng ký gần đây */}
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-person-plus text-success me-2"></i>
                    Người dùng đăng ký gần đây
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {dashboardData.recentActivity.newUsers?.length > 0 ? (
                    <Table hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="border-0">Họ tên</th>
                          <th className="border-0">Vai trò</th>
                          <th className="border-0">Trạng thái</th>
                          <th className="border-0">Ngày đăng ký</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentActivity.newUsers.map((user, index) => (
                          <tr key={user.id}>
                            <td className="fw-medium">
                              <i className="bi bi-person-circle text-muted me-2"></i>
                              {user.fullname}
                            </td>
                            <td>
                              <Badge bg={
                                user.roleId === "0" ? "success" :
                                user.roleId === "1" ? "info" :
                                user.roleId === "2" ? "warning" :
                                user.roleId === "3" ? "danger" : "secondary"
                              }>
                                {user.roleName}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={user.accountStatus === "active" ? "success" : "secondary"}>
                                <i className={`bi ${user.accountStatus === "active" ? "bi-check-circle" : "bi-x-circle"} me-1`}></i>
                                {user.accountStatus === "active" ? "Hoạt động" : "Không hoạt động"}
                              </Badge>
                            </td>
                            <td className="text-muted">
                              {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-person-plus text-muted fs-2"></i>
                      <p className="text-muted mt-2 mb-0">Chưa có người dùng mới trong 30 ngày qua</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default AdminOverview;
