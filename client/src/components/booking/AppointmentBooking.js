/**
 * COMPONENT: AppointmentBooking
 * CHỨC NĂNG: Multi-step booking form cho đặt lịch xét nghiệm ADN
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách services và methods từ API getAllServices() và getAllMethods()
 * 2. Xử lý 4 bước đặt lịch: Chọn dịch vụ → Phương thức lấy mẫu → Thông tin & Lịch hẹn → Xác nhận
 * 3. Validation phức tạp cho thông tin khách hàng và người tham gia
 * 4. Auto-fill thông tin từ localStorage nếu user đã đăng nhập
 * 5. Tích hợp API createBooking() để tạo booking và điều hướng đến xác nhận
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { getAllServices, getAllMethods, getMethodsByServiceId, createBooking, getUserById } from '../../services/api'; // API functions
import { getServiceById, getServicesByType, enrichMethodData, isMethodDisabled, getMethodRestrictionReason } from '../data/services-data'; // Helper functions
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';

const AppointmentBooking = () => {
  // ROUTER HOOKS
  const navigate = useNavigate(); // Hook điều hướng
  const location = useLocation(); // Hook nhận state từ page trước

  // STATE QUẢN LÝ BOOKING FLOW
  const [currentStep, setCurrentStep] = useState(1); // Bước hiện tại (1-4)

  // STATE QUẢN LÝ DỮ LIỆU API
  const [services, setServices] = useState([]); // Danh sách dịch vụ từ API
  const [methods, setMethods] = useState([]); // Danh sách phương thức từ API
  const [serviceMethods, setServiceMethods] = useState([]); // Phương thức của dịch vụ được chọn
  const [enrichedMethods, setEnrichedMethods] = useState([]); // Methods với icon và color

  // STATE QUẢN LÝ UI
  const [loading, setLoading] = useState(true); // Trạng thái đang tải dữ liệu
  const [errors, setErrors] = useState(null); // Lỗi chung
  const [userFromAPI, setUserFromAPI] = useState(null); // User data từ API

  // STATE QUẢN LÝ BOOKING DATA
  const [bookingData, setBookingData] = useState({
    serviceType: '',        // Loại dịch vụ: 'civil' hoặc 'administrative'
    serviceId: '',          // ID dịch vụ được chọn
    collectionMethod: '',   // ID phương thức thu mẫu
    appointmentDate: '',    // Ngày hẹn (YYYY-MM-DD)
    appointmentTime: '',    // Giờ hẹn (HH:MM)
    customerInfo: {         // Thông tin khách hàng
      fullName: '',        // Họ tên đầy đủ
      phone: '',           // Số điện thoại
      email: '',           // Email liên hệ
      address: '',         // Địa chỉ
      idNumber: '',        // CMND/CCCD
      participants: []     // Danh sách người tham gia xét nghiệm
    }
  });

  // STATE QUẢN LÝ VALIDATION
  const [idNumberErrors, setIdNumberErrors] = useState({}); // Lỗi CMND/CCCD
  const [customerErrors, setCustomerErrors] = useState({    // Lỗi thông tin khách hàng
    fullName: '',
    phone: '',
    idNumber: '',
    address: ''
  });
  const [participantErrors, setParticipantErrors] = useState([]); // Lỗi thông tin người tham gia

  // STATE QUẢN LÝ RELATIONSHIP
  const [isParticipant1Customer, setIsParticipant1Customer] = useState(false); // Checkbox người tham gia 1 là người đặt lịch

  // STATE QUẢN LÝ USER
  const storedUserData = localStorage.getItem('userData');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;

  /**
   * EFFECT: Tải thông tin user từ API khi component mount
   * BƯỚC 1: Kiểm tra nếu có userData từ localStorage
   * BƯỚC 2: Gọi API getUserById() để lấy thông tin user chi tiết
   * BƯỚC 3: Cập nhật state userFromAPI
   * BƯỚC 4: Xử lý lỗi nếu có
   */
  useEffect(() => {
    if (userData && (userData.id || userData._id)) {
      getUserById(userData.id || userData._id)
        .then(user => setUserFromAPI(user))
        .catch(err => console.error('Lỗi lấy thông tin user:', err));
    }
  }, []);

  /**
   * HELPER FUNCTION: Tính toán giờ kết thúc từ giờ bắt đầu
   * INPUT: startTime (string) - giờ bắt đầu (HH:MM)
   * OUTPUT: string - giờ kết thúc (HH:MM)
   * BƯỚC 1: Tách giờ và phút từ startTime
   * BƯỚC 2: Cộng thêm 1 giờ
   * BƯỚC 3: Format lại thành chuỗi HH:MM
   */
  const calculateEndTime = (startTime) => {
    const [hour, minute] = startTime.split(':').map(Number);
    const endHour = hour + 1;
    return `${endHour < 10 ? '0' : ''}${endHour}:${minute < 10 ? '0' : ''}${minute}`;
  };

  /**
   * CONSTANT DATA: Danh sách các mối quan hệ gia đình hợp lệ
   * Sử dụng cho dropdown chọn mối quan hệ giữa các người tham gia
   */
  const familyRelations = [
    "Cha", "Mẹ",
    "Ông nội", "Bà nội",
    "Ông ngoại", "Bà ngoại",
    "Con trai", "Con gái",
    "Anh", "Chị", "Em trai", "Em gái",
    "Cháu nội", "Cháu ngoại", "Cháu",
    "Cô", "Dì", "Chú", "Bác", "Cậu", "Chưa xác định"
  ];

  // Ma trận các cặp quan hệ hợp lệ cho xét nghiệm ADN
  const validRelationPairs = [
    ['Cha', 'Con trai'],     // Xét nghiệm cha - con trai
    ['Cha', 'Con gái'],      // Xét nghiệm cha - con gái
    ['Mẹ', 'Con trai'],      // Xét nghiệm mẹ - con trai
    ['Mẹ', 'Con gái'],       // Xét nghiệm mẹ - con gái
    ['Anh', 'Em trai'],      // Xét nghiệm anh em trai
    ['Anh', 'Em gái'],       // Xét nghiệm anh em gái
    ['Chị', 'Em trai'],      // Xét nghiệm chị em trai
    ['Chị', 'Em gái'],       // Xét nghiệm chị em gái
    ['Ông nội', 'Cháu nội'], // Xét nghiệm ông nội - cháu
    ['Ông ngoại', 'Cháu ngoại'], // Xét nghiệm ông ngoại - cháu
    ['Bà nội', 'Cháu nội'],  // Xét nghiệm bà nội - cháu
    ['Bà ngoại', 'Cháu ngoại'], // Xét nghiệm bà ngoại - cháu
    ['Chồng', 'Vợ'],         // Xét nghiệm vợ chồng
    ['Cô', 'Cháu'],          // Xét nghiệm cô - cháu
    ['Chú', 'Cháu'],         // Xét nghiệm chú - cháu
    ['Dì', 'Cháu'],          // Xét nghiệm dì - cháu
    ['Cậu', 'Cháu'],         // Xét nghiệm cậu - cháu
    ['Bác', 'Cháu'],         // Xét nghiệm bác - cháu
    []
  ];

  const maleRelations = [
    "Cha", "Ông nội", "Ông ngoại", "Con trai", "Anh", "Em trai",
    "Cháu nội", "Cháu ngoại", "Cháu", "Chú", "Bác", "Cậu", "Chưa xác định"
  ];

  const femaleRelations = [
    "Mẹ", "Bà nội", "Bà ngoại", "Con gái", "Chị", "Em gái",
    "Cháu nội", "Cháu ngoại", "Cháu", "Cô", "Dì", "Chưa xác định"
  ];

  // Lấy danh sách quan hệ hợp lệ dựa trên quan hệ hiện tại
  const getValidRelationsForOther = (currentRelation) => {
    const valid = validRelationPairs
      .filter(pair => pair[0] === currentRelation)
      .map(pair => pair[1]);

    return valid.length > 0 ? valid : familyRelations; // Nếu rỗng → trả lại toàn bộ
  };

  /**
   * EFFECT: Fetch dữ liệu services và methods từ API khi component mount
   * BƯỚC 1: Gọi song song 2 API getAllServices() và getAllMethods() để tối ưu performance
   * BƯỚC 2: Cập nhật state services và methods với dữ liệu từ API
   * BƯỚC 3: Làm giàu dữ liệu methods với icon và color cho UI
   * BƯỚC 4: Xử lý lỗi nếu có và set loading state
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // BƯỚC 1: Gọi song song 2 API để tối ưu performance
        const [servicesData, methodsData] = await Promise.all([
          getAllServices(),
          getAllMethods()
        ]);

        // BƯỚC 2: Cập nhật state với dữ liệu từ API
        setServices(servicesData || []);
        setMethods(methodsData || []);

        // BƯỚC 3: Làm giàu dữ liệu methods với icon và color cho UI
        const enriched = enrichMethodData(methodsData || []);
        setEnrichedMethods(enriched);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Chạy 1 lần khi component mount

  /**
   * EFFECT: Fetch các phương thức của service được chọn
   * BƯỚC 1: Kiểm tra nếu có serviceId được chọn
   * BƯỚC 2: Gọi API getMethodsByServiceId() để lấy methods của service
   * BƯỚC 3: Cập nhật state serviceMethods
   * BƯỚC 4: Xử lý lỗi nếu có
   */
  useEffect(() => {
    const fetchServiceMethods = async () => {
      if (bookingData.serviceId) {
        try {
          const methodsData = await getMethodsByServiceId(bookingData.serviceId);
          setServiceMethods(methodsData || []);
        } catch (error) {
          console.error('Error fetching service methods:', error);
          setServiceMethods([]);
        }
      }
    };

    fetchServiceMethods();
  }, [bookingData.serviceId]); // Chạy khi serviceId thay đổi

  /**
   * EFFECT: Load pre-selected service từ navigation state
   * BƯỚC 1: Kiểm tra nếu có selectedService từ location.state
   * BƯỚC 2: Tìm service trong danh sách services
   * BƯỚC 3: Auto-set serviceType và serviceId
   * BƯỚC 4: Tạo danh sách participants dựa trên yêu cầu của service
   * BƯỚC 5: Chuyển đến step 2
   */
  useEffect(() => {
    if (location.state?.selectedService && services.length > 0) {
      const service = getServiceById(services, location.state.selectedService);
      if (service) {
        setBookingData(prev => ({
          ...prev,
          serviceType: service.category?.hasLegalValue ? 'administrative' : 'civil',
          serviceId: service.id,
          customerInfo: {
            ...prev.customerInfo,
            // Tự động tạo danh sách participants dựa trên yêu cầu của service
            participants: service.participants ? service.participants.map((role, index) => ({
              id: index,
              role: role,
              name: '',
              idNumber: '',
              phone: ''
            })) : []
          }
        }));
        setCurrentStep(2);
      }
    }
  }, [location.state, services]); // Chạy khi có service được chọn từ page trước

  /**
   * EFFECT: Auto-fill thông tin khách hàng từ userFromAPI
   * BƯỚC 1: Kiểm tra nếu có userFromAPI
   * BƯỚC 2: Parse địa chỉ từ userFromAPI.address
   * BƯỚC 3: Map tên địa chỉ sang code (giống UserProfile)
   * BƯỚC 4: Auto-fill thông tin khách hàng từ userFromAPI
   */
  useEffect(() => {
    if (userFromAPI) {
      let addressDetail = '', ward = '', district = '', city = '';
      if (userFromAPI.address) {
        const parts = userFromAPI.address.split(',').map(s => s.trim());
        if (parts.length === 4) {
          addressDetail = parts[0];
          // BƯỚC 3: Map tên sang code (giống UserProfile)
          const normalize = str => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
          const findCodeByName = (list, name) => (list.find(item => normalize(item.name) === normalize(name)) || {}).code || '';
          city = findCodeByName(getProvinces(), parts[3]);
          district = findCodeByName(getDistricts().filter(d => d.province_code === city), parts[2]);
          ward = findCodeByName(getWards().filter(w => w.district_code === district), parts[1]);
        } else {
          addressDetail = userFromAPI.address;
        }
      }

      // BƯỚC 4: Auto-fill thông tin khách hàng từ userFromAPI
      setBookingData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          fullName: userFromAPI.fullname || '',
          phone: userFromAPI.phone || '',
          email: userFromAPI.email || '',
          idNumber: userFromAPI.id_number || userFromAPI.idNumber || '',
          address: userFromAPI.address || '',
          addressDetail,
          ward,
          district,
          city
        }
      }));
    }
  }, [userFromAPI]);

  /**
   * EFFECT: Tự động build full address khi các thành phần địa chỉ thay đổi
   * BƯỚC 1: Gọi buildFullAddress() với thông tin địa chỉ hiện tại
   * BƯỚC 2: Cập nhật bookingData.customerInfo.address
   */
  useEffect(() => {
    const fullAddress = buildFullAddress(bookingData.customerInfo);
    setBookingData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        address: fullAddress
      }
    }));
  }, [
    bookingData.customerInfo.addressDetail,
    bookingData.customerInfo.ward,
    bookingData.customerInfo.district,
    bookingData.customerInfo.city
  ]);

  /**
   * EVENT HANDLER: Thay đổi loại dịch vụ (civil/administrative)
   * INPUT: type (string) - loại dịch vụ ('civil' hoặc 'administrative')
   * BƯỚC 1: Cập nhật serviceType
   * BƯỚC 2: Reset serviceId và collectionMethod
   * BƯỚC 3: Reset danh sách participants
   */
  const handleServiceTypeChange = (type) => {
    setBookingData({
      ...bookingData,
      serviceType: type,
      serviceId: '',           // Reset service selection
      collectionMethod: '',    // Reset method selection
      customerInfo: {
        ...bookingData.customerInfo,
        participants: []       // Reset participants
      }
    });
  };

  /**
   * EVENT HANDLER: Chọn dịch vụ cụ thể
   * INPUT: serviceId (string) - ID của service được chọn
   * BƯỚC 1: Lấy thông tin service từ danh sách services
   * BƯỚC 2: Cập nhật serviceId và reset collectionMethod
   * BƯỚC 3: Tạo danh sách participants dựa trên requirements của service
   */
  const handleServiceSelect = (serviceId) => {
    const selectedService = getServiceById(services, serviceId);

    setBookingData({
      ...bookingData,
      serviceId: serviceId,
      collectionMethod: '',    // Reset method khi đổi service
      customerInfo: {
        ...bookingData.customerInfo,
        // Tạo participants list dựa trên requirements của service
        participants: selectedService ? (selectedService.participants ? selectedService.participants.map((role, index) => ({
          id: index,
          role: role,
          name: '',
          idNumber: '',
          phone: ''
        })) : []) : []
      }
    });
  };

  /**
   * EVENT HANDLER: Chọn phương thức thu mẫu
   * INPUT: method (object) - thông tin method được chọn
   * BƯỚC 1: Cập nhật collectionMethod với method.id
   */
  const handleMethodSelect = (method) => {
    setBookingData({
      ...bookingData,
      collectionMethod: method.id
    });
  };

  /**
   * EVENT HANDLER: Cập nhật thông tin khách hàng
   * INPUT: field (string) - tên field, value (string) - giá trị mới
   * BƯỚC 1: Cập nhật field tương ứng trong customerInfo
   */
  const handleCustomerInfoChange = (field, value) => {
    setBookingData({
      ...bookingData,
      customerInfo: {
        ...bookingData.customerInfo,
        [field]: value
      }
    });
  };

  /**
   * EVENT HANDLER: Cập nhật thông tin người tham gia
   * INPUT: idx (number) - index của participant, field (string) - tên field, value (string) - giá trị mới
   * BƯỚC 1: Tạo copy của danh sách participants
   * BƯỚC 2: Cập nhật field tương ứng cho participant tại index idx
   * BƯỚC 3: Cập nhật state với danh sách participants mới
   */
  const handleParticipantChange = (idx, field, value) => {
    const updated = [...bookingData.customerInfo.participants];
    updated[idx] = {
      ...updated[idx],
      [field]: value
    };
    setBookingData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        participants: updated
      }
    }));
  };

  /**
   * NAVIGATION FUNCTIONS: Chuyển đổi giữa các step
   * BƯỚC 1: Kiểm tra điều kiện để chuyển step
   * BƯỚC 2: Cập nhật currentStep
   */
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * EVENT HANDLER: Submit booking form cuối cùng
   * BƯỚC 1: Lấy userId từ localStorage với multiple fallbacks
   * BƯỚC 2: Lấy thông tin service và method đã chọn
   * BƯỚC 3: Validation dữ liệu trước khi submit
   * BƯỚC 4: Tính toán thời gian slot (startTime, endTime)
   * BƯỚC 5: Map dữ liệu participants theo format API yêu cầu
   * BƯỚC 6: Chuẩn bị thông tin người đặt lịch
   * BƯỚC 7: Tính tổng chi phí (service price + method price)
   * BƯỚC 8: Chuẩn bị payload theo format API backend
   * BƯỚC 9: Gọi API createBooking()
   * BƯỚC 10: Extract booking ID từ response
   * BƯỚC 11: Điều hướng đến trang xác nhận với dữ liệu booking
   */
  const handleBookingSubmit = async () => {
    // BƯỚC 1: Lấy userId từ localStorage với multiple fallbacks
    let userId = '';
    try {
      const userDataFromStorage = JSON.parse(localStorage.getItem('userData'));
      userId = userDataFromStorage?.uid || userDataFromStorage?.user_id || userDataFromStorage?.id || '';
    } catch (e) {
      console.error('Error parsing userData:', e);
    }

    // BƯỚC 2: Lấy thông tin service và method đã chọn
    const service = selectedService;
    const method = selectedMethod;

    // BƯỚC 3: Validation dữ liệu trước khi submit
    if (!service) {
      alert('Vui lòng chọn dịch vụ!');
      return;
    }

    if (!bookingData.collectionMethod) {
      alert('Vui lòng chọn phương thức lấy mẫu!');
      return;
    }

    if (!bookingData.appointmentDate || !bookingData.appointmentTime) {
      alert('Vui lòng chọn ngày và giờ hẹn!');
      return;
    }

    if (!bookingData.customerInfo.fullName || !bookingData.customerInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin liên hệ!');
      return;
    }

    // BƯỚC 4: Tính toán thời gian slot (startTime, endTime)
    let startTime = bookingData.appointmentTime || '';
    let endTime = '';
    if (startTime) {
      const [h, m] = startTime.split(':');
      const start = new Date(0, 0, 0, parseInt(h), parseInt(m));
      start.setHours(start.getHours() + 1);
      endTime = start.toTimeString().slice(0, 5);
    }

    // BƯỚC 5: Map dữ liệu participants theo format API yêu cầu
    const participants = (bookingData.customerInfo.participants || []).map((p) => ({
      name: p.name || '',
      age: p.age || null,
      identification: p.idNumber || '',
      gender: p.gender || '',
      relationship: p.relation || p.role || '',
    }));

    // BƯỚC 6: Chuẩn bị thông tin người đặt lịch
    const information = {
      name: bookingData.customerInfo.fullName,
      identification: bookingData.customerInfo.idNumber,
      address: buildFullAddress(bookingData.customerInfo),
      phone: bookingData.customerInfo.phone,
      email: bookingData.customerInfo.email
    };

    // BƯỚC 7: Tính tổng chi phí (service price + method price)
    let totalAmount = 0;
    if (service && typeof service.price === 'number') {
      totalAmount = service.price;
    }

    // Cộng thêm phí phương thức thu mẫu nếu có
    if (method && typeof method.price === 'number' && method.price > 0) {
      totalAmount += method.price;
    }

    // BƯỚC 8: Chuẩn bị payload theo format API backend
    const payload = {
      userId: userId, // ID người dùng từ localStorage
      slotDate: bookingData.appointmentDate,
      startTime: bookingData.appointmentTime,
      endTime: calculateEndTime(bookingData.appointmentTime),
      methodId: bookingData.collectionMethod,
      serviceId: service.id, // ID dịch vụ từ backend
      totalAmount,
      information: {
        name: bookingData.customerInfo.fullName,
        identification: bookingData.customerInfo.idNumber,
        address: bookingData.customerInfo.address,
        phone: bookingData.customerInfo.phone,
        email: bookingData.customerInfo.email,
      },
      participants: bookingData.customerInfo.participants.map((p) => ({
        name: p.name,
        identification: p.idNumber,
        relationship: p.relation,
        age: p.age,
        gender: p.gender
      }))
    };

    // BƯỚC 9: Gọi API tạo booking
    try {
      const res = await createBooking(payload);

      // BƯỚC 10: Extract booking ID từ response (handle multiple response formats)
      let bookingId = null;
      if (res) {
        bookingId = res.id || res.bookingId || res.data?.id || res.booking_insert?.id || res.data?.booking_insert?.id || null;
      }

      if (bookingId) {
        // BƯỚC 11: Điều hướng đến trang xác nhận với dữ liệu booking
        try {
          navigate('/booking-confirmation', {
            state: {
              bookingData: {
                ...bookingData,
                selectedService: service,
                selectedMethod: method
              },
              bookingId: bookingId
            }
          });
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback: redirect trực tiếp nếu navigate không hoạt động
          window.location.href = '/booking-confirmation';
        }
      } else {
        throw new Error('No booking ID returned from server');
      }
    } catch (err) {
      console.error('Booking error details:', err);

      // Hiển thị thông báo lỗi chi tiết cho user
      const errorMessage = err.message || 'Đặt lịch thất bại! Vui lòng thử lại hoặc liên hệ hỗ trợ.';
      alert(`Lỗi đặt lịch: ${errorMessage}`);
    }
  };

  /**
   * COMPUTED VALUES: Lấy thông tin service và method đã chọn
   * BƯỚC 1: Lấy selectedService từ serviceId trong bookingData
   * BƯỚC 2: Lấy selectedMethod từ collectionMethod trong bookingData
   * BƯỚC 3: Handle cả string ID và object method
   */
  const selectedService = bookingData.serviceId ? getServiceById(services, bookingData.serviceId) : null;
  const selectedMethod = bookingData.collectionMethod ?
    (typeof bookingData.collectionMethod === 'string'
      ? enrichedMethods.find(m => m.id === bookingData.collectionMethod)
      : bookingData.collectionMethod)
    : null;

  /**
   * HELPER FUNCTION: Render badge hiển thị loại dịch vụ
   * INPUT: serviceType (string) - loại dịch vụ, category (object) - thông tin category
   * OUTPUT: JSX Badge component
   * BƯỚC 1: Kiểm tra serviceType để hiển thị badge tương ứng
   */
  const renderServiceTypeBadge = (serviceType, category) => {
    if (serviceType === 'administrative') {
      return <Badge bg="warning" text="dark">ADN Hành chính</Badge>;
    }
    return <Badge bg="success">ADN Dân sự</Badge>;
  };

  /**
   * HELPER FUNCTION: Lấy tên phương thức thu mẫu (với fallback)
   * INPUT: methodId (string) - ID phương thức, methodInfo (object) - thông tin method
   * OUTPUT: string - tên phương thức
   * BƯỚC 1: Ưu tiên lấy tên từ methodInfo nếu có (từ API)
   * BƯỚC 2: Fallback về mapping cũ cho các ID cố định
   */
  const getCollectionMethodName = (methodId, methodInfo) => {
    // BƯỚC 1: Ưu tiên lấy tên từ methodInfo nếu có (từ API)
    if (methodInfo && methodInfo.name) {
      return methodInfo.name;
    }

    // BƯỚC 2: Fallback về mapping cũ cho các ID cố định
    const methods = {
      '0': 'Tự lấy mẫu tại nhà',
      '1': 'Nhân viên tới nhà lấy mẫu',
      '2': 'Tới cơ sở lấy mẫu',
      'self-sample': 'Tự lấy mẫu tại nhà',
      'home-visit': 'Nhân viên tới nhà lấy mẫu',
      'at-facility': 'Tới cơ sở lấy mẫu'
    };
    return methods[methodId] || methodId;
  };

  /**
   * HELPER FUNCTION: Lấy màu sắc cho badge method
   * INPUT: methodId (string) - ID phương thức
   * OUTPUT: string - tên màu Bootstrap
   */
  const getMethodColor = (methodId) => {
    const methodColors = {
      'self-sample': 'success',
      'home-visit': 'warning',
      'at-facility': 'primary',
      '0': 'success',
      '1': 'warning',
      '2': 'primary'
    };
    return methodColors[methodId] || 'secondary';
  };

  /**
   * HELPER FUNCTION: Tạo danh sách 30 ngày tiếp theo (loại trừ Chủ nhật)
   * OUTPUT: array - danh sách ngày trong format YYYY-MM-DD
   * BƯỚC 1: Tạo array 30 ngày từ hôm nay
   * BƯỚC 2: Loại trừ Chủ nhật (getDay() === 0) vì không làm việc
   * BƯỚC 3: Format thành chuỗi YYYY-MM-DD
   */
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // BƯỚC 2: Loại trừ Chủ nhật (getDay() === 0) vì không làm việc
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  /**
   * HELPER FUNCTION: Format ngày sang tiếng Việt
   * INPUT: dateString (string) - chuỗi ngày
   * OUTPUT: string - ngày định dạng tiếng Việt
   */
  const renderDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  /**
   * CONSTANT DATA: Danh sách time slots cho booking (8 slots/ngày, mỗi slot 1 tiếng)
   * Sử dụng cho dropdown chọn giờ hẹn
   */
  const timeSlots = [
    { label: '08:00 - 09:00', value: '08:00' },
    { label: '09:00 - 10:00', value: '09:00' },
    { label: '10:00 - 11:00', value: '10:00' },
    { label: '11:00 - 12:00', value: '11:00' },
    { label: '13:00 - 14:00', value: '13:00' }, // Nghỉ trưa từ 12-13h
    { label: '14:00 - 15:00', value: '14:00' },
    { label: '15:00 - 16:00', value: '15:00' },
    { label: '16:00 - 17:00', value: '16:00' }
  ];

  /**
   * EVENT HANDLER: Auto-fill thông tin người tham gia 1 từ thông tin người đặt lịch
   * INPUT: checked (boolean) - trạng thái checkbox
   * BƯỚC 1: Cập nhật state isParticipant1Customer
   * BƯỚC 2: Nếu checked = true: Auto-fill thông tin từ customerInfo
   * BƯỚC 3: Nếu checked = false: Clear thông tin người tham gia 1
   */
  const handleParticipant1AsCustomer = (checked) => {
    setIsParticipant1Customer(checked);
    if (checked) {
      // BƯỚC 2: Auto-fill thông tin từ customerInfo
      const updated = [...bookingData.customerInfo.participants];
      updated[0] = {
        ...updated[0],
        name: bookingData.customerInfo.fullName || '',
        idNumber: bookingData.customerInfo.idNumber || '',
        phone: bookingData.customerInfo.phone || '',
        // Tuổi và giới tính cần user nhập thêm
        age: '',
        gender: '',
        relation: 'Chưa xác định' // Mặc định
      };
      setBookingData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          participants: updated
        }
      }));
    } else {
      // BƯỚC 3: Clear thông tin người tham gia 1
      const updated = [...bookingData.customerInfo.participants];
      updated[0] = {
        ...updated[0],
        name: '',
        idNumber: '',
        phone: '',
        age: '',
        gender: '',
        relation: ''
      };
      setBookingData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          participants: updated
        }
      }));
    }
  };

  /**
   * HELPER FUNCTION: Build full address từ các thành phần địa chỉ
   * INPUT: addressInfo (object) - thông tin địa chỉ chi tiết
   * OUTPUT: string - địa chỉ đầy đủ
   * BƯỚC 1: Lấy tên tỉnh/thành phố từ code
   * BƯỚC 2: Lấy tên quận/huyện từ code
   * BƯỚC 3: Lấy tên phường/xã từ code
   * BƯỚC 4: Kết hợp thành địa chỉ đầy đủ
   */
  const buildFullAddress = ({ addressDetail, ward, district, city }) => {
    const province = getProvinces().find(p => p.code === city)?.name || '';
    const districtName = getDistricts().find(d => d.code === district)?.name || '';
    const wardName = getWards().find(w => w.code === ward)?.name || '';

    return [addressDetail, wardName, districtName, province]
      .filter(part => part && part.trim())
      .join(', ');
  };

  return (
    <div>
      {/* HEADER SECTION: Banner với tiêu đề và hotline */}
      <section className="bg-primary text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="h3 mb-2">
                <i className="bi bi-calendar-plus me-2"></i>
                Đặt lịch xét nghiệm ADN
              </h1>
              <p className="mb-0">
                Đặt lịch nhanh chóng và tiện lợi - Nhận kết quả chính xác 99.999%
              </p>
            </Col>
            <Col xs="auto">
              <div className="text-end">
                <div className="small">Hỗ trợ 24/7</div>
                <strong>1900 1234</strong>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {/* LOADING STATE: Hiển thị khi đang fetch dữ liệu từ API */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải thông tin dịch vụ...</p>
          </div>
        ) : (
          <>
            {/* PROGRESS BAR: Hiển thị tiến độ 4 bước đặt lịch */}
            <Row className="mb-5">
              <Col>
                <div className="d-flex justify-content-center align-items-center">
                  {[1, 2, 3, 4].map((step, index) => (
                    <React.Fragment key={step}>
                      {/* Circle cho từng step với trạng thái dynamic */}
                      <div className={`rounded-circle d-flex align-items-center justify-content-center border-2 ${currentStep >= step
                        ? 'bg-primary text-white border-primary'     // Completed/Current - Xanh
                        : currentStep === step - 1
                          ? 'bg-white text-primary border-primary'    // Next step - Viền xanh
                          : 'bg-light text-muted border-light'        // Future - Xám
                        }`} style={{ width: '50px', height: '50px', fontWeight: 'bold' }}>
                        {/* Icon check nếu đã hoàn thành, số nếu chưa */}
                        {currentStep > step ? (
                          <i className="bi bi-check-lg"></i>
                        ) : (
                          step
                        )}
                      </div>
                      {/* Connecting line giữa các step */}
                      {index < 3 && (
                        <div className={`mx-3`}
                          style={{
                            width: '60px',
                            height: '3px',
                            backgroundColor: currentStep > step ? '#0d6efd' : '#dee2e6'
                          }}>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </Col>
            </Row>

            {/* STEP LABELS: Nhãn mô tả cho từng bước */}
            <Row className="mt-3">
              <Col className="text-center">
                <small className={`fw-medium ${currentStep >= 1 ? 'text-primary' : 'text-muted'}`}>
                  Chọn dịch vụ
                </small>
              </Col>
              <Col className="text-center">
                <small className={`fw-medium ${currentStep >= 2 ? 'text-primary' : 'text-muted'}`}>
                  Phương thức lấy mẫu
                </small>
              </Col>
              <Col className="text-center">
                <small className={`fw-medium ${currentStep >= 3 ? 'text-primary' : 'text-muted'}`}>
                  Thông tin & Lịch hẹn
                </small>
              </Col>
              <Col className="text-center">
                <small className={`fw-medium ${currentStep >= 4 ? 'text-primary' : 'text-muted'}`}>
                  Xác nhận đặt lịch
                </small>
              </Col>
            </Row>

            {/* STEP 1: Service Selection - Chọn loại dịch vụ xét nghiệm */}
            {currentStep === 1 && (
              <>
                <div className="text-center mb-5">
                  <h2 className="display-6 fw-bold">Chọn loại dịch vụ xét nghiệm</h2>
                  <p className="lead text-muted">Lựa chọn dịch vụ phù hợp với nhu cầu của bạn</p>
                </div>

                {/* SERVICE TYPE COMPARISON: So sánh ADN Dân sự vs Hành chính */}
                <Row className="mb-5">
                  <Col md={6} className="mb-4">
                    <Card
                      className={`h-100 border-success cursor-pointer ${bookingData.serviceType === 'civil' ? 'border-3 shadow-lg' : 'border-2'
                        }`}
                      onClick={() => handleServiceTypeChange('civil')}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <Card.Header className="bg-success text-white text-center py-4">
                        <i className="bi bi-house fs-1 mb-3 d-block"></i>
                        <h3 className="mb-2">ADN Dân sự</h3>
                        <Badge bg="light" text="dark" className="fs-6">Mục đích cá nhân</Badge>
                      </Card.Header>
                      <Card.Body className="p-4">
                        <div className="mb-4">
                          <h5 className="text-success mb-3">Đặc điểm:</h5>
                          <ul className="list-unstyled ps-3">
                            <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Hầu hết có thể tự lấy mẫu tại nhà</li>
                            <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Bảo mật và riêng tư cao</li>
                            <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Thuận tiện và nhanh chóng</li>
                            <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Giá thành hợp lý</li>
                          </ul>
                        </div>

                        <div className="mb-4">
                          <h6 className="text-success mb-3">Phù hợp cho:</h6>
                          <ul className="small text-muted ps-3">
                            <li>Tìm hiểu quan hệ huyết thống cá nhân</li>
                            <li>Nghiên cứu nguồn gốc gia đình</li>
                            <li>Phân tích đặc điểm di truyền</li>
                            <li>Xét nghiệm riêng tư, kín đáo</li>
                          </ul>
                        </div>

                        <Alert variant="info" className="small mb-3">
                          <i className="bi bi-info-circle me-2"></i>
                          <strong>Lưu ý:</strong> ADN trước sinh không thể tự lấy mẫu do yêu cầu kỹ thuật đặc biệt
                        </Alert>

                        {bookingData.serviceType === 'civil' && (
                          <div className="text-center">
                            <Badge bg="success" className="px-3 py-2">
                              <i className="bi bi-check-circle me-2"></i>
                              Đã chọn loại dịch vụ này
                            </Badge>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} className="mb-4">
                    <Card
                      className={`h-100 border-warning cursor-pointer ${bookingData.serviceType === 'administrative' ? 'border-3 shadow-lg' : 'border-2'
                        }`}
                      onClick={() => handleServiceTypeChange('administrative')}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <Card.Header className="bg-warning text-dark text-center py-4">
                        <i className="bi bi-award fs-1 mb-3 d-block"></i>
                        <h3 className="mb-2">ADN Hành chính</h3>
                        <Badge bg="dark" className="fs-6">Có giá trị pháp lý</Badge>
                      </Card.Header>
                      <Card.Body className="p-4">
                        <div className="mb-4">
                          <h5 className="text-warning mb-3">Đặc điểm:</h5>
                          <ul className="list-unstyled">
                            <li className="mb-2"><i className="bi bi-shield-check text-warning me-2"></i>Có giá trị pháp lý đầy đủ</li>
                            <li className="mb-2"><i className="bi bi-shield-check text-warning me-2"></i>Được tòa án công nhận</li>
                            <li className="mb-2"><i className="bi bi-shield-check text-warning me-2"></i>Thu mẫu có giám sát nghiêm ngặt</li>
                            <li className="mb-2"><i className="bi bi-shield-check text-warning me-2"></i>Tuân thủ tiêu chuẩn quốc tế</li>
                          </ul>
                        </div>

                        <div className="mb-4">
                          <h6 className="text-warning mb-3">Phù hợp cho:</h6>
                          <ul className="small text-muted">
                            <li>Làm giấy khai sinh</li>
                            <li>Thủ tục nhập tịch, visa</li>
                            <li>Giải quyết tranh chấp thừa kế</li>
                            <li>Xác định trách nhiệm cấp dưỡng</li>
                          </ul>
                        </div>

                        <Alert variant="warning" className="small mb-3">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          <strong>Bắt buộc:</strong> KHÔNG thể tự lấy mẫu tại nhà. Phải có nhân viên giám sát để đảm bảo giá trị pháp lý.
                        </Alert>

                        {bookingData.serviceType === 'administrative' && (
                          <div className="text-center">
                            <Badge bg="warning" text="dark" className="px-3 py-2">
                              <i className="bi bi-check-circle me-2"></i>
                              Đã chọn loại dịch vụ này
                            </Badge>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Specific Service Selection */}
                {bookingData.serviceType && (
                  <>
                    <div className="mb-4">
                      <h3 className="mb-3">
                        Chọn dịch vụ cụ thể
                        <span className="ms-3">
                          {renderServiceTypeBadge(bookingData.serviceType, selectedService?.category)}
                        </span>
                      </h3>
                      <p className="text-muted">
                        Tất cả dịch vụ đều đảm bảo độ chính xác 99.999% với công nghệ hiện đại
                      </p>
                    </div>

                    <Row>
                      {getServicesByType(services, bookingData.serviceType).map(service => (
                        <Col key={service.id} lg={4} md={6} className="mb-4">
                          <Card
                            className={`h-100 border-0 shadow-sm ${bookingData.serviceId === service.id
                              ? 'border-start border-4 border-primary shadow-lg'
                              : ''
                              }`}
                            style={{
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              transform: bookingData.serviceId === service.id ? 'translateY(-5px)' : 'none'
                            }}
                            onClick={() => handleServiceSelect(service.id)}
                          >
                            {service.featured && (
                              <div className="position-relative">
                                <Badge
                                  bg="primary"
                                  className="position-absolute top-0 end-0 m-2"
                                  style={{ zIndex: 1 }}
                                >
                                  Nổi bật
                                </Badge>
                              </div>
                            )}

                            <Card.Header className={`border-0 ${service.category?.hasLegalValue ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'
                              }`}>
                              <div className="d-flex align-items-center mb-2">
                                <div className={`rounded-circle p-2 me-3 ${service.category?.hasLegalValue ? 'bg-warning' : 'bg-success'
                                  }`}>
                                  <i className={`${service.icon || 'bi-dna'} text-white fs-5`}></i>
                                </div>
                                <div className="flex-grow-1">
                                  {renderServiceTypeBadge(service.category?.hasLegalValue ? 'administrative' : 'civil', service.category)}
                                </div>
                              </div>
                            </Card.Header>

                            <Card.Body className="d-flex flex-column">
                              <Card.Title className="h5 mb-3">{service.title}</Card.Title>
                              <Card.Text className="text-muted flex-grow-1">
                                {service.description}
                              </Card.Text>

                              {/* Price and Duration */}
                              <div className="mb-3">
                                <div className="h5 text-primary mb-1">
                                  {typeof service.price === 'number'
                                    ? new Intl.NumberFormat('vi-VN').format(service.price) + ' VNĐ'
                                    : service.price || 'Liên hệ'
                                  }
                                </div>
                                <small className="text-muted">
                                  <i className="bi bi-clock me-1"></i>
                                  Thời gian: {service.duration}
                                </small>
                              </div>

                              {/* Collection Methods */}
                              <div className="mb-3">
                                <small className="text-muted d-block mb-2">Phương thức lấy mẫu:</small>
                                <div className="d-flex flex-wrap gap-1">
                                  {enrichedMethods.length > 0 ? (
                                    enrichedMethods.map(method => {
                                      const isDisabled = isMethodDisabled(method.id, service);
                                      return (
                                        <Badge
                                          key={method.id}
                                          bg={isDisabled ? 'secondary' : method.color || 'secondary'}
                                          className="me-1"
                                          style={{ opacity: isDisabled ? 0.5 : 1 }}
                                        >
                                          <i className={`${method.icon || 'bi-gear'} me-1`}></i>
                                          {getCollectionMethodName(method.id, method)}
                                        </Badge>
                                      );
                                    })
                                  ) : (
                                    <Badge bg="secondary">
                                      <i className="bi bi-gear me-1"></i>
                                      Đang cập nhật
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Special restrictions */}
                              {service.category?.hasLegalValue && (
                                <Alert variant="warning" className="small mb-3">
                                  <i className="bi bi-shield-check me-2"></i>
                                  Bắt buộc có giám sát khi lấy mẫu
                                </Alert>
                              )}

                              {service.id === 'civil-prenatal' && (
                                <Alert variant="info" className="small mb-3">
                                  <i className="bi bi-heart-pulse me-2"></i>
                                  Cần chuyên gia y tế thực hiện
                                </Alert>
                              )}

                              {bookingData.serviceId === service.id && (
                                <div className="text-center mt-2">
                                  <Badge bg="primary" className="px-3 py-2">
                                    <i className="bi bi-check-circle me-2"></i>
                                    Đã chọn dịch vụ này
                                  </Badge>
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}

                <Row className="mt-4">
                  <Col className="text-end">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={nextStep}
                      disabled={!bookingData.serviceId}
                    >
                      Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  </Col>
                </Row>
              </>
            )}

            {/* STEP 2: Collection Method Selection - Chọn phương thức lấy mẫu */}
            {currentStep === 2 && selectedService && (
              <>
                <div className="text-center mb-5">
                  <h2 className="display-6 fw-bold">Chọn phương thức lấy mẫu</h2>
                  <div className="mt-3">
                    <h5>Dịch vụ đã chọn: <span className="text-primary">{selectedService.title}</span></h5>
                    {renderServiceTypeBadge(selectedService.category?.hasLegalValue ? 'administrative' : 'civil', selectedService.category)}
                  </div>
                </div>

                {/* RESTRICTION ALERTS: Cảnh báo về hạn chế phương thức */}
                {selectedService.category?.hasLegalValue && (
                  <Alert variant="warning" className="mb-4">
                    <i className="bi bi-shield-check me-2"></i>
                    <strong>Lưu ý quan trọng:</strong> Với dịch vụ có giá trị pháp lý, bắt buộc phải thu mẫu
                    có giám sát (tại cơ sở hoặc nhân viên đến nhà) để đảm bảo tính chính xác và giá trị pháp lý.
                  </Alert>
                )}

                {selectedService.id === 'civil-prenatal' && (
                  <Alert variant="info" className="mb-4">
                    <i className="bi bi-heart-pulse me-2"></i>
                    <strong>ADN trước sinh đặc biệt:</strong> Cần có chuyên gia y tế thực hiện do yêu cầu
                    kỹ thuật cao và để đảm bảo an toàn cho mẹ và bé.
                  </Alert>
                )}

                {/* METHOD SELECTION: Danh sách các phương thức thu mẫu */}
                <Row>
                  {enrichedMethods.length > 0 ? (
                    enrichedMethods.map(method => {
                      // Kiểm tra method có thuộc serviceMethods không
                      const isAvailable = serviceMethods.some(sm => sm.id === method.id);
                      const isDisabled = !isAvailable || isMethodDisabled(method.id, selectedService);
                      const restrictionReason = getMethodRestrictionReason(method.id, selectedService);

                      return (
                        <Col key={method.id} lg={4} md={6} className="mb-4">
                          <Card
                            className={`h-100 border-2 ${isDisabled
                              ? 'border-light bg-light opacity-50'
                              : bookingData.collectionMethod === method.id
                                ? `border-${method.color || 'primary'} shadow-lg`
                                : `border-${method.color || 'primary'} border-opacity-25 cursor-pointer`
                              }`}
                            style={{
                              cursor: isDisabled ? 'not-allowed' : 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => !isDisabled && handleMethodSelect(method)}
                          >
                            <Card.Header className={`${isDisabled
                              ? 'bg-light text-muted'
                              : `bg-${method.color || 'primary'} text-white`
                              } text-center`}>
                              <div className="py-2">
                                <i className={`${method.icon || 'bi-gear'} fs-1 mb-2 d-block`}></i>
                                <h5 className="mb-0">{getCollectionMethodName(method.id, method)}</h5>
                                {isDisabled && (
                                  <Badge bg="danger" className="mt-2">
                                    Không khả dụng
                                  </Badge>
                                )}
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <Card.Text className="mb-3">{method.description}</Card.Text>

                              {isDisabled ? (
                                <Alert variant="danger" className="small">
                                  <i className="bi bi-x-circle me-2"></i>
                                  {restrictionReason || 'Phương thức này không áp dụng cho dịch vụ đã chọn.'}
                                </Alert>
                              ) : (
                                <>
                                  {method.price >= 0 && (
                                    <div className="mb-3">
                                      <strong>Phí dịch vụ:</strong>
                                      <div className="h5 text-primary">
                                        {new Intl.NumberFormat('vi-VN').format(method.price)} VNĐ
                                      </div>
                                    </div>
                                  )}

                                  {method.process && method.process.length > 0 && (
                                    <div className="mb-3">
                                      <strong>Quy trình thực hiện:</strong>
                                      <ol className="mt-2 small">
                                        {method.process.map((step, index) => (
                                          <li key={index} className="mb-1">{step}</li>
                                        ))}
                                      </ol>
                                    </div>
                                  )}

                                  {method.note && (
                                    <Alert variant={`${method.color === 'warning' ? 'warning' : 'info'}`} className="small mb-0">
                                      <i className="bi bi-info-circle me-2"></i>
                                      {method.note}
                                    </Alert>
                                  )}

                                  {bookingData.collectionMethod === method.id && (
                                    <div className="text-center mt-3">
                                      <Badge bg={method.color || 'primary'} className="px-3 py-2">
                                        <i className="bi bi-check-circle me-2"></i>
                                        Đã chọn phương thức này
                                      </Badge>
                                    </div>
                                  )}
                                </>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })
                  ) : (
                    <Col>
                      <Alert variant="secondary" className="text-center">
                        Không có phương thức lấy mẫu nào khả dụng cho dịch vụ này.
                      </Alert>
                    </Col>
                  )}
                </Row>

                {/* NAVIGATION BUTTONS: Nút điều hướng giữa các step */}
                <Row className="mt-4">
                  <Col>
                    <Button variant="outline-secondary" size="lg" onClick={prevStep}>
                      <i className="bi bi-arrow-left me-2"></i> Quay lại
                    </Button>
                  </Col>
                  <Col className="text-end">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={nextStep}
                      disabled={!bookingData.collectionMethod}
                    >
                      Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  </Col>
                </Row>
              </>
            )}

            {/* STEP 3: Customer Information & Appointment - Thông tin khách hàng và lịch hẹn */}
            {currentStep === 3 && selectedMethod && (
              <>
                <div className="text-center mb-5">
                  <h2 className="display-6 fw-bold">Thông tin đặt lịch</h2>
                  <p className="lead text-muted">
                    Vui lòng điền đầy đủ thông tin để hoàn tất việc đặt lịch
                  </p>
                </div>

                <Row>
                  {/* CUSTOMER INFORMATION: Form thông tin người đặt lịch */}
                  <Col lg={6} className="mb-4">
                    <Card className="shadow-sm">
                      <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">
                          <i className="bi bi-person me-2"></i>
                          Thông tin người đặt lịch
                        </h5>
                      </Card.Header>
                      <Card.Body className="p-4">
                        <Form>
                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Nhập họ và tên đầy đủ"
                                value={bookingData.customerInfo.fullName}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleCustomerInfoChange('fullName', value);
                                  setCustomerErrors(prev => ({
                                    ...prev,
                                    fullName: value.trim() ? '' : 'Họ và tên không được để trống'
                                  }));
                                }}
                                isInvalid={!!customerErrors.fullName}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {customerErrors.fullName}
                              </Form.Control.Feedback>
                            </Col>

                            <Col md={6} className="mb-3">
                              <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                              <Form.Control
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="Nhập số điện thoại"
                                value={bookingData.customerInfo.phone}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  handleCustomerInfoChange('phone', value);
                                  const error =
                                    !value
                                      ? 'Số điện thoại không được để trống'
                                      : !/^0\d{9}$/.test(value)
                                        ? 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 số'
                                        : '';
                                  setCustomerErrors(prev => ({ ...prev, phone: error }));
                                }}
                                isInvalid={!!customerErrors.phone}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {customerErrors.phone}
                              </Form.Control.Feedback>
                            </Col>
                          </Row>

                          <Row>
                            <Col md={6} className="mb-3">
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                type="email"
                                placeholder="Nhập địa chỉ email"
                                value={bookingData.customerInfo.email}
                                onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                              />
                            </Col>

                            <Col md={6} className="mb-3">
                              <Form.Label>CCCD <span className="text-danger">*</span></Form.Label>
                              <Form.Control
                                type="text"
                                inputMode="numeric"
                                maxLength={12}
                                placeholder="Nhập số CCCD"
                                value={bookingData.customerInfo.idNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, ''); // Chỉ cho số
                                  if (value.length <= 12) {
                                    handleCustomerInfoChange('idNumber', value);
                                    setCustomerErrors(prev => ({
                                      ...prev,
                                      idNumber: value.length === 12 ? '' : 'CCCD phải gồm đúng 12 chữ số'
                                    }));
                                  }
                                }}
                                isInvalid={!!customerErrors.idNumber}
                              />
                              <Form.Control.Feedback type="invalid">
                                {customerErrors.idNumber}
                              </Form.Control.Feedback>
                            </Col>
                          </Row>
                          
                          {/* ADDRESS FORM: Form địa chỉ chi tiết */}
                          <Form.Group>
                            <Row>
                              <Col md={6} className="mb-3">
                                <Form.Label>Tỉnh/Thành phố</Form.Label>
                                <Form.Select
                                  value={bookingData.customerInfo.city}
                                  onChange={e => {
                                    setBookingData(prev => ({
                                      ...prev,
                                      customerInfo: {
                                        ...prev.customerInfo,
                                        city: e.target.value,
                                        district: '',
                                        ward: ''
                                      }
                                    }));
                                  }}
                                >
                                  <option value="">Chọn tỉnh/thành phố</option>
                                  {getProvinces().map(p => (
                                    <option key={p.code} value={p.code}>{p.name}</option>
                                  ))}
                                </Form.Select>
                              </Col>
                              <Col md={6} className="mb-3">
                                <Form.Label>Quận/Huyện</Form.Label>
                                <Form.Select
                                  value={bookingData.customerInfo.district}
                                  onChange={e => {
                                    setBookingData(prev => ({
                                      ...prev,
                                      customerInfo: {
                                        ...prev.customerInfo,
                                        district: e.target.value,
                                        ward: ''
                                      }
                                    }));
                                  }}
                                  disabled={!bookingData.customerInfo.city}
                                >
                                  <option value="">Chọn quận/huyện</option>
                                  {getDistricts().filter(d => d.province_code === bookingData.customerInfo.city).map(d => (
                                    <option key={d.code} value={d.code}>{d.name}</option>
                                  ))}
                                </Form.Select>
                              </Col>
                            </Row>
                            <Row>
                              <Col md={6} className="mb-3">
                                <Form.Label>Phường/Xã</Form.Label>
                                <Form.Select
                                  value={bookingData.customerInfo.ward}
                                  onChange={e => setBookingData(prev => ({
                                    ...prev,
                                    customerInfo: {
                                      ...prev.customerInfo,
                                      ward: e.target.value
                                    }
                                  }))}
                                  disabled={!bookingData.customerInfo.district}
                                >
                                  <option value="">Chọn phường/xã</option>
                                  {getWards().filter(w => w.district_code === bookingData.customerInfo.district).map(w => (
                                    <option key={w.code} value={w.code}>{w.name}</option>
                                  ))}
                                </Form.Select>
                              </Col>
                              <Col md={6} className="mb-3">
                                <Form.Label>Số nhà, tên đường</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={bookingData.customerInfo.addressDetail}
                                  onChange={e => setBookingData(prev => ({
                                    ...prev,
                                    customerInfo: {
                                      ...prev.customerInfo,
                                      addressDetail: e.target.value
                                    }
                                  }))}
                                  placeholder="Số nhà, tên đường..."
                                />
                              </Col>
                            </Row>
                          </Form.Group>
                        </Form>
                      </Card.Body>
                    </Card>
                    
                    {/* APPOINTMENT DATE & TIME: Chọn ngày và giờ hẹn (chỉ hiển thị nếu không phải self-sample) */}
                    {bookingData.collectionMethod !== 'self-sample' && (
                      <Card className="mb-4 shadow-sm">
                        <Card.Header className="bg-warning text-dark">
                          <h5 className="mb-0">
                            <i className="bi bi-calendar me-2"></i>
                            Chọn ngày và giờ hẹn
                          </h5>
                        </Card.Header>
                        <Card.Body className="p-4">
                          <Form.Group className="mb-4">
                            <Form.Label>
                              Ngày hẹn <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              min={getDateOptions()[0]}
                              max={getDateOptions()[getDateOptions().length - 1]}
                              value={bookingData.appointmentDate}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, appointmentDate: e.target.value })
                              }
                              required
                            />
                            <Form.Text className="text-muted">
                              <i className="bi bi-info-circle me-1"></i>
                              Không làm việc vào Chủ nhật
                            </Form.Text>
                          </Form.Group>

                          {bookingData.appointmentDate && (
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Giờ hẹn <span className="text-danger">*</span>
                              </Form.Label>
                              <Row className="g-2">
                                {timeSlots.map((slot) => (
                                  <Col key={slot.value} xs={6} md={3}>
                                    <Button
                                      variant={
                                        bookingData.appointmentTime === slot.value
                                          ? 'warning'
                                          : 'outline-warning'
                                      }
                                      size="md"
                                      className="w-100 fw-bold py-2"
                                      style={{ borderRadius: 12, fontSize: 16 }}
                                      onClick={() =>
                                        setBookingData({
                                          ...bookingData,
                                          appointmentTime: slot.value,
                                        })
                                      }
                                    >
                                      {slot.label}
                                    </Button>
                                  </Col>
                                ))}
                              </Row>
                            </Form.Group>
                          )}
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                  
                  {/* PARTICIPANTS INFORMATION: Form thông tin người tham gia xét nghiệm */}
                  <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                      <Card.Header className="bg-info text-white">
                        <h5 className="mb-0">
                          <i className="bi bi-people me-2"></i>
                          Thông tin người tham gia xét nghiệm
                        </h5>
                      </Card.Header>
                      <Card.Body className="p-4">
                        <Row>
                          {[0, 1].map((idx) => (
                            <Col md={6} key={idx} className="mb-4">
                              <Card className="h-100 border-0 bg-light">
                                <Card.Body>
                                  <h6 className="text-primary mb-3">
                                    <i className="bi bi-person-badge me-2"></i>
                                    Người tham gia {idx + 1}
                                    {idx === 0 && (
                                      <Form.Check
                                        type="checkbox"
                                        id="participant1-customer"
                                        className="mt-0"
                                        checked={isParticipant1Customer}
                                        onChange={(e) => handleParticipant1AsCustomer(e.target.checked)}
                                        label={
                                          <small className="text-success">
                                            Là người đặt lịch
                                          </small>
                                        }
                                      />
                                    )}
                                  </h6>
                                  
                                  {/* PARTICIPANT FORM FIELDS: Các trường thông tin người tham gia */}
                                  <Form.Group className="mb-3">
                                    <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                      type="text"
                                      placeholder="Nhập họ và tên"
                                      value={bookingData.customerInfo.participants[idx]?.name || ''}
                                      onChange={e => {
                                        const value = e.target.value;
                                        // Validate: không chứa số, ký tự đặc biệt, tối thiểu 2 từ
                                        let error = '';
                                        if (!value.trim()) {
                                          error = 'Vui lòng nhập họ và tên.';
                                        } else if (/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(value)) {
                                          error = 'Tên không được chứa số hoặc ký tự đặc biệt.';
                                        } else if (value.trim().split(/\s+/).length < 2) {
                                          error = 'Vui lòng nhập họ & tên đúng và đầy đủ.';
                                        }
                                        setParticipantErrors(prev => ({ ...prev, [idx]: error }));
                                        handleParticipantChange(idx, 'name', value);
                                      }}
                                      isInvalid={!!participantErrors?.[idx]}
                                      required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {participantErrors?.[idx]}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                  
                                  <Form.Group className="mb-3">
                                    <Form.Label>CCCD</Form.Label>
                                    <Form.Control
                                      type="text"
                                      inputMode="numeric"
                                      maxLength={12}
                                      placeholder="Nhập số CCCD"
                                      value={bookingData.customerInfo.participants[idx]?.idNumber || ''}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Chỉ cho số
                                        if (value.length <= 12) {
                                          handleParticipantChange(idx, 'idNumber', value);

                                          if (value && value.length !== 12) {
                                            setIdNumberErrors(prev => ({
                                              ...prev,
                                              [idx]: 'CCCD phải gồm 12 chữ số',
                                            }));
                                          } else {
                                            setIdNumberErrors(prev => ({ ...prev, [idx]: '' }));
                                          }
                                        }
                                      }}
                                      isInvalid={!!idNumberErrors[idx]}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {idNumberErrors[idx]}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                  
                                  {/* AGE FIELD: Trường tuổi */}
                                  <Form.Group className="mb-3">
                                    <Form.Label>Tuổi <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                      type="number"
                                      min="1"
                                      max="130"
                                      placeholder="Nhập tuổi"
                                      value={bookingData.customerInfo.participants[idx]?.age || ''}
                                      onChange={e => {
                                        const value = e.target.value;
                                        const age = Number(value);

                                        if (value === '' || (!isNaN(age) && age >= 1 && age <= 130)) {
                                          // Nếu rỗng hoặc hợp lệ thì cập nhật
                                          handleParticipantChange(idx, 'age', value);
                                          setErrors((prev) => ({ ...prev, [`age_${idx}`]: '' }));
                                        } else {
                                          // Nếu sai, gán thông báo lỗi riêng từng người
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`age_${idx}`]: 'Tuổi phải từ 1 đến 130'
                                          }));
                                        }
                                      }}
                                      isInvalid={!!errors?.[`age_${idx}`]}
                                      required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {errors?.[`age_${idx}`]}
                                    </Form.Control.Feedback>
                                  </Form.Group>

                                  {/* GENDER FIELD: Trường giới tính */}
                                  <Form.Group className="mb-3">
                                    <Form.Label>Giới tính <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                      value={bookingData.customerInfo.participants[idx]?.gender || ''}
                                      onChange={e => handleParticipantChange(idx, 'gender', e.target.value)}
                                      required
                                    >
                                      <option value="">-- Chọn giới tính --</option>
                                      <option value="male">Nam</option>
                                      <option value="female">Nữ</option>
                                      <option value="other">Khác</option>
                                    </Form.Select>
                                  </Form.Group>

                                  {/* RELATIONSHIP FIELD: Trường mối quan hệ */}
                                  <Form.Label>Mối quan hệ <span className="text-danger">*</span></Form.Label>
                                  <Form.Select
                                    value={bookingData.customerInfo.participants[idx]?.relation || ''}
                                    onChange={e => {
                                      const value = e.target.value;
                                      const otherIdx = idx === 0 ? 1 : 0;
                                      const otherRelation = bookingData.customerInfo.participants[otherIdx]?.relation;

                                      const allowDuplicate = value === 'Chưa xác định' || otherRelation === 'Chưa xác định';
                                      if (!allowDuplicate && value === otherRelation) {
                                        setErrors(prev => ({
                                          ...prev,
                                          [`relation_${idx}`]: `Mối quan hệ này đã được chọn cho người kia`
                                        }));
                                      } else {
                                        setErrors(prev => ({ ...prev, [`relation_${idx}`]: '' }));
                                        handleParticipantChange(idx, 'relation', value);
                                      }
                                    }}
                                    isInvalid={!!errors?.[`relation_${idx}`]}
                                    required
                                  >
                                    <option value="">-- Chọn mối quan hệ --</option>
                                    {(() => {
                                      const gender = bookingData.customerInfo.participants[idx]?.gender;
                                      const baseRelations = gender === 'male'
                                        ? maleRelations
                                        : gender === 'female'
                                          ? femaleRelations
                                          : familyRelations;

                                      const otherRelation = bookingData.customerInfo.participants[idx === 0 ? 1 : 0]?.relation;
                                      const availableOptions = otherRelation
                                        ? getValidRelationsForOther(otherRelation).filter(r => baseRelations.includes(r))
                                        : baseRelations;
                                      return availableOptions.map((relation) => (
                                        <option key={relation} value={relation}>
                                          {relation}
                                        </option>
                                      ));
                                    })()}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {errors?.relation_1}
                                  </Form.Control.Feedback>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                {/* NAVIGATION BUTTONS: Nút điều hướng giữa các step */}
                <Row className="mt-4">
                  <Col>
                    <Button variant="outline-secondary" size="lg" onClick={prevStep}>
                      <i className="bi bi-arrow-left me-2"></i> Quay lại
                    </Button>
                  </Col>
                  <Col className="text-end">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={nextStep}
                      disabled={
                        !bookingData.customerInfo.fullName ||
                        !bookingData.customerInfo.phone ||
                        !bookingData.customerInfo.city ||
                        !bookingData.customerInfo.district ||
                        !bookingData.customerInfo.ward ||
                        !bookingData.customerInfo.addressDetail ||
                        !bookingData.customerInfo.participants ||
                        bookingData.customerInfo.participants.length < 2 ||
                        bookingData.customerInfo.participants.some((p, idx) => {
                          // Kiểm tra từng trường bắt buộc
                          if (!p.name || !p.idNumber || !p.age || !p.gender || !p.relation) return true;
                          // Kiểm tra lỗi validate
                          if (participantErrors[idx]) return true;
                          return false;
                        }) ||
                        (bookingData.collectionMethod !== 'self-sample' && (!bookingData.appointmentDate || !bookingData.appointmentTime))
                      }
                    >
                      Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  </Col>
                </Row>
              </>
            )}
            
            {/* STEP 4: Confirmation - Xác nhận thông tin đặt lịch */}
            {currentStep === 4 && (
              <>
                <div className="text-center mb-5">
                  <h2 className="display-6 fw-bold">Xác nhận thông tin đặt lịch</h2>
                  <p className="lead text-muted">
                    Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt lịch
                  </p>
                </div>
                
                {/* CONFIRMATION CARD: Card hiển thị tất cả thông tin đã nhập */}
                <Card className="shadow-lg">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-check-circle me-2"></i>
                      Chi tiết đặt lịch xét nghiệm ADN
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    {/* SERVICE & COST INFORMATION: Thông tin dịch vụ và chi phí */}
                    <Row>
                      <Col md={6} className="mb-4">
                        <h6 className="text-primary mb-3">
                          <i className="bi bi-gear me-2"></i>
                          Thông tin dịch vụ
                        </h6>
                        <div className="mb-2">
                          <strong>Tên dịch vụ:</strong>
                          <div className="text-muted">
                            {selectedService.title || 'Không có thông tin'}
                          </div>
                        </div>
                        <div className="mb-2">
                          <strong>Mô tả dịch vụ:</strong>
                          <div className="text-muted">
                            {selectedService.description || 'Không có mô tả'}
                          </div>
                        </div>
                        <Row className="mb-2">
                          <Col md={6}>
                            <strong>Loại dịch vụ:</strong>
                            <div className="mt-1">
                              {renderServiceTypeBadge(selectedService.category?.hasLegalValue ? 'administrative' : 'civil', selectedService.category)}
                            </div>
                          </Col>
                          <Col md={6}>
                            <strong>Phương thức thu mẫu:</strong>
                            <div className="mt-1">
                              <Badge bg={getMethodColor(bookingData.collectionMethod)}>
                                {getCollectionMethodName(bookingData.collectionMethod, selectedMethod)}
                              </Badge>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col md={6} className="mb-4">
                        <h6 className="text-primary mb-3">
                          <i className="bi bi-cash-coin me-2"></i>
                          Thông tin chi phí
                        </h6>
                        <div className="bg-light p-3 rounded">
                          <div className="d-flex justify-content-between mb-2">
                            <span>Giá dịch vụ:</span>
                            <span className="text-muted">
                              {selectedService.price && selectedService.price > 0
                                ? `${new Intl.NumberFormat('vi-VN').format(selectedService.price)} VNĐ`
                                : 'Liên hệ để biết giá'
                              }
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Phí dịch vụ (theo phương thức thu mẫu):</span>
                            <span className="text-muted">
                              {(() => {
                                const methodPrice = selectedMethod?.price || 0;
                                if (methodPrice > 0) {
                                  return `${new Intl.NumberFormat('vi-VN').format(methodPrice)} VNĐ`;
                                }
                                return 'Miễn phí';
                              })()}
                            </span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Tổng cộng:</h5>
                            <h4 className="text-primary mb-0">
                              {(() => {
                                const servicePrice = selectedService.price || 0;
                                const methodPrice = selectedMethod?.price || 0;
                                const totalAmount = servicePrice + methodPrice;

                                if (totalAmount > 0) {
                                  return `${new Intl.NumberFormat('vi-VN').format(totalAmount)} VNĐ`;
                                }
                                return 'Liên hệ để biết giá';
                              })()}
                            </h4>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span>Thời gian có kết quả:</span>
                            <strong>{selectedService.duration || 'Liên hệ để biết thời gian'}</strong>
                          </div>
                          <small className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Giá trên đã bao gồm thuế VAT và phí dịch vụ
                          </small>
                        </div>
                      </Col>
                    </Row>
                    <hr />
                    
                    {/* CUSTOMER INFORMATION: Thông tin khách hàng */}
                    <Row>
                      <Col md={12} className="mb-4">
                        <h6 className="text-primary mb-3">
                          <i className="bi bi-person me-2"></i>
                          Thông tin khách hàng
                        </h6>
                        <Row>
                          <Col md={3} className="mb-2">
                            <strong>Họ tên:</strong> {bookingData.customerInfo.fullName}
                          </Col>
                          <Col md={3} className="mb-2">
                            <strong>Điện thoại:</strong> {bookingData.customerInfo.phone}
                          </Col>
                          <Col md={3} className="mb-2">
                            <strong>Email:</strong> {bookingData.customerInfo.email || 'Không có'}
                          </Col>
                          <Col md={3} className="mb-2">
                            <strong>CCCD/CMND:</strong> {bookingData.customerInfo.idNumber}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <hr />
                    
                    {/* APPOINTMENT INFORMATION: Thông tin lịch hẹn */}
                    <Row>
                      <Col md={12} className="mb-4">
                        <h6 className="text-primary mb-3">
                          <i className="bi bi-calendar me-2"></i>
                          Thông tin lịch hẹn
                        </h6>
                        {bookingData.collectionMethod === 'self-sample' ? (
                          <div>
                            <Row className="mb-2">
                              <Col md={4}>
                                <strong>Phương thức:</strong> Tự lấy mẫu tại nhà
                              </Col>
                              <Col md={4}>
                                <strong>Thời gian nhận kit:</strong> <span className="text-warning">1-2 ngày làm việc</span>
                              </Col>
                              <Col md={4}>
                                <strong>Kit sẽ được gửi đến:</strong> {bookingData.customerInfo.address}
                              </Col>
                            </Row>
                          </div>
                        ) : (
                          <div>
                            <Row className="mb-2">
                              <Col md={3}>
                                <strong>Giờ hẹn:</strong> {bookingData.appointmentTime}
                              </Col>
                              <Col md={4}>
                                <strong>Ngày hẹn:</strong> {renderDate(bookingData.appointmentDate)}
                              </Col>
                              <Col md={5}>
                                <strong>Địa điểm:</strong> {
                                  bookingData.collectionMethod === 'at-facility' ?
                                    'Trung tâm xét nghiệm ADN - 123 Đường ABC, Quận XYZ' :
                                    bookingData.customerInfo.address
                                }
                              </Col>
                            </Row>
                          </div>
                        )}
                      </Col>
                    </Row>
                    
                    {/* PARTICIPANTS INFORMATION: Thông tin người tham gia */}
                    {bookingData.customerInfo.participants.length > 0 && (
                      <Row>
                        <Col md={6} className="mb-3">
                          <Card className="border-light">
                            <Card.Header className="bg-light">
                              <h6 className="mb-0 text-success">Người tham gia 1</h6>
                            </Card.Header>
                            <Card.Body className="p-3">
                              {bookingData?.customerInfo?.participants?.[0] ? (
                                <div className="d-flex flex-column align-items-center text-center">
                                  <div className="mb-2">
                                    <strong>Tên:</strong> {bookingData.customerInfo.participants[0].name}
                                  </div>
                                  <div className="mb-2">
                                    <strong>CCCD:</strong> {bookingData.customerInfo.participants[0].idNumber}
                                  </div>
                                  <div className="mb-2">
                                    <strong>Tuổi:</strong> {bookingData.customerInfo.participants[0].age}
                                  </div>
                                  <div>
                                    <strong>Quan hệ:</strong> {bookingData.customerInfo.participants[0].relation || 'N/A'}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-muted text-center">Chưa có thông tin</div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Card className="border-light">
                            <Card.Header className="bg-light">
                              <h6 className="mb-0 text-success">Người tham gia 2</h6>
                            </Card.Header>
                            <Card.Body className="p-3">
                              {bookingData?.customerInfo?.participants?.[1] ? (
                                <div className="text-center">
                                  <div className="mb-2">
                                    <strong>Tên:</strong> {bookingData.customerInfo.participants[1].name}
                                  </div>
                                  <div className="mb-2">
                                    <strong>CCCD:</strong> {bookingData.customerInfo.participants[1].idNumber}
                                  </div>
                                  <div className="mb-2">
                                    <strong>Tuổi:</strong> {bookingData.customerInfo.participants[1].age}
                                  </div>
                                  <div>
                                    <strong>Quan hệ:</strong> {bookingData.customerInfo.participants[1].relation || 'N/A'}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-muted text-center">Chưa có thông tin</div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    )}
                    <hr />
                    
                    {/* IMPORTANT NOTES: Lưu ý quan trọng */}
                    <Alert variant="info" className="mb-0">
                      <div className="d-flex flex-column align-items-center text-center">
                        <i className="bi bi-info-circle fs-4 mb-3"></i>
                        <div>
                          <strong>Lưu ý quan trọng:</strong>
                          <ul className="mt-3">
                            {bookingData.collectionMethod !== 'self-sample' && (
                              <li>Vui lòng có mặt đúng giờ hẹn. Trễ hẹn quá 15 phút có thể bị hủy lịch.</li>
                            )}
                            <li>Mang theo CCCD/CMND gốc của tất cả người tham gia xét nghiệm.</li>
                            {selectedService.category?.hasLegalValue && (
                              <li>Xét nghiệm hành chính yêu cầu có mặt đồng thời của tất cả đương sự.</li>
                            )}
                            {bookingData.collectionMethod === 'self-sample' && (
                              <li>Kit xét nghiệm sẽ được gửi đến địa chỉ của bạn trong 1-2 ngày làm việc.</li>
                            )}
                            <li>Kết quả sẽ được thông báo qua email và SMS khi có.</li>
                            <li>Tư vấn miễn phí 24/7 qua hotline: <strong>1900 1234</strong></li>
                          </ul>
                        </div>
                      </div>
                    </Alert>
                  </Card.Body>
                </Card>

                {/* FINAL NAVIGATION BUTTONS: Nút cuối cùng để xác nhận hoặc quay lại */}
                <Row className="mt-4">
                  <Col>
                    <Button variant="outline-secondary" size="lg" onClick={prevStep}>
                      <i className="bi bi-arrow-left me-2"></i> Quay lại chỉnh sửa
                    </Button>
                  </Col>
                  <Col className="text-end">
                    <Button variant="success" size="lg" onClick={handleBookingSubmit}>
                      <i className="bi bi-check-circle me-2"></i> Xác nhận đặt lịch
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </Container>

      {/* QUICK CONTACT SUPPORT: Section hỗ trợ nhanh */}
      <section className="bg-light py-4 mt-5">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h5 className="mb-2">
                <i className="bi bi-headset me-2"></i>
                Cần hỗ trợ trong quá trình đặt lịch?
              </h5>
              <p className="text-muted mb-0">
                Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-md-end">
                <Button variant="primary">
                  <i className="bi bi-telephone me-2"></i>
                  1900 1234
                </Button>
                <Button variant="outline-primary">
                  <i className="bi bi-chat-dots me-2"></i>
                  Chat ngay
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};
export default AppointmentBooking;