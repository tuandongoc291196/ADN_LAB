/**
 * COMPONENT: AdminOverview
 * MỤC ĐÍCH: Trang tổng quan dashboard cho admin hiển thị các thống kê và biểu đồ quan trọng
 * CHỨC NĂNG:
 * - Hiển thị các thống kê chính (người dùng, xét nghiệm, đơn hàng)
 * - Biểu đồ tăng trưởng người dùng, phân loại xét nghiệm
 * - Hoạt động gần đây của hệ thống
 * - Tình trạng sức khỏe hệ thống
 */

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, ProgressBar, Table, Alert, Button } from 'react-bootstrap';
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
    stats: {
      totalUsers: 1234,
      totalPosts: 89,
      totalGuides: 15,
      totalTests: 2567,
      monthlyGrowth: 12.5,
      activeUsers: 456,
      pendingOrders: 23,
      completedTests: 2544
    },
    recentActivities: [
      { id: 1, type: 'user', action: 'Người dùng mới đăng ký', user: 'Nguyễn Văn A', time: '5 phút trước', icon: 'bi-person-plus', color: 'success' },
      { id: 2, type: 'test', action: 'Đơn xét nghiệm mới', user: 'Trần Thị B', time: '10 phút trước', icon: 'bi-clipboard-plus', color: 'info' },
      { id: 3, type: 'blog', action: 'Bài viết được đăng', user: 'Admin', time: '1 giờ trước', icon: 'bi-newspaper', color: 'primary' },
      { id: 4, type: 'system', action: 'Backup hệ thống hoàn tất', user: 'System', time: '2 giờ trước', icon: 'bi-shield-check', color: 'warning' },
      { id: 5, type: 'test', action: 'Kết quả xét nghiệm đã gửi', user: 'Lê Văn C', time: '3 giờ trước', icon: 'bi-envelope-check', color: 'success' }
    ],
    systemHealth: {
      server: 98.5,
      database: 99.2,
      storage: 87.3,
      network: 95.8
    }
  });

  // Chart configurations
  const userGrowthData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    datasets: [
      {
        label: 'Người dùng mới',
        data: [45, 52, 38, 67, 58, 73, 82],
        borderColor: 'rgb(220, 53, 69)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4
      }
    ]
  };

  const testTypesData = {
    labels: ['ADN Y', 'ADN Ti thể', 'STR', 'SNP', 'Khác'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
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
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    datasets: [
      {
        label: 'Xét nghiệm',
        data: [320, 450, 380, 520, 480, 600],
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
      },
      {
        label: 'Người dùng mới',
        data: [180, 220, 190, 280, 250, 320],
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

      {/* Key Metrics Cards */}
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
                  <h3 className="mb-0">{dashboardData.stats.totalUsers.toLocaleString()}</h3>
                  <p className="text-muted mb-0">Tổng người dùng</p>
                  <small className="text-success">
                    <i className="bi bi-arrow-up"></i> +{dashboardData.stats.monthlyGrowth}% tháng này
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
                  <h3 className="mb-0">{dashboardData.stats.totalTests.toLocaleString()}</h3>
                  <p className="text-muted mb-0">Tổng xét nghiệm</p>
                  <small className="text-success">
                    <i className="bi bi-check-circle"></i> {dashboardData.stats.completedTests} hoàn thành
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
                    <i className="bi bi-clock-history text-warning fs-4"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h3 className="mb-0">{dashboardData.stats.pendingOrders}</h3>
                  <p className="text-muted mb-0">Đơn chờ xử lý</p>
                  <small className="text-warning">
                    <i className="bi bi-exclamation-triangle"></i> Cần xử lý
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
                  <h3 className="mb-0">{dashboardData.stats.activeUsers}</h3>
                  <p className="text-muted mb-0">Đang hoạt động</p>
                  <small className="text-info">
                    <i className="bi bi-clock"></i> 24h qua
                  </small>
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
                Thống kê theo tháng
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Bar data={monthlyStatsData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <i className="bi bi-pie-chart text-danger me-2"></i>
                Loại xét nghiệm
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Doughnut data={testTypesData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row>
        <Col lg={8} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <i className="bi bi-clock-history text-danger me-2"></i>
                Hoạt động gần đây
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                {dashboardData.recentActivities.map(activity => (
                  <div key={activity.id} className="list-group-item border-0">
                    <div className="d-flex align-items-center">
                      <div className={`bg-${activity.color} bg-opacity-10 rounded-circle p-2 me-3`}>
                        <i className={`${activity.icon} text-${activity.color}`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-medium">{activity.action}</div>
                        <small className="text-muted">bởi {activity.user}</small>
                      </div>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">
                <i className="bi bi-shield-check text-danger me-2"></i>
                Tình trạng hệ thống
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Server</small>
                  <small>{dashboardData.systemHealth.server}%</small>
                </div>
                <ProgressBar 
                  now={dashboardData.systemHealth.server} 
                  variant={dashboardData.systemHealth.server > 95 ? 'success' : 'warning'}
                  size="sm"
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Database</small>
                  <small>{dashboardData.systemHealth.database}%</small>
                </div>
                <ProgressBar 
                  now={dashboardData.systemHealth.database} 
                  variant={dashboardData.systemHealth.database > 95 ? 'success' : 'warning'}
                  size="sm"
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Storage</small>
                  <small>{dashboardData.systemHealth.storage}%</small>
                </div>
                <ProgressBar 
                  now={dashboardData.systemHealth.storage} 
                  variant={dashboardData.systemHealth.storage > 90 ? 'success' : dashboardData.systemHealth.storage > 80 ? 'warning' : 'danger'}
                  size="sm"
                />
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Network</small>
                  <small>{dashboardData.systemHealth.network}%</small>
                </div>
                <ProgressBar 
                  now={dashboardData.systemHealth.network} 
                  variant={dashboardData.systemHealth.network > 95 ? 'success' : 'warning'}
                  size="sm"
                />
              </div>

              <Alert variant="success" className="mb-0 small">
                <i className="bi bi-check-circle me-1"></i>
                Tất cả hệ thống hoạt động bình thường
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminOverview;