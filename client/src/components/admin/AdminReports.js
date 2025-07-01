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
  const [reportData, setReportData] = useState({
    overview: {
      totalRevenue: 2450000000,
      totalTests: 8947,
      totalUsers: 1234,
      avgTestTime: 3.5,
      customerSatisfaction: 94.5,
      monthlyGrowth: 15.8
    },
    tests: {
      byType: [
        { type: 'ADN Y', count: 3245, revenue: 980000000 },
        { type: 'ADN Ti thể', count: 2156, revenue: 650000000 },
        { type: 'STR', count: 1890, revenue: 470000000 },
        { type: 'SNP', count: 1045, revenue: 290000000 },
        { type: 'Khác', count: 611, revenue: 60000000 }
      ],
      monthly: [
        { month: 'T7', tests: 789, revenue: 195000000 },
        { month: 'T8', tests: 856, revenue: 218000000 },
        { month: 'T9', tests: 934, revenue: 245000000 },
        { month: 'T10', tests: 1023, revenue: 289000000 },
        { month: 'T11', tests: 1156, revenue: 334000000 },
        { month: 'T12', tests: 1289, revenue: 398000000 }
      ]
    },
    users: {
      acquisition: [
        { source: 'Website', users: 456, percentage: 37 },
        { source: 'Giới thiệu', users: 345, percentage: 28 },
        { source: 'Facebook', users: 234, percentage: 19 },
        { source: 'Google Ads', users: 123, percentage: 10 },
        { source: 'Khác', users: 76, percentage: 6 }
      ],
      demographics: {
        age: [
          { range: '18-25', count: 156 },
          { range: '26-35', count: 389 },
          { range: '36-45', count: 456 },
          { range: '46-55', count: 178 },
          { range: '56+', count: 55 }
        ],
        location: [
          { city: 'TP. Hồ Chí Minh', count: 567 },
          { city: 'Hà Nội', count: 234 },
          { city: 'Đà Nẵng', count: 123 },
          { city: 'Cần Thơ', count: 89 },
          { city: 'Khác', count: 221 }
        ]
      }
    },
    performance: {
      responseTime: [
        { time: '0-1h', count: 4567, percentage: 51 },
        { time: '1-4h', count: 2890, percentage: 32 },
        { time: '4-24h', count: 1234, percentage: 14 },
        { time: '24h+', count: 256, percentage: 3 }
      ],
      accuracy: [
        { lab: 'Lab A', accuracy: 99.8 },
        { lab: 'Lab B', accuracy: 99.5 },
        { lab: 'Lab C', accuracy: 99.9 }
      ]
    }
  });

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
    labels: reportData.tests.monthly.map(item => item.month),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: reportData.tests.monthly.map(item => item.revenue),
        borderColor: 'rgb(220, 53, 69)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4
      }
    ]
  };

  // Tests by type chart
  const testTypeData = {
    labels: reportData.tests.byType.map(item => item.type),
    datasets: [
      {
        data: reportData.tests.byType.map(item => item.count),
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

  // User acquisition chart
  const userAcquisitionData = {
    labels: reportData.users.acquisition.map(item => item.source),
    datasets: [
      {
        data: reportData.users.acquisition.map(item => item.users),
        backgroundColor: [
          '#dc3545',
          '#198754',
          '#0d6efd',
          '#ffc107',
          '#6c757d'
        ]
      }
    ]
  };

  // Monthly comparison chart
  const monthlyComparisonData = {
    labels: reportData.tests.monthly.map(item => item.month),
    datasets: [
      {
        label: 'Số xét nghiệm',
        data: reportData.tests.monthly.map(item => item.tests),
        backgroundColor: 'rgba(220, 53, 69, 0.8)',
        yAxisID: 'y'
      },
      {
        label: 'Doanh thu (triệu VNĐ)',
        data: reportData.tests.monthly.map(item => item.revenue / 1000000),
        backgroundColor: 'rgba(13, 110, 253, 0.8)',
        yAxisID: 'y1'
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

  const exportReport = (type) => {
    alert(`Đang xuất báo cáo ${type}...`);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-graph-up text-danger me-2"></i>
            Báo cáo & Thống kê
          </h2>
          <p className="text-muted mb-0">Phân tích dữ liệu và hiệu suất hoạt động</p>
        </div>
        <div className="d-flex gap-2">
          <Form.Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{width: 'auto'}}>
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="3months">3 tháng qua</option>
            <option value="6months">6 tháng qua</option>
            <option value="year">1 năm qua</option>
          </Form.Select>
          <Dropdown>
            <Dropdown.Toggle variant="outline-danger">
              <i className="bi bi-download me-2"></i>
              Xuất báo cáo
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => exportReport('PDF')}>
                <i className="bi bi-file-pdf me-2"></i>Xuất PDF
              </Dropdown.Item>
              <Dropdown.Item onClick={() => exportReport('Excel')}>
                <i className="bi bi-file-excel me-2"></i>Xuất Excel
              </Dropdown.Item>
              <Dropdown.Item onClick={() => exportReport('CSV')}>
                <i className="bi bi-file-csv me-2"></i>Xuất CSV
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <Row className="mb-4">
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-danger fs-4 mb-2">
                <i className="bi bi-currency-dollar"></i>
              </div>
              <h4 className="mb-0">{formatCurrency(reportData.overview.totalRevenue)}</h4>
              <small className="text-muted">Tổng doanh thu</small>
              <div className="mt-1">
                <small className="text-success">
                  <i className="bi bi-arrow-up"></i> +{reportData.overview.monthlyGrowth}%
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-success fs-4 mb-2">
                <i className="bi bi-clipboard-data"></i>
              </div>
              <h4 className="mb-0">{reportData.overview.totalTests.toLocaleString()}</h4>
              <small className="text-muted">Tổng xét nghiệm</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-primary fs-4 mb-2">
                <i className="bi bi-people"></i>
              </div>
              <h4 className="mb-0">{reportData.overview.totalUsers.toLocaleString()}</h4>
              <small className="text-muted">Tổng khách hàng</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-warning fs-4 mb-2">
                <i className="bi bi-clock"></i>
              </div>
              <h4 className="mb-0">{reportData.overview.avgTestTime}h</h4>
              <small className="text-muted">Thời gian TB</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-info fs-4 mb-2">
                <i className="bi bi-star"></i>
              </div>
              <h4 className="mb-0">{reportData.overview.customerSatisfaction}%</h4>
              <small className="text-muted">Hài lòng KH</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={2} md={4} sm={6} className="mb-3">
          <Card className="border-0 shadow-sm text-center h-100">
            <Card.Body>
              <div className="text-success fs-4 mb-2">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <h4 className="mb-0">+{reportData.overview.monthlyGrowth}%</h4>
              <small className="text-muted">Tăng trưởng</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
            <Tab eventKey="users" title={
              <span>
                <i className="bi bi-people me-2"></i>
                Khách hàng
              </span>
            } />
            <Tab eventKey="performance" title={
              <span>
                <i className="bi bi-speedometer me-2"></i>
                Hiệu suất
              </span>
            } />
          </Tabs>
        </Card.Header>

        <Card.Body>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <Row>
              <Col lg={8} className="mb-4">
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
              <Col lg={4} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-pie-chart text-danger me-2"></i>
                      Phân bổ theo loại xét nghiệm
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Doughnut data={testTypeData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">
                      <i className="bi bi-bar-chart text-danger me-2"></i>
                      So sánh theo tháng
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '350px' }}>
                      <Bar data={monthlyComparisonData} options={monthlyComparisonOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Tests Tab */}
          {activeTab === 'tests' && (
            <Row>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Thống kê theo loại xét nghiệm</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Loại xét nghiệm</th>
                          <th>Số lượng</th>
                          <th>Doanh thu</th>
                          <th>Tỷ lệ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.tests.byType.map((test, index) => (
                          <tr key={index}>
                            <td className="fw-medium">{test.type}</td>
                            <td>{test.count.toLocaleString()}</td>
                            <td>{formatCurrency(test.revenue)}</td>
                            <td>
                              <Badge bg="primary">
                                {((test.count / reportData.overview.totalTests) * 100).toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Xu hướng theo tháng</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Tháng</th>
                          <th>Số xét nghiệm</th>
                          <th>Doanh thu</th>
                          <th>Tăng trưởng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.tests.monthly.map((month, index) => (
                          <tr key={index}>
                            <td className="fw-medium">{month.month}</td>
                            <td>{month.tests.toLocaleString()}</td>
                            <td>{formatCurrency(month.revenue)}</td>
                            <td>
                              {index > 0 && (
                                <Badge bg={
                                  month.tests > reportData.tests.monthly[index-1].tests ? 'success' : 'danger'
                                }>
                                  {index > 0 ? (
                                    ((month.tests - reportData.tests.monthly[index-1].tests) / reportData.tests.monthly[index-1].tests * 100).toFixed(1)
                                  ) : 0}%
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <Row>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Nguồn khách hàng</h5>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ height: '300px' }}>
                      <Pie data={userAcquisitionData} options={chartOptions} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Phân bố độ tuổi</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Độ tuổi</th>
                          <th>Số lượng</th>
                          <th>Tỷ lệ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.users.demographics.age.map((age, index) => (
                          <tr key={index}>
                            <td className="fw-medium">{age.range}</td>
                            <td>{age.count.toLocaleString()}</td>
                            <td>
                              <Badge bg="info">
                                {((age.count / reportData.overview.totalUsers) * 100).toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Phân bố địa lý</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Thành phố</th>
                          <th>Số khách hàng</th>
                          <th>Tỷ lệ</th>
                          <th>Xu hướng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.users.demographics.location.map((location, index) => (
                          <tr key={index}>
                            <td className="fw-medium">{location.city}</td>
                            <td>{location.count.toLocaleString()}</td>
                            <td>
                              <Badge bg="success">
                                {((location.count / reportData.overview.totalUsers) * 100).toFixed(1)}%
                              </Badge>
                            </td>
                            <td>
                              <i className="bi bi-arrow-up text-success"></i>
                              <small className="text-success ms-1">+{Math.floor(Math.random() * 20)}%</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <Row>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Thời gian phản hồi</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Thời gian</th>
                          <th>Số lượng</th>
                          <th>Tỷ lệ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.performance.responseTime.map((time, index) => (
                          <tr key={index}>
                            <td className="fw-medium">{time.time}</td>
                            <td>{time.count.toLocaleString()}</td>
                            <td>
                              <Badge bg={
                                time.percentage > 50 ? 'success' : 
                                time.percentage > 30 ? 'warning' : 'danger'
                              }>
                                {time.percentage}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6} className="mb-4">
                <Card className="border-0 shadow-sm">
                  <Card.Header>
                    <h5 className="mb-0">Độ chính xác theo phòng lab</h5>
                  </Card.Header>
                  <Card.Body className="p-0">
                    <Table hover>
                      <thead className="bg-light">
                        <tr>
                          <th>Phòng lab</th>
                          <th>Độ chính xác</th>
                          <th>Đánh giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.performance.accuracy.map((lab, index) => (
                          <tr key={index}>
                            <td className="fw-medium">{lab.lab}</td>
                            <td>{lab.accuracy}%</td>
                            <td>
                              <Badge bg={
                                lab.accuracy > 99.5 ? 'success' : 
                                lab.accuracy > 99 ? 'warning' : 'danger'
                              }>
                                {lab.accuracy > 99.5 ? 'Xuất sắc' : 
                                 lab.accuracy > 99 ? 'Tốt' : 'Cần cải thiện'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
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