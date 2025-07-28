/**
 * COMPONENT: AdminOverview
 * MỤC ĐÍCH: Trang tổng quan dashboard cho admin hiển thị các thống kê và biểu đồ quan trọng
 * CHỨC NĂNG:
 * - Hiển thị các thống kê chính (người dùng, xét nghiệm)
 * - Biểu đồ tăng trưởng người dùng, phân loại xét nghiệm
 * - Thống kê theo tháng
 * - Sử dụng dữ liệu thực từ API
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
  const [dashboardData, setDashboardData] = useState({
    totals: {
      tests: 0,
      users: 0,
      customers: 0,
      staff: 0,
      managers: 0,
      admins: 0,
      activeUsers: 0,
      inactiveUsers: 0
    },
    monthly: {
      tests: [],
      users: [],
      customers: []
    },
    testMethods: {
      popular: [],
      total: 0
    },
    recentActivity: {
      tests: 0,
      users: 0,
      testGrowth: 0,
      userGrowth: 0,
      newUsers: []
    },
    userBreakdown: {
      customers: { count: 0, percentage: 0 },
      staff: { count: 0, percentage: 0 },
      managers: { count: 0, percentage: 0 },
      admins: { count: 0, percentage: 0 },
      active: { count: 0, percentage: 0 },
      inactive: { count: 0, percentage: 0 }
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load overview data
  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOverviewReports();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOverviewData();
  }, []);

  // Chart configurations
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

  const testMethodsData = {
    labels: dashboardData.testMethods.popular?.slice(0, 5).map(item => item.name) || [],
    datasets: [
      {
        data: dashboardData.testMethods.popular?.slice(0, 5).map(item => item.count) || [],
        backgroundColor: [
          '#dc3545',
          '#fd7e14', 
          '#ffc107',
          '#198754',
          '#6f42c1'
        ]
      }
    ]
  };

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
          <p className="mt-2 text-muted">Đang tải dữ liệu tổng quan...</p>
        </div>
      )}

      {/* Key Metrics Cards */}
      {!loading && (
        <>
          <Row className="mb-4">
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

          {/* Charts Row */}
          <Row className="mb-4">
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

          {/* Monthly Statistics */}
          <Row className="mb-4">
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

            <Col lg={4} className="mb-3">
              <Card className="border-0 shadow-sm h-100">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">
                    <i className="bi bi-person-lines-fill text-info me-2"></i>
                    Phân loại người dùng
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Khách hàng</span>
                      <Badge bg="success">{dashboardData.userBreakdown.customers.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="success" now={dashboardData.userBreakdown.customers.percentage} />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Nhân viên</span>
                      <Badge bg="info">{dashboardData.userBreakdown.staff.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="info" now={dashboardData.userBreakdown.staff.percentage} />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Quản lý</span>
                      <Badge bg="warning">{dashboardData.userBreakdown.managers.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="warning" now={dashboardData.userBreakdown.managers.percentage} />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Admin</span>
                      <Badge bg="danger">{dashboardData.userBreakdown.admins.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="danger" now={dashboardData.userBreakdown.admins.percentage} />
                  </div>

                  <hr />

                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Hoạt động</span>
                      <Badge bg="primary">{dashboardData.userBreakdown.active.percentage}%</Badge>
                    </div>
                    <ProgressBar variant="primary" now={dashboardData.userBreakdown.active.percentage} />
                  </div>

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

          {/* Recent Activity Summary */}
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

          {/* Recent New Users */}
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
