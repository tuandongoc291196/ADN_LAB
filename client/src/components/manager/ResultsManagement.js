import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup, Tabs, Tab } from 'react-bootstrap';
import { getAllBookings, getTestResultByBookingId, updateTestResult, getSamplesByBookingId, addBookingHistory, getBookingById } from '../../services/api';
import Swal from 'sweetalert2';

/**
 * COMPONENT: ResultsManagement
 * CHỨC NĂNG: Quản lý kết quả xét nghiệm - cho phép manager xem, phê duyệt và giao kết quả
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách booking từ API getAllBookings()
 * 2. Lọc các booking có status: result_pending, complete, sent_result
 * 3. Lấy thông tin test result chi tiết cho từng booking
 * 4. Hiển thị danh sách theo tab: Chất lượng, Sẵn sàng trả, Đã giao
 * 5. Cho phép manager phê duyệt kết quả và giao cho khách hàng
 */
const ResultsManagement = ({ user }) => {
    // ===== STATE MANAGEMENT =====
    // Danh sách kết quả gốc từ API
    const [results, setResults] = useState([]);
    // Danh sách kết quả đã được filter theo search và status
    const [filteredResults, setFilteredResults] = useState([]);
    
    // Modal states - quản lý các popup
    const [showResultModal, setShowResultModal] = useState(false);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    
    // Selected data - dữ liệu được chọn để xem chi tiết
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    
    // Filter states - bộ lọc tìm kiếm và trạng thái
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // UI states - quản lý giao diện
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [activeTab, setActiveTab] = useState('quality-review');
    
    // Delivery states - thông tin giao kết quả
    const [deliveryMethod, setDeliveryMethod] = useState('email');
    const [deliveryDetails, setDeliveryDetails] = useState({
        email: '',
        phone: '',
        address: '',
        recipientName: '',
        notes: ''
    });
    
    // Test result form state - form nhập kết quả xét nghiệm
    const [testResults, setTestResults] = useState({
        conclusion: '',
        confidence: '',
        method: 'STR Analysis (Short Tandem Repeat)',
        analysisDate: '',
        technician: '',
        labCode: '',
        markers: [],
        qualityScore: '',
        notes: '',
        bookingId: '',
        customerName: '',
        phone: '',
        serviceName: '',
        serviceType: '',
        samples: []
    });

    // ===== DATA FETCHING - LẤY DỮ LIỆU TỪ API =====
    /**
     * useEffect: Tải dữ liệu khi component mount
     * BƯỚC 1: Gọi API getAllBookings() để lấy tất cả booking
     * BƯỚC 2: Lọc các booking có status phù hợp (result_pending, complete, sent_result)
     * BƯỚC 3: Với mỗi booking, gọi API getTestResultByBookingId() để lấy kết quả chi tiết
     * BƯỚC 4: Transform dữ liệu thành format hiển thị
     * BƯỚC 5: Cập nhật state results và filteredResults
     */
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // BƯỚC 1: Lấy tất cả booking từ API
                const bookings = await getAllBookings();
                
                // BƯỚC 2: Đảm bảo bookings là array và xử lý format dữ liệu
                let bookingList = Array.isArray(bookings)
                    ? bookings
                    : (Array.isArray(bookings?.bookings) ? bookings.bookings : []);
                
                // BƯỚC 3: Lọc các booking có status RESULT_PENDING, COMPLETE và SENT_RESULT
                const resultPending = bookingList.filter(b => {
                    // Lấy booking history để xác định status mới nhất
                    const histories = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
                    const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    const latestStatus = sorted[0]?.status?.toLowerCase() || b.status?.toLowerCase() || '';
                    
                    // Chỉ lấy các booking có status phù hợp để quản lý kết quả
                    return latestStatus === 'result_pending' || latestStatus === 'complete' || latestStatus === 'sent_result';
                });

                // BƯỚC 4: Lấy thông tin chi tiết từ getTestResultByBookingId cho từng booking
                const detailedResults = await Promise.all(
                    resultPending.map(async (b) => {
                        try {
                            // Gọi API lấy test result cho booking này
                            const testResult = await getTestResultByBookingId(b.id);
                            const testResultData = Array.isArray(testResult) ? testResult[0] : testResult;
                            
                            // Lấy status cuối cùng từ history hoặc booking
                            const histories = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
                            const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                            const latestStatus = sorted[0]?.status?.toLowerCase() || b.status?.toLowerCase() || '';
                            
                            // BƯỚC 5: Transform dữ liệu thành format hiển thị
                            return {
                                id: b.id,
                                customerName: b.informations_on_booking?.[0]?.name || 'Không rõ',
                                phone: b.informations_on_booking?.[0]?.phone || '',
                                email: b.informations_on_booking?.[0]?.email || '',
                                address: b.informations_on_booking?.[0]?.address || '',
                                serviceName: b.service?.title || 'Không rõ dịch vụ',
                                serviceType: b.service?.category?.hasLegalValue ? 'civil' : 'administrative',
                                labCode: b.labCode || '',
                                completedDate: b.completedDate || b.updatedAt || (Array.isArray(b.bookingHistories_on_booking) && b.bookingHistories_on_booking[0]?.createdAt) || '',
                                technician: b.staff?.user?.fullname || '',
                                status: latestStatus, // chỉ dùng 'result_pending', 'complete' hoặc 'sent_result'
                                priority: b.priority || 'medium',
                                hasLegalValue: b.service?.category?.hasLegalValue || false,
                                result: {
                                    conclusion: testResultData?.positive === true ? 'POSITIVE' : testResultData?.positive === false ? 'NEGATIVE' : 'INCONCLUSIVE',
                                    confidence: testResultData?.accuracy || 0,
                                    method: testResultData?.testMethod || 'N/A',
                                    notes: testResultData?.resultNotes || '',
                                    positive: testResultData?.positive || false,
                                    testType: testResultData?.testType || 'civil',
                                    reportDate: testResultData?.reportDate || '',
                                    testDate: testResultData?.testDate || '',
                                    manager: testResultData?.manager || null,
                                    staff: testResultData?.staff || null
                                },
                                participants: b.participants_on_booking || [],
                                orderDate: b.createdAt || '',
                                categoryName: b.service?.category?.name || '',
                            };
                        } catch (error) {
                            console.error(`Error fetching test result for booking ${b.id}:`, error);
                            // Fallback nếu không lấy được test result - tạo dữ liệu mặc định
                            const histories = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
                            const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                            const latestStatus = sorted[0]?.status?.toLowerCase() || b.status?.toLowerCase() || '';
                            return {
                                id: b.id,
                                customerName: b.informations_on_booking?.[0]?.name || 'Không rõ',
                                phone: b.informations_on_booking?.[0]?.phone || '',
                                email: b.informations_on_booking?.[0]?.email || '',
                                address: b.informations_on_booking?.[0]?.address || '',
                                serviceName: b.service?.title || 'Không rõ dịch vụ',
                                serviceType: b.service?.category?.hasLegalValue ? 'civil' : 'administrative',
                                labCode: b.labCode || '',
                                completedDate: b.completedDate || b.updatedAt || (Array.isArray(b.bookingHistories_on_booking) && b.bookingHistories_on_booking[0]?.createdAt) || '',
                                technician: b.staff?.user?.fullname || '',
                                status: latestStatus, // chỉ dùng 'result_pending', 'complete' hoặc 'sent_result'
                                priority: b.priority || 'medium',
                                hasLegalValue: b.service?.category?.hasLegalValue || false,
                                result: {
                                    conclusion: 'INCONCLUSIVE',
                                    confidence: 0,
                                    method: 'N/A',
                                    notes: '',
                                    positive: false,
                                    testType: 'civil',
                                    reportDate: '',
                                    testDate: '',
                                    manager: null,
                                    staff: null
                                },
                                participants: b.participants_on_booking || [],
                                orderDate: b.createdAt || '',
                                categoryName: b.service?.category?.name || '',
                            };
                        }
                    })
                );
                
                // BƯỚC 6: Cập nhật state với dữ liệu đã xử lý
                setResults(detailedResults);
                setFilteredResults(detailedResults);
            } catch (err) {
                // Xử lý lỗi khi không thể tải dữ liệu
                setAlert({ show: true, message: 'Không thể tải danh sách booking: ' + err.message, type: 'danger' });
            }
        };

        fetchBookings();
    }, []);

    // ===== FILTER LOGIC - BỘ LỌC DỮ LIỆU =====
    /**
     * useEffect: Lọc dữ liệu khi searchTerm hoặc filterStatus thay đổi
     * BƯỚC 1: Bắt đầu với danh sách results gốc
     * BƯỚC 2: Lọc theo searchTerm (tìm trong id, tên khách, số điện thoại, mã lab)
     * BƯỚC 3: Lọc theo filterStatus (all, result_pending, complete, sent_result)
     * BƯỚC 4: Cập nhật filteredResults state
     */
    useEffect(() => {
        let filtered = results;

        // BƯỚC 2: Lọc theo từ khóa tìm kiếm
        if (searchTerm) {
            filtered = filtered.filter(result =>
                result.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                result.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                result.phone.includes(searchTerm) ||
                result.labCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // BƯỚC 3: Lọc theo trạng thái
        if (filterStatus !== 'all') {
            filtered = filtered.filter(result => result.status?.toLowerCase() === filterStatus.toLowerCase());
        }

        // BƯỚC 4: Cập nhật state
        setFilteredResults(filtered);
    }, [searchTerm, filterStatus, results]);

    // ===== HELPER FUNCTIONS - CÁC HÀM TIỆN ÍCH =====
    /**
     * getResultBadge: Tạo badge hiển thị kết quả xét nghiệm
     * INPUT: conclusion (POSITIVE, NEGATIVE, INCONCLUSIVE)
     * OUTPUT: JSX Badge component với màu sắc và icon tương ứng
     */
    const getResultBadge = (conclusion) => {
        const resultConfig = {
            'POSITIVE': { bg: 'success', text: 'DƯƠNG TÍNH', icon: 'bi-check-circle' },
            'NEGATIVE': { bg: 'danger', text: 'ÂM TÍNH', icon: 'bi-x-circle' },
            'INCONCLUSIVE': { bg: 'warning', text: 'KHÔNG KẾT LUẬN', icon: 'bi-question-circle' }
        };
        const config = resultConfig[conclusion] || { bg: 'secondary', text: 'CHƯA XÁC ĐỊNH', icon: 'bi-circle' };
        return (
            <Badge bg={config.bg} className="p-2">
                <i className={`${config.icon} me-1`}></i>
                {config.text}
            </Badge>
        );
    };

    // ===== EVENT HANDLERS - XỬ LÝ SỰ KIỆN =====
    /**
     * handleViewResult: Xem chi tiết kết quả xét nghiệm
     * BƯỚC 1: Gọi API để lấy thông tin chi tiết (booking, testResult, samples)
     * BƯỚC 2: Transform dữ liệu thành format hiển thị
     * BƯỚC 3: Cập nhật selectedResult state
     * BƯỚC 4: Mở modal hiển thị chi tiết
     */
    const handleViewResult = async (result) => {
        try {
            // BƯỚC 1: Lấy thông tin chi tiết từ API - gọi song song để tối ưu tốc độ
            const [booking, testResult, samples] = await Promise.all([
                getBookingById(result.id),
                getTestResultByBookingId(result.id),
                getSamplesByBookingId(result.id)
            ]);

            // BƯỚC 2: Cập nhật selectedResult với thông tin chi tiết
            const testResultData = Array.isArray(testResult) ? testResult[0] : testResult;

            const detailedResult = {
                ...result,
                booking: booking,
                testResult: testResult,
                samples: samples,
                // Cập nhật thông tin từ testResult
                serviceName: booking?.service?.title || result.serviceName,
                result: {
                    ...result.result,
                    conclusion: testResultData?.positive === true ? 'POSITIVE' : testResultData?.positive === false ? 'NEGATIVE' : result.result?.conclusion,
                    confidence: testResultData?.accuracy || result.result?.confidence,
                    method: testResultData?.testMethod || result.result?.method,
                    notes: testResultData?.resultNotes || result.result?.notes,
                    positive: testResultData?.positive || result.result?.positive,
                    testType: testResultData?.testType || result.result?.testType,
                    reportDate: testResultData?.reportDate || result.result?.reportDate,
                    testDate: testResultData?.testDate || result.result?.testDate,
                    manager: testResultData?.manager || result.result?.manager,
                    staff: testResultData?.staff || result.result?.staff
                }
            };

            console.log('API Response:', { booking, testResult, samples });
            console.log('Detailed Result:', detailedResult);
            setSelectedResult(detailedResult);
            setShowResultModal(true);
        } catch (error) {
            console.error('Error fetching result details:', error);
            // Fallback to original result if API fails
            setSelectedResult(result);
            setShowResultModal(true);
        }
    };

    /**
     * handlePrepareDelivery: Chuẩn bị giao kết quả
     * BƯỚC 1: Cập nhật selectedResult với kết quả được chọn
     * BƯỚC 2: Tự động điền thông tin giao hàng từ booking
     * BƯỚC 3: Mở modal giao kết quả
     */
    const handlePrepareDelivery = (result) => {
        setSelectedResult(result);
        setDeliveryDetails({
            email: result.email,
            phone: result.phone,
            address: result.address || '', // Tự động điền địa chỉ từ booking
            recipientName: result.customerName,
            notes: ''
        });
        setShowDeliveryModal(true);
    };

    /**
     * handleDeliverResult: Giao kết quả cho khách hàng
     * BƯỚC 1: Gọi API addBookingHistory() để cập nhật trạng thái thành SENT_RESULT
     * BƯỚC 2: Cập nhật local state với thông tin giao hàng
     * BƯỚC 3: Đóng modal và hiển thị thông báo thành công
     * BƯỚC 4: Xử lý lỗi nếu có
     */
    const handleDeliverResult = async () => {
        // BƯỚC 1: Gọi API để cập nhật trạng thái booking
        try {
            await addBookingHistory({
                bookingId: selectedResult.id,
                status: 'SENT_RESULT',
                description: `Giao kết quả bằng phương thức: ${deliveryMethod}`
            });
            
            // BƯỚC 2: Cập nhật local state với thông tin mới
            const updatedResults = results.map(result =>
                result.id === selectedResult.id
                    ? {
                        ...result,
                        status: 'SENT_RESULT',
                        deliveredDate: new Date().toLocaleString('vi-VN'),
                        deliveredBy: user.name,
                        deliveryMethod: deliveryMethod,
                        deliveryDetails: deliveryDetails
                    }
                    : result
            );
            setResults(updatedResults);
            
            // BƯỚC 3: Đóng modal và hiển thị thông báo
            setShowDeliveryModal(false);
            setSelectedResult(null);
            setAlert({
                show: true,
                message: `Kết quả ${selectedResult.id} đã được giao thành công!`,
                type: 'success'
            });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
        } catch (error) {
            // BƯỚC 4: Xử lý lỗi
            setAlert({
                show: true,
                message: 'Có lỗi khi cập nhật lịch sử giao kết quả!',
                type: 'danger'
            });
        }
    };

    const handleCompleteAnalysis = async () => {
        if (!selectedTest) return;
        try {
            await updateTestResult({
                bookingId: selectedTest.id,
                testMethod: testResults.method,
                positive: testResults.positive,
                accuracy: parseFloat(testResults.confidence),
                testType: testResults.serviceType,
                resultData: testResults.conclusion,
                resultNotes: testResults.notes,
                status: 'analysis-complete',
            });
            await addBookingHistory({ bookingId: selectedTest.id, status: 'COMPLETE', description: testResults.notes });
            const updatedResults = results.map(result =>
                result.id === selectedTest.id
                    ? {
                        ...result,
                        status: 'analysis-complete',
                        completedDate: new Date().toLocaleString('vi-VN'),
                        progress: 100,
                        result: testResults
                    }
                    : result
            );
            setResults(updatedResults);
            setShowTestModal(false);
            setSelectedTest(null);

            setAlert({
                show: true,
                message: `Xét nghiệm ${selectedTest.id} đã hoàn thành và ghi nhận kết quả!`,
                type: 'success'
            });
            setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);

            // Hiển thị thông báo Swal
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: `Đã trả kết quả cho mã đơn ${selectedTest.id} thành công!`,
                confirmButtonText: 'OK'
            });
        } catch (err) {
            setAlert({
                show: true,
                message: 'Lỗi khi cập nhật kết quả xét nghiệm: ' + err.message,
                type: 'danger'
            });
        }
    };

    const formatDateTime = (dateTimeString) => {
        return new Date(dateTimeString).toLocaleString('vi-VN');
    };

    const calculateDaysSinceCompletion = (completedDate) => {
        const completed = new Date(completedDate);
        const now = new Date();
        const diffTime = Math.abs(now - completed);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div>
            {/* Welcome Header - Inspired by DashboardOverview.js */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="mb-1">Quản lý kết quả xét nghiệm </h2>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Alert */}
            {alert.show && (
                <Alert variant={alert.type} className="mb-4">
                    <i className="bi bi-check-circle me-2"></i>
                    {alert.message}
                </Alert>
            )}

            {/* Results Statistics - Improved with better colors and layout */}
            <Row className="mb-4">
                <Col md={3} className="mb-2">
                    <Card className="text-center shadow-sm bg-warning text-white">
                        <Card.Body className="py-3">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <i className="bi bi-clock-history fs-4 me-2"></i>
                                <h6 className="mb-0">Chờ xử lý</h6>
                            </div>
                            <h3 className="fw-bold mb-0">{results.filter(r => r.status?.toLowerCase() === 'result_pending').length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-2">
                    <Card className="text-center shadow-sm bg-success text-white">
                        <Card.Body className="py-3">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <i className="bi bi-check-circle fs-4 me-2"></i>
                                <h6 className="mb-0">Đã duyệt</h6>
                            </div>
                            <h3 className="fw-bold mb-0">{results.filter(r => r.status?.toLowerCase() === 'complete').length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-2">
                    <Card className="text-center shadow-sm bg-primary text-white">
                        <Card.Body className="py-3">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <i className="bi bi-send fs-4 me-2"></i>
                                <h6 className="mb-0">Đã giao</h6>
                            </div>
                            <h3 className="fw-bold mb-0">{results.filter(r => r.status?.toLowerCase() === 'sent_result').length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-2">
                    <Card className="text-center shadow-sm bg-info text-white">
                        <Card.Body className="py-3">
                            <div className="d-flex align-items-center justify-content-center mb-2">
                                <i className="bi bi-clipboard-data fs-4 me-2"></i>
                                <h6 className="mb-0">Tổng cộng</h6>
                            </div>
                            <h3 className="fw-bold mb-0">{results.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filters - Improved layout */}
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Row className="align-items-end">
                        <Col lg={6} md={8} className="mb-3">
                            <Form.Label className="fw-medium">
                                <i className="bi bi-search text-primary me-2"></i>
                                Tìm kiếm
                            </Form.Label>
                            <InputGroup>
                                <Form.Control
                                    placeholder="Mã đơn, tên khách hàng, mã lab, số điện thoại..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-0 shadow-sm"
                                />
                                <Button variant="outline-secondary">
                                    <i className="bi bi-search"></i>
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col lg={3} md={4} className="mb-3">
                            <Form.Label className="fw-medium">
                                <i className="bi bi-funnel text-primary me-2"></i>
                                Trạng thái
                            </Form.Label>
                            <Form.Select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border-0 shadow-sm"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="result_pending">Chờ kết quả</option>
                                <option value="complete">Hoàn thành</option>
                                <option value="SENT_RESULT">Đã giao</option>
                            </Form.Select>
                        </Col>
                        <Col lg={3} className="mb-3">
                            <div className="d-flex gap-2">
                                <Button variant="outline-warning" size="sm" className="flex-fill">
                                    <i className="bi bi-clock me-1"></i>
                                    Cần xử lý: {results.filter(r => r.status?.toLowerCase() === 'result_pending').length}
                                </Button>
                                <Button variant="outline-success" size="sm" className="flex-fill">
                                    <i className="bi bi-check me-1"></i>
                                    Hoàn thành: {results.filter(r => r.status?.toLowerCase() === 'complete').length}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Results Tabs */}
            <Tabs
                activeKey={activeTab}
                onSelect={setActiveTab}
                className="mb-4"
            >
                <Tab eventKey="quality-review" title={
                    <span>
                        <i className="bi bi-search me-2"></i>
                        Trả kết quả
                    </span>
                }>
                    {/* Quality Review Table */}
                    <Card className="shadow-sm">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">Trả kết quả xét nghiệm</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="text-center fw-bold" style={{ width: '15%' }}>Mã đơn</th>
                                            <th className="text-center fw-bold" style={{ width: '20%' }}>Khách hàng</th>
                                            <th className="text-center fw-bold" style={{ width: '25%' }}>Dịch vụ</th>
                                            <th className="text-center fw-bold" style={{ width: '15%' }}>Kỹ thuật viên</th>
                                            <th className="text-center fw-bold" style={{ width: '15%' }}>Ngày hoàn thành</th>
                                            <th className="text-center fw-bold" style={{ width: '10%' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResults.filter(r => r.status?.toLowerCase() === 'result_pending').map((result) => (
                                            <tr key={result.id}>
                                                <td>
                                                    <div className="fw-bold">{result.id}</div>
                                                    <small className="text-muted">{result.labCode}</small>
                                                </td>
                                                <td>
                                                    <div className="fw-bold">{result.customerName}</div>
                                                    <small className="text-muted">{result.phone}</small>
                                                </td>
                                                <td>
                                                    <div>
                                                        {result.serviceName}
                                                        <div className="mt-1">
                                                            {result.hasLegalValue ? (
                                                                <Badge bg="warning" text="dark" className="ms-2">ADN Hành chính</Badge>
                                                            ) : (
                                                                <Badge bg="success" text="white" className="ms-2">ADN Dân sự</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{result.technician}</td>
                                                <td>{formatDateTime(result.completedDate)}</td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        {/* <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => handleViewResult(result)}
                                                        >
                                                            <i className="bi bi-eye me-1"></i>
                                                            Xem chi tiết
                                                        </Button> */}
                                                        {/* <Button
                                                            size="sm"
                                                            variant="success"
                                                            onClick={() => handleApproveResult(result.id)}
                                                        >
                                                            <i className="bi bi-check-circle me-1"></i>
                                                            Phê duyệt
                                                        </Button> */}
                                                        <Button
                                                            size="sm"
                                                            variant="warning"
                                                            onClick={async () => {
                                                                setSelectedTest(result);
                                                                const [booking, samples] = await Promise.all([
                                                                    getBookingById(result.id),
                                                                    getSamplesByBookingId(result.id)
                                                                ]);
                                                                setTestResults({
                                                                    conclusion: '',
                                                                    confidence: '',
                                                                    method: booking?.result?.method || 'STR Analysis (Short Tandem Repeat)',
                                                                    analysisDate: '',
                                                                    technician: booking?.staff?.user?.fullname || '',
                                                                    labCode: booking?.labCode || '',
                                                                    markers: [],
                                                                    qualityScore: '',
                                                                    relationship: booking?.participant?.[0]?.relationship || '',
                                                                    notes: '',
                                                                    bookingId: booking?.id || '',
                                                                    customerName: booking?.informations_on_booking?.[0]?.name || '',
                                                                    phone: booking?.informations_on_booking?.[0]?.phone || '',
                                                                    serviceName: booking?.service?.title || '',
                                                                    serviceType: booking?.service?.category?.hasLegalValue ? 'civil' : 'administrative',
                                                                    samples: Array.isArray(samples) ? samples : []
                                                                });
                                                                setShowTestModal(true);
                                                            }}
                                                        >
                                                            <i className="bi bi-flask me-1"></i>
                                                            Trả kết quả xét nghiệm
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="ready" title={
                    <span>
                        <i className="bi bi-box-arrow-up me-2"></i>
                        Sẵn sàng trả
                    </span>
                }>
                    {/* Ready to Release Table */}
                    <Card className="shadow-sm">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">Kết quả sẵn sàng giao</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <Table hover className="mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Mã đơn</th>
                                            <th>Khách hàng</th>
                                            <th>Dịch vụ</th>
                                            <th>Kết quả</th>
                                            <th>Ngày hoàn thành</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredResults.filter(r => r.status?.toLowerCase() === 'complete' || r.status?.toLowerCase() === 'sent_result').map((result) => (
                                            <tr key={result.id}>
                                                <td>
                                                    <div className="fw-bold">{result.id}</div>
                                                    <small className="text-muted">{result.labCode}</small>
                                                </td>
                                                <td>
                                                    <div className="fw-bold">{result.customerName}</div>
                                                    <small className="text-muted">{result.phone}</small>
                                                </td>
                                                <td>
                                                    <div>
                                                        {result.serviceName || 'N/A'}
                                                        <div className="mt-1">
                                                            {result.result?.testType === 'administrative' ? (
                                                                <Badge bg="success" text="white" className="ms-2">Dân sự</Badge>
                                                            ) : result.result?.testType === 'civil' ? (
                                                                <Badge bg="warning" text="dark" className="ms-2">Hành chính</Badge>
                                                            ) : (
                                                                <Badge bg="secondary" className="ms-2">Không xác định</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <div className="fw-bold">
                                                            {result.result?.conclusion === 'POSITIVE' ? (
                                                                <span className="badge bg-success text-white px-2 py-1">DƯƠNG TÍNH</span>
                                                            ) : result.result?.conclusion === 'NEGATIVE' ? (
                                                                <span className="badge bg-danger text-white px-2 py-1">ÂM TÍNH</span>
                                                            ) : result.result?.conclusion === 'INCONCLUSIVE' ? (
                                                                <span className="badge bg-warning text-dark px-2 py-1">KHÔNG KẾT LUẬN</span>
                                                            ) : (
                                                                <span className="badge bg-secondary text-white px-2 py-1">CHƯA XÁC ĐỊNH</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {formatDateTime(result.completedDate)}
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => handleViewResult(result)}
                                                        >
                                                            <i className="bi bi-eye me-1"></i>
                                                            Xem
                                                        </Button>
                                                        {result.status?.toLowerCase() === 'sent_result' ? (
                                                            <span className="badge bg-primary">KQ đã được giao</span>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="success"
                                                                onClick={() => handlePrepareDelivery(result)}
                                                            >
                                                                <i className="bi bi-send me-1"></i>
                                                                Giao KQ
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>

            {/* Result Detail Modal */}
            <Modal show={showResultModal} onHide={() => setShowResultModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-file-earmark-text me-2"></i>
                        Chi tiết kết quả - {selectedResult?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedResult && (
                        <div>
                            {/* Basic Info */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <h6 className="text-primary mb-3">Thông tin đơn hàng</h6>
                                    <table className="table table-borderless table-sm">
                                        <tbody>
                                            <tr>
                                                <td><strong>Mã đơn:</strong></td>
                                                <td>{selectedResult.id}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Khách hàng:</strong></td>
                                                <td>{selectedResult.customerName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Email:</strong></td>
                                                <td>{selectedResult.email}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Điện thoại:</strong></td>
                                                <td>{selectedResult.phone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-primary mb-3">Thông tin kỹ thuật</h6>
                                    <table className="table table-borderless table-sm">
                                        <tbody>
                                            <tr>
                                                <td><strong>Dịch vụ:</strong></td>
                                                <td>{selectedResult.serviceName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Loại xét nghiệm:</strong></td>
                                                <td>
                                                    {selectedResult.result.testType === 'administrative' ? (
                                                        <Badge bg="success">Dân sự</Badge>
                                                    ) : selectedResult.result.testType === 'civil' ? (
                                                        <Badge bg="warning" text="dark">Hành chính</Badge>
                                                    ) : (
                                                        <Badge bg="secondary">Không xác định</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Phương pháp:</strong></td>
                                                <td>{selectedResult.result.method}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Kỹ thuật viên:</strong></td>
                                                <td>{selectedResult.result.staff?.user?.fullname || selectedResult.technician}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Ngày xét nghiệm:</strong></td>
                                                <td>{selectedResult.result.testDate || formatDateTime(selectedResult.completedDate)}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Ngày báo cáo:</strong></td>
                                                <td>{selectedResult.result.reportDate || formatDateTime(selectedResult.completedDate)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                            </Row>

                            {/* Participants */}
                            <div className="mb-4">
                                <h6 className="text-primary mb-3">Danh sách mẫu phân tích</h6>
                                <div className="table-responsive">
                                    <Table bordered size="sm">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Họ tên</th>
                                                <th>Mối quan hệ</th>
                                                <th>Loại mẫu</th>
                                                <th>Chất lượng ADN</th>
                                                <th>Nồng độ (ng/μL)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(selectedResult.samples || []).map((sample, index) => (
                                                <tr key={sample.id || sample.sampleId || index}>
                                                    <td>{sample.name || sample.participant?.name || ''}</td>
                                                    <td>{sample.relationship || sample.participant?.relationship || 'Chưa xác định'}</td>
                                                    <td>
                                                        {sample.sampleType === 'blood' ? (
                                                            <Badge bg="danger">Máu</Badge>
                                                        ) : sample.sampleType === 'buccal-swab' ? (
                                                            <Badge bg="warning">Tăm bông miệng</Badge>
                                                        ) : sample.sampleType === 'saliva' ? (
                                                            <Badge bg="info">Nước bọt</Badge>
                                                        ) : sample.sampleType === 'hair-root' ? (
                                                            <Badge bg="primary">Tóc</Badge>
                                                        ) : sample.sampleType === 'nail' ? (
                                                            <Badge bg="success">Móng</Badge>
                                                        ) : sample.sampleType === 'other' ? (
                                                            <Badge bg="dark">Khác</Badge>
                                                        ) : (
                                                            <Badge bg="secondary">Không xác định</Badge>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {sample.sampleQuality === 'excellent' ? (
                                                            <Badge bg="success">Xuất sắc</Badge>
                                                        ) : sample.sampleQuality === 'good' ? (
                                                            <Badge bg="info">Tốt</Badge>
                                                        ) : sample.sampleQuality === 'fair' ? (
                                                            <Badge bg="warning" text="dark">Khá</Badge>
                                                        ) : sample.sampleQuality === 'poor' ? (
                                                            <Badge bg="danger">Kém</Badge>
                                                        ) : (
                                                            <Badge bg="secondary">Không xác định</Badge>
                                                        )}
                                                    </td>
                                                    <td>{sample.sampleConcentration || ''}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                            {/* Main Result */}
                            <div className="mb-4 p-4 border rounded">
                                <h5 className="text-center mb-3">
                                    <i className="bi bi-clipboard-check me-2"></i>
                                    KẾT QUẢ XÉT NGHIỆM
                                </h5>

                                <div className="text-center mb-4">
                                    {getResultBadge(selectedResult.result.conclusion)}
                                    <div className="h4 text-primary mt-2">
                                        Độ tin cậy: {selectedResult.result.confidence || 'N/A'}%
                                    </div>
                                </div>

                                <Alert
                                    variant={
                                        selectedResult.result.conclusion === 'POSITIVE' ? 'success' :
                                            selectedResult.result.conclusion === 'NEGATIVE' ? 'danger' : 'warning'
                                    }
                                    className="text-center"
                                >
                                    <Alert.Heading>Kết luận:</Alert.Heading>
                                    <p className="mb-0 h6">
                                        {selectedResult.result.conclusion === 'POSITIVE' ? 'Xác nhận quan hệ huyết thống' :
                                            selectedResult.result.conclusion === 'NEGATIVE' ? 'Loại trừ quan hệ huyết thống' :
                                                selectedResult.result.conclusion === 'INCONCLUSIVE' ? 'Không kết luận được' : 'Chưa xác định'}
                                    </p>
                                </Alert>

                                {selectedResult.result.notes && (
                                    <div className="mt-3">
                                        <h6>Ghi chú kỹ thuật:</h6>
                                        <p className="mb-0">{selectedResult.result.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Legal Notice */}
                            {selectedResult.hasLegalValue && (
                                <Alert variant="warning" className="mb-4">
                                    <i className="bi bi-shield-check me-2"></i>
                                    <strong>Giá trị pháp lý:</strong> Kết quả này có đầy đủ giá trị pháp lý và được
                                    công nhận bởi các cơ quan tòa án, cơ quan nhà nước trong các thủ tục hành chính.
                                </Alert>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResultModal(false)}>
                        Đóng
                    </Button>
                    {selectedResult?.status?.toLowerCase() === 'complete' && (
                        <Button
                            variant="success"
                            onClick={() => {
                                setShowResultModal(false);
                                handlePrepareDelivery(selectedResult);
                            }}
                        >
                            <i className="bi bi-send me-2"></i>
                            Giao kết quả
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            {/* Delivery Modal */}
            <Modal show={showDeliveryModal} onHide={() => setShowDeliveryModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-send me-2"></i>
                        Giao kết quả xét nghiệm
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedResult && (
                        <div>
                            {/* Result Summary */}
                            <div className="mb-4 p-3 bg-light rounded">
                                <Row>
                                    <Col md={6}>
                                        <strong>Mã đơn:</strong> {selectedResult.id}<br />
                                        <strong>Khách hàng:</strong> {selectedResult.customerName}<br />
                                    </Col>
                                    <Col md={6}>
                                        <strong>Kết quả:</strong> {getResultBadge(selectedResult.result.conclusion)}<br />
                                        <strong>Độ tin cậy:</strong> {selectedResult.result.confidence}
                                    </Col>
                                </Row>
                            </div>

                            {/* Delivery Method */}
                            <div className="mb-4">
                                <h6 className="text-primary mb-3">Phương thức giao kết quả</h6>
                                <Form>
                                    <div className="mb-3">
                                        <Form.Check
                                            type="radio"
                                            id="post"
                                            name="deliveryMethod"
                                            value="post"
                                            checked={deliveryMethod === 'post'}
                                            onChange={(e) => setDeliveryMethod(e.target.value)}
                                            label="Gửi bưu điện (Giấy tờ gốc)"
                                        />
                                    </div>
                                </Form>
                            </div>

                            {/* Delivery Details */}
                            <div className="mb-4">
                                <h6 className="text-primary mb-3">Thông tin giao hàng</h6>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Label>Tên người nhận</Form.Label>
                                        <Form.Control
                                            value={deliveryDetails.recipientName}
                                            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, recipientName: e.target.value })}
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={deliveryDetails.email}
                                            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, email: e.target.value })}
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <Form.Control
                                            value={deliveryDetails.phone}
                                            onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                                        />
                                    </Col>
                                    {(deliveryMethod === 'post' || deliveryMethod === 'email-and-post') && (
                                        <Col md={6} className="mb-3">
                                            <Form.Label>
                                                Địa chỉ gửi bưu điện
                                                {selectedResult?.address && (
                                                    <small className="text-success ms-2">
                                                        <i className="bi bi-check-circle me-1"></i>
                                                        Lấy từ thông tin booking
                                                    </small>
                                                )}
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={deliveryDetails.address}
                                                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                                                placeholder={selectedResult?.address ? "Địa chỉ từ booking (có thể chỉnh sửa)" : "Nhập địa chỉ đầy đủ..."}
                                            />
                                            {selectedResult?.address && (
                                                <div className="mt-1">
                                                    {deliveryDetails.address !== selectedResult.address && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline-secondary"
                                                            onClick={() => setDeliveryDetails({ ...deliveryDetails, address: selectedResult.address })}
                                                        >
                                                            <i className="bi bi-arrow-clockwise me-1"></i>
                                                            Khôi phục địa chỉ từ booking
                                                        </Button>
                                                    )}
                                                    {!deliveryDetails.address && (
                                                        <small className="text-muted">
                                                            <i className="bi bi-info-circle me-1"></i>
                                                            Địa chỉ từ booking: {selectedResult.address}
                                                        </small>
                                                    )}
                                                </div>
                                            )}
                                        </Col>
                                    )}
                                </Row>
                            </div>

                            {/* Security Notice */}
                            <Alert variant="info">
                                <i className="bi bi-shield-lock me-2"></i>
                                <strong>Lưu ý bảo mật:</strong> Kết quả xét nghiệm chứa thông tin y tế nhạy cảm.
                                Vui lòng đảm bảo giao cho đúng người và giữ bí mật thông tin.
                            </Alert>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeliveryModal(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleDeliverResult}
                        disabled={!deliveryDetails.recipientName || !deliveryDetails.email}
                    >
                        <i className="bi bi-send me-2"></i>
                        Xác nhận giao kết quả
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Test Results Modal */}
            <Modal show={showTestModal} onHide={() => setShowTestModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-clipboard-check me-2"></i>
                        Kết quả xét nghiệm - {selectedTest?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTest && (
                        <div>
                            {/* Test Info */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <h6 className="text-primary mb-3">Thông tin xét nghiệm</h6>
                                    <table className="table table-borderless table-sm">
                                        <tbody>
                                            <tr>
                                                <td><strong>Mã đơn:</strong></td>
                                                <td>{selectedTest.id}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Khách hàng:</strong></td>
                                                <td>{selectedTest.customerName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Số điện thoại:</strong></td>
                                                <td>{selectedTest.phone}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Dịch vụ:</strong></td>
                                                <td>{testResults.serviceName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Loại:</strong></td>
                                                <td>{testResults.serviceType === 'administrative' ? 'Dân sự' : 'Hành chính'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Col>
                                <Col md={6}>
                                    <h6 className="text-primary mb-3">Thông tin kỹ thuật</h6>
                                    <Form>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Label>Kỹ thuật viên</Form.Label>
                                                <Form.Control
                                                    value={testResults.technician}
                                                    readOnly
                                                    className="bg-light"
                                                />
                                            </Col>
                                            <Col md={12} className="mb-3">
                                                <Form.Label>Phương pháp xét nghiệm</Form.Label>
                                                <Form.Select
                                                    value={testResults.method}
                                                    onChange={(e) => setTestResults({ ...testResults, method: e.target.value })}
                                                >
                                                    <option value="STR Analysis (Short Tandem Repeat)">STR Analysis (Short Tandem Repeat)</option>
                                                    <option value="NIPT (Non-Invasive Prenatal Testing)">NIPT (Non-Invasive Prenatal Testing)</option>
                                                    <option value="SNP Analysis">SNP Analysis</option>
                                                    <option value="CODIS Analysis">CODIS Analysis</option>
                                                </Form.Select>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>

                            {/* Participants */}
                            <div className="mb-4">
                                <h6 className="text-primary mb-3">Danh sách mẫu phân tích</h6>
                                <div className="table-responsive">
                                    <Table bordered size="sm">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Mã mẫu</th>
                                                <th>Họ tên</th>
                                                <th>Mối quan hệ</th>
                                                <th>Loại mẫu</th>
                                                <th>Chất lượng ADN</th>
                                                <th>Nồng độ (ng/μL)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(testResults.samples || []).map((sample, idx) => {
                                                const sampleTypeMap = {
                                                    'blood': 'Máu',
                                                    'buccal-swab': 'Tăm bông miệng',
                                                    'hair-root': 'Tóc có chân tóc',
                                                    'nail': 'Móng tay',
                                                    'saliva': 'Nước bọt',
                                                    'other': 'Khác',
                                                    '': 'Chọn loại mẫu',
                                                };
                                                const sampleTypeLabel = sampleTypeMap[sample.sampleType] || 'Không xác định';
                                                return (
                                                    <tr key={sample.id || sample.sampleId || idx}>
                                                        <td><strong>{sample.id || sample.sampleId}</strong></td>
                                                        <td>{sample.name || sample.participant?.name || ''}</td>
                                                        <td>{sample.relationship || sample.participant?.relationship || 'Chưa xác định'}</td>
                                                        <td>{sampleTypeLabel}</td>
                                                        <td>
                                                            {sample.sampleQuality === 'excellent' ? (
                                                                <Badge bg="success">Xuất sắc</Badge>
                                                            ) : sample.sampleQuality === 'good' ? (
                                                                <Badge bg="info">Tốt</Badge>
                                                            ) : sample.sampleQuality === 'fair' ? (
                                                                <Badge bg="warning" text="dark">Khá</Badge>
                                                            ) : sample.sampleQuality === 'poor' ? (
                                                                <Badge bg="danger">Kém</Badge>
                                                            ) : (
                                                                <Badge bg="secondary">Không xác định</Badge>
                                                            )}
                                                        </td>
                                                        <td>{sample.sampleConcentration || ''}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>

                            {/* Test Results */}
                            <div className="mb-4">
                                <h6 className="text-primary mb-3">Kết quả xét nghiệm</h6>
                                <Row>
                                    <Col md={6}>
                                        <Form.Label>Kết quả dương tính/âm tính</Form.Label>
                                        <div>
                                            <Form.Check
                                                inline
                                                label="Dương tính"
                                                name="positive"
                                                type="radio"
                                                id="positive-true"
                                                checked={testResults.positive === true}
                                                onChange={() => {
                                                    setTestResults({
                                                        ...testResults,
                                                        positive: true,
                                                        conclusion: 'POSITIVE' // Tự động chọn POSITIVE
                                                    });
                                                }}
                                            />
                                            <Form.Check
                                                inline
                                                label="Âm tính"
                                                name="positive"
                                                type="radio"
                                                id="positive-false"
                                                checked={testResults.positive === false}
                                                onChange={() => {
                                                    setTestResults({
                                                        ...testResults,
                                                        positive: false,
                                                        conclusion: '' // Reset kết luận để user chọn lại
                                                    });
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label>Độ tin cậy (%)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0.01"
                                            max="100"
                                            step={0.01}
                                            value={testResults.confidence}
                                            onChange={(e) => {
                                                const value = parseFloat(e.target.value);
                                                if (value > 100) {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Cảnh báo!',
                                                        text: 'Độ tin cậy không được vượt quá 100%',
                                                        confirmButtonColor: '#ffc107'
                                                    });
                                                    return;
                                                }
                                                if (value <= 0) {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Cảnh báo!',
                                                        text: 'Độ tin cậy phải lớn hơn 0%',
                                                        confirmButtonColor: '#ffc107'
                                                    });
                                                    return;
                                                }
                                                setTestResults({ ...testResults, confidence: e.target.value });
                                            }}
                                            placeholder="99.999"
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label>Kết luận</Form.Label>
                                        <Form.Select
                                            value={testResults.conclusion}
                                            onChange={(e) => setTestResults({ ...testResults, conclusion: e.target.value })}
                                            disabled={testResults.positive === true} // Disable khi chọn dương tính
                                        >
                                            <option value="">-- Chọn kết luận --</option>
                                            {testResults.positive === true ? (
                                                <option value="POSITIVE">POSITIVE - Xác nhận quan hệ huyết thống</option>
                                            ) : (
                                                <>
                                                    <option value="NEGATIVE">NEGATIVE - Loại trừ quan hệ huyết thống</option>
                                                    <option value="INCONCLUSIVE">INCONCLUSIVE - Không kết luận được</option>
                                                </>
                                            )}
                                        </Form.Select>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Label>Trạng thái</Form.Label>
                                        <div>
                                            <Form.Check
                                                inline
                                                label="Đã xem xét kỹ"
                                                name="status"
                                                type="radio"
                                                id="status-reviewed"
                                                value="reviewed"
                                                checked={testResults.status === 'reviewed'}
                                                onChange={(e) => setTestResults({ ...testResults, status: e.target.value })}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* Additional Notes */}
                            <div className="mb-4">
                                <h6 className="text-primary mb-3">Ghi chú kỹ thuật</h6>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Ghi chú về quá trình phân tích, vấn đề kỹ thuật, nhận xét về mẫu..."
                                    value={testResults.notes}
                                    onChange={(e) => setTestResults({ ...testResults, notes: e.target.value })}
                                />
                            </div>

                            {/* Preview Result */}
                            {testResults.conclusion && (
                                <div className="mb-4">
                                    <h6 className="text-primary mb-3">Xem trước kết quả</h6>
                                    <Alert
                                        variant={
                                            testResults.conclusion === 'POSITIVE' ? 'success' :
                                                testResults.conclusion === 'NEGATIVE' ? 'danger' : 'warning'
                                        }
                                    >
                                        <Alert.Heading>
                                            Kết quả: {testResults.conclusion}
                                        </Alert.Heading>
                                        <p className="mb-0">
                                            Độ tin cậy: {testResults.confidence}% |
                                            Phương pháp: {testResults.method} |
                                            Kỹ thuật viên: {testResults.technician}
                                        </p>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTestModal(false)}>
                        Đóng
                    </Button>
                    {selectedTest?.status?.toLowerCase() !== 'analysis-complete' && (
                        <Button
                            variant="success"
                            onClick={handleCompleteAnalysis}
                            disabled={!testResults.conclusion || !testResults.confidence}
                        >
                            <i className="bi bi-check-circle me-2"></i>
                            Hoàn tất xét nghiệm
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ResultsManagement;