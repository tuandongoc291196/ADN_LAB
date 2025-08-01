/**
 * COMPONENT: UserManagement
 * MỤC ĐÍCH: Quản lý tất cả người dùng trong hệ thống
 * CHỨC NĂNG:
 * - Quản lý người dùng (customers) và nhân viên
 * - Phân quyền và thay đổi role
 * - Theo dõi hoạt động và lịch sử người dùng
 * - Quản lý trạng thái tài khoản (active/inactive)
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Card, Row, Col, Button, Table, Badge, Modal, Form,
  Alert, InputGroup, Dropdown, Pagination, Toast, ToastContainer,
  Tab, Tabs, ProgressBar
} from 'react-bootstrap';
import { getStaffListByRole, getAllRoles, getAllUsers, addUser, getUserById, updateUserById, updateUserAccountStatus, getBookingByUserId } from '../../services/api';
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';

function findCodeByName(list, name) {
  if (!name) return '';
  const normalize = str => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return (list.find(item => normalize(item.name) === normalize(name)) || {}).code || '';
}

// Function để tạo email từ họ tên
const generateEmailFromName = (fullname) => {
  if (!fullname || fullname.trim() === '') return '';
  
  // Loại bỏ dấu tiếng Việt và chuyển thành chữ thường
  const normalize = str => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const normalizedName = normalize(fullname.trim());
  
  // Tách thành các từ
  const words = normalizedName.split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return '';
  
  if (words.length === 1) {
    // Nếu chỉ có 1 từ, dùng luôn từ đó
    return `${words[0]}@adnlab.com`;
  }
  
  // Lấy từ cuối (tên) + chữ cái đầu của các từ trước đó (họ và tên lót)
  const lastName = words[words.length - 1]; // Tên
  const initials = words.slice(0, -1).map(word => word.charAt(0)).join(''); // Chữ cái đầu của họ và tên lót
  
  return `${lastName}${initials}@adnlab.com`;
};

// Helper function để format currency
const formatCurrency = (amount) => {
  if (!amount) return '0';
  return amount.toLocaleString('vi-VN');
};

// Component con để hiển thị total payment với async loading
const UserTotalPayment = ({ user, getUserTotalPayment, loadingBookings }) => {
  const [totalPayment, setTotalPayment] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadTotalPayment = useCallback(async () => {
    if (!user || !user.id || hasLoaded) return;
    
    setIsLoading(true);
    try {
      const total = await getUserTotalPayment(user);
      setTotalPayment(total);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading total payment:', error);
      setTotalPayment(0);
    } finally {
      setIsLoading(false);
    }
  }, [user, getUserTotalPayment, hasLoaded]);

  useEffect(() => {
    if (user && user.id && !loadingBookings[user.id] && !hasLoaded) {
      loadTotalPayment();
    }
  }, [user, getUserTotalPayment, loadingBookings, loadTotalPayment, hasLoaded]);

  if (isLoading || loadingBookings[user?.id]) {
    return <span className="text-muted">...</span>;
  }

  return <span className="fw-medium">{formatCurrency(totalPayment)}</span>;
};

// Component con để hiển thị test count với async loading
const UserTestCount = ({ user, getUserTestCount, loadingBookings }) => {
  const [testCount, setTestCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadTestCount = useCallback(async () => {
    if (!user || !user.id || hasLoaded) return;
    
    setIsLoading(true);
    try {
      const count = await getUserTestCount(user);
      setTestCount(count);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading test count:', error);
      setTestCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [user, getUserTestCount, hasLoaded]);

  useEffect(() => {
    if (user && user.id && !loadingBookings[user.id] && !hasLoaded) {
      loadTestCount();
    }
  }, [user, getUserTestCount, loadingBookings, loadTestCount, hasLoaded]);

  if (isLoading || loadingBookings[user?.id]) {
    return <span className="text-muted">...</span>;
  }

  return <span className="fw-medium">{testCount}</span>;
};

const UserManagement = ({ 
  user, 
  preloadedUsers = [],
  preloadedRoles = [],
  usersLoading = false,
  usersError = null,
  onRefreshUsers = null
}) => {
  // State quản lý tabs và dữ liệu
  const [activeTab, setActiveTab] = useState('users'); // Tab hiện tại: users/staff/activities
  const [roles, setRoles] = useState([]); // Danh sách người dùng theo role
  const [loading, setLoading] = useState(!preloadedUsers || preloadedUsers.length === 0); // Trạng thái loading
  const [error, setError] = useState(usersError); // Lỗi khi fetch dữ liệu
  const [activities, setActivities] = useState([]); // Lịch sử hoạt động
  const [staffCount, setStaffCount] = useState(0); // Số lượng nhân viên
  
  // State quản lý modal
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [modalType, setModalType] = useState('edit'); // Loại modal: edit/create/view
  const [editingUser, setEditingUser] = useState(null); // User đang được chỉnh sửa
  const [loadingUserDetail, setLoadingUserDetail] = useState(false); // Loading khi lấy chi tiết user
  
  // State quản lý filter và search
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [filterRole, setFilterRole] = useState('all'); // Lọc theo role
  const [filterStatus, setFilterStatus] = useState('all'); // Lọc theo trạng thái
  
  // State quản lý UI
  const [showToast, setShowToast] = useState(false); // Hiển thị thông báo
  const [toastMessage, setToastMessage] = useState(''); // Nội dung thông báo
  
  // State quản lý pagination
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại cho users
  const [currentStaffPage, setCurrentStaffPage] = useState(1); // Trang hiện tại cho staff
  const [currentManagerPage, setCurrentManagerPage] = useState(1); // Trang hiện tại cho managers
  const [itemsPerPage] = useState(10); // Số items mỗi trang

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    address: '',
    addressDetail: '',
    ward: '',
    district: '',
    city: '',
    gender: '',
    role: 'staff', // Default to staff instead of customer
    accountStatus: 'active',
    authProvider: '',
    avatar: '',
    password: ''
  });

  // 1. State riêng cho users và staff
  const [usersList, setUsersList] = useState([]); // Danh sách người dùng (customer)
  const [staffList, setStaffList] = useState([]); // Danh sách nhân viên (staff, manager)
  const [managerList, setManagerList] = useState([]); // Danh sách quản lý (manager)
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingManagers, setLoadingManagers] = useState(false);

  // 1. State cho tổng tài khoản
  const [allUsers, setAllUsers] = useState(preloadedUsers || []); // Dùng cho count tổng tài khoản

  // State cho roles
  const [roleOptions, setRoleOptions] = useState(preloadedRoles || []);
  const [loadingRoles, setLoadingRoles] = useState(false);



  // Effect tự động cập nhật địa chỉ đầy đủ khi các trường địa chỉ thay đổi
  useEffect(() => {
    if (formData.addressDetail || formData.ward || formData.district || formData.city) {
      const provinces = getProvinces();
      const districts = formData.city ? getDistricts().filter(d => d.province_code === formData.city) : [];
      const wards = formData.district ? getWards().filter(w => w.district_code === formData.district) : [];
      
      const address = [
        formData.addressDetail,
        wards.find(w => w.code === formData.ward)?.name || '',
        districts.find(d => d.code === formData.district)?.name || '',
        provinces.find(p => p.code === formData.city)?.name || ''
      ].filter(Boolean).join(', ');
      
      setFormData(prev => ({ ...prev, address }));
    }
  }, [formData.addressDetail, formData.ward, formData.district, formData.city]);

  // Effect tự động tạo email từ họ tên khi tạo người dùng mới
  useEffect(() => {
    if (modalType === 'create' && formData.fullname) {
      const generatedEmail = generateEmailFromName(formData.fullname);
      setFormData(prev => ({ ...prev, email: generatedEmail }));
    }
  }, [formData.fullname, modalType]);

  // Khởi tạo data từ preloaded ngay từ đầu
  useEffect(() => {
    if (preloadedUsers && preloadedUsers.length > 0) {
      setAllUsers(preloadedUsers);
      // Lọc users và staff ngay từ đầu
      setUsersList(preloadedUsers.filter(u => u.role?.name === 'customer'));
      setStaffList(preloadedUsers.filter(u => u.role?.name === 'staff'));
      setManagerList(preloadedUsers.filter(u => u.role?.name === 'manager'));
      setLoading(false);
    } else {
      // Nếu không có preloaded data, đặt loading = false để không bị stuck
      setLoading(false);
    }
  }, [preloadedUsers]);

  // Effect lấy users (customer) khi vào tab users - chỉ khi cần thiết
  useEffect(() => {
    if (activeTab === 'users' && usersList.length === 0 && !preloadedUsers?.length) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const allUsers = await getAllUsers();
          setAllUsers(allUsers || []);
          setUsersList(allUsers.filter(u => u.role?.name === 'customer'));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab, usersList.length, preloadedUsers]);

  // Effect lấy staff/manager khi vào tab staff - chỉ khi cần thiết
  useEffect(() => {
    if (activeTab === 'staff') {
      const fetchStaff = async () => {
        setLoadingStaff(true);
        try {
          let staffList = await getStaffListByRole([1, 2]);
          setStaffList(staffList.filter(s => s.role?.name === 'staff') || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingStaff(false);
        }
      };
      fetchStaff();
    }
  }, [activeTab]);

  // Effect lấy managers khi vào tab managers
  useEffect(() => {
    if (activeTab === 'managers') {
      const fetchManagers = async () => {
        setLoadingManagers(true);
        try {
          let staffList = await getStaffListByRole([1, 2]);
          setManagerList(staffList.filter(s => s.role?.name === 'manager') || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingManagers(false);
        }
      };
      fetchManagers();
    }
  }, [activeTab]);

  // Effect lấy all users cho count tổng tài khoản - chỉ khi cần thiết
  useEffect(() => {
    if (!allUsers.length && !preloadedUsers?.length) {
      const fetchAllUsers = async () => {
        try {
          const all = await getAllUsers();
          setAllUsers(all || []);
        } catch (err) {
          // Xử lý lỗi một cách im lặng
        }
      };
      fetchAllUsers();
    }
  }, [allUsers.length, preloadedUsers]);



  // Filter users
  const filteredUsers = Array.isArray(usersList) 
    ? usersList.filter(user => {
        if (!user) return false;
        const matchesSearch = ((user.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone || '').includes(searchTerm));
        const matchesRole = filterRole === 'all' || (user.role?.name === filterRole);
        const matchesStatus = filterStatus === 'all' || user.accountStatus === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
      })
    : [];

  // 5. Filter staff
  const filteredStaff = Array.isArray(staffList)
    ? staffList.filter(member => {
        if (!member) return false;
        if (!member.role || member.role.name !== 'staff') return false;
        const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
        const matchesSearch =
          (member.fullname?.toLowerCase() || member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (member.phone || '').includes(searchTerm);
        return matchesDepartment && matchesSearch;
      })
    : [];

  // Filter managers
  const filteredManagers = Array.isArray(managerList)
    ? managerList.filter(manager => {
        if (!manager) return false;
        if (!manager.role || manager.role.name !== 'manager') return false;
        const matchesDepartment = filterDepartment === 'all' || manager.department === filterDepartment;
        const matchesSearch =
          (manager.fullname?.toLowerCase() || manager.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (manager.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (manager.phone || '').includes(searchTerm);
        return matchesDepartment && matchesSearch;
      })
    : [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = Array.isArray(filteredUsers) 
    ? filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil((filteredUsers?.length || 0) / itemsPerPage);

  // Pagination for staff
  const indexOfLastStaff = currentStaffPage * itemsPerPage;
  const indexOfFirstStaff = indexOfLastStaff - itemsPerPage;
  const currentStaff = Array.isArray(filteredStaff) 
    ? filteredStaff.slice(indexOfFirstStaff, indexOfLastStaff)
    : [];
  const totalStaffPages = Math.ceil((filteredStaff?.length || 0) / itemsPerPage);

  // Pagination for managers
  const indexOfLastManager = currentManagerPage * itemsPerPage;
  const indexOfFirstManager = indexOfLastManager - itemsPerPage;
  const currentManagers = Array.isArray(filteredManagers) 
    ? filteredManagers.slice(indexOfFirstManager, indexOfLastManager)
    : [];
  const totalManagerPages = Math.ceil((filteredManagers?.length || 0) / itemsPerPage);



  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success" className="px-3 py-2"><i className="bi bi-check-circle me-1"></i>Hoạt động</Badge>;
      case 'inactive':
        return <Badge bg="danger" className="px-3 py-2"><i className="bi bi-x-circle me-1"></i>Không hoạt động</Badge>;
      default:
        return <Badge bg="light" className="px-3 py-2"><i className="bi bi-question-circle me-1"></i>Không xác định</Badge>;
    }
  };

  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'admin':
        return <Badge bg="danger">Quản trị viên</Badge>;
      case 'staff':
        return <Badge bg="info">Nhân viên</Badge>;
      case 'customer':
        return <Badge bg="primary">Khách hàng</Badge>;
      case 'manager':
        return <Badge bg="secondary">Quản lý</Badge>;
      default:
        return <Badge bg="light">Không xác định</Badge>;
    }
  };

  const handleShowModal = async (type, userItem = null) => {
    setModalType(type);
    setShowModal(true);
    
    if (type === 'create') {
      setLoadingRoles(true);
      // Sử dụng preloaded roles nếu có, nếu không thì fetch
      if (preloadedRoles && preloadedRoles.length > 0) {
        setRoleOptions(preloadedRoles);
        setLoadingRoles(false);
      } else {
        getAllRoles().then((roles) => {
          setRoleOptions(roles);
        }).finally(() => setLoadingRoles(false));
      }
      
      // Reset form cho create - chỉ cần các field cơ bản
      setFormData({
        fullname: '',
        email: '',
        password: '',
        role: 'customer',
        // Các field khác không cần thiết cho create
        phone: '',
        address: '',
        addressDetail: '',
        ward: '',
        district: '',
        city: '',
        gender: '',
        accountStatus: 'active',
        authProvider: '',
        avatar: ''
      });
      setEditingUser(null);
    } else if (userItem && (type === 'edit' || type === 'view')) {
      setLoadingUserDetail(true);
      try {
        // Load chi tiết từ API cho cả view và edit mode
        const user = await getUserById(userItem.id);
        if (user) {
          // Nếu là customer, fetch thêm booking data để hiển thị thống kê
          if (user.role?.name === 'customer') {
            try {
              const bookings = await getBookingByUserId(user.id);
              user.bookings_on_user = bookings || [];
            } catch (bookingError) {
              console.error('Error fetching user bookings:', bookingError);
              user.bookings_on_user = [];
            }
          }
          setEditingUser(user);
          
          // Chỉ populate formData cho edit mode
          if (type === 'edit') {
            // Parse address giống như UserProfile
            let addressDetail = '', ward = '', district = '', city = '';
            if (user.address) {
              const parts = user.address.split(',').map(s => s.trim());
              if (parts.length === 4) {
                addressDetail = parts[0];
                const cityCode = findCodeByName(getProvinces(), parts[3]);
                const districtCode = findCodeByName(getDistricts().filter(d => d.province_code === cityCode), parts[2]);
                const wardCode = findCodeByName(getWards().filter(w => w.district_code === districtCode), parts[1]);
                city = cityCode;
                district = districtCode;
                ward = wardCode;
              } else {
                addressDetail = user.address;
                ward = '';
                district = '';
                city = '';
              }
            }
            
            setFormData({
              fullname: user.fullname || '',
              email: user.email || '', // Read-only trong edit mode
              phone: user.phone || '',
              address: user.address || '',
              addressDetail,
              ward,
              district,
              city,
              gender: user.gender || '',
              role: user.role?.name || 'customer', // Không thể edit role trực tiếp
              accountStatus: user.accountStatus || 'active',
              authProvider: user.authProvider || '',
              avatar: user.avatar || '',
              password: '' // Không cần password trong edit mode
            });
            
            // Load roles cho edit
            setLoadingRoles(true);
            if (preloadedRoles && preloadedRoles.length > 0) {
              setRoleOptions(preloadedRoles);
              setLoadingRoles(false);
            } else {
              getAllRoles().then((roles) => {
                setRoleOptions(roles || []);
              }).catch((err) => {
                setError(err.message);
              }).finally(() => setLoadingRoles(false));
            }
          }
        }
      } catch (err) {
        setError('Không thể lấy thông tin chi tiết người dùng');
        console.error('Error fetching user detail:', err);
      } finally {
        setLoadingUserDetail(false);
      }
    }
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Update existing user theo API updateUser
        const { fullname, gender, avatar, phone, address } = formData;
        
        // Tạo dữ liệu update chỉ với các field được backend hỗ trợ
        const updateData = {
          userId: editingUser.id,
          fullname,
          gender,
          avatar,
          phone,
          address
        };
        
        // Gọi API update
        await updateUserById(editingUser.id, updateData);
        
        // Hiển thị thông báo thành công
        setToastMessage('Cập nhật thông tin người dùng thành công');
        setShowToast(true);
        
        // Đóng modal
        setShowModal(false);
        
        // Refresh data nếu có callback
        if (onRefreshUsers) {
          onRefreshUsers();
        }
      } else {
        // Create new user
        const { fullname, email, password, role } = formData;
        
        // Validate các trường bắt buộc cho create
        if (!email || !password || !fullname || !role) {
          setError('Vui lòng điền đầy đủ thông tin bắt buộc');
          return;
        }
        
        // Kiểm tra role chỉ được là staff hoặc manager
        if (!['staff', 'manager'].includes(role)) {
          setError('Chỉ có thể tạo tài khoản cho Nhân viên hoặc Quản lý');
          return;
        }
        
        // Tạo dữ liệu mới theo API addUser
        const userData = {
          email,
          password,
          name: fullname, // Backend expects 'name', not 'fullname'
          roleId: role === 'staff' ? '1' : role === 'manager' ? '2' : '1' // staff=1, manager=2
        };
        
        console.log('Creating user with data:', { ...userData, password: '[HIDDEN]' });
        console.log('Role mapping:', { role, roleId: userData.roleId });
        
        // Gọi API create
        await addUser(userData);
        
        // Hiển thị thông báo thành công
        setToastMessage('Tạo người dùng mới thành công');
        setShowToast(true);
        
        // Đóng modal
        setShowModal(false);
        
        // Refresh data nếu có callback
        if (onRefreshUsers) {
          onRefreshUsers();
        }
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lưu thông tin người dùng');
    }
  };

  // Xóa phần copy ID dưới tên người dùng và chỉ giữ trong modal chi tiết
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setToastMessage('Đã sao chép ID vào clipboard');
    setShowToast(true);
  };

    const handleStatusChange = async (id, newStatus) => {
    if (!id) return;
    
    console.log(`🔄 Attempting to update user ${id} status to ${newStatus}`);
    
    try {
      // Cập nhật trạng thái trước trong UI để phản hồi ngay lập tức
      setAllUsers(prev => prev.map(u => u.id === id ? {...u, accountStatus: newStatus} : u));
      setUsersList(prev => prev.map(u => u.id === id ? {...u, accountStatus: newStatus} : u));
      setStaffList(prev => prev.map(u => u.id === id ? {...u, accountStatus: newStatus} : u));
      setManagerList(prev => prev.map(u => u.id === id ? {...u, accountStatus: newStatus} : u));
      
      console.log(`📡 Calling updateUserAccountStatus API...`);
      // Gọi API để cập nhật trạng thái sử dụng endpoint chuyên biệt
      const result = await updateUserAccountStatus(id, newStatus);
      console.log(`✅ API call successful:`, result);
      
      // Hiển thị thông báo thành công
      setToastMessage(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản`);
      setShowToast(true);
      
      // Refresh data nếu có callback
      if (onRefreshUsers) {
        onRefreshUsers();
      }
    } catch (err) {
      console.error(`❌ Error updating user status:`, err);
      // Nếu có lỗi, khôi phục trạng thái cũ
      const oldStatus = newStatus === 'active' ? 'inactive' : 'active';
      setAllUsers(prev => prev.map(u => u.id === id ? {...u, accountStatus: oldStatus} : u));
      setUsersList(prev => prev.map(u => u.id === id ? {...u, accountStatus: oldStatus} : u));
      setStaffList(prev => prev.map(u => u.id === id ? {...u, accountStatus: oldStatus} : u));
      setManagerList(prev => prev.map(u => u.id === id ? {...u, accountStatus: oldStatus} : u));
      
      setError(`Có lỗi xảy ra khi cập nhật trạng thái người dùng: ${err.message}`);
    }
  };

    const handleDeleteUser = async (id) => {
    if (!id) return;
    
    if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?')) {
      console.log(`🗑️ Attempting to deactivate user ${id}`);
      
      try {
        // Cập nhật trạng thái trước trong UI
        setAllUsers(prev => prev.map(u => u.id === id ? {...u, accountStatus: 'inactive'} : u));
        setUsersList(prev => prev.map(u => u.id === id ? {...u, accountStatus: 'inactive'} : u));
        setStaffList(prev => prev.map(u => u.id === id ? {...u, accountStatus: 'inactive'} : u));
        setManagerList(prev => prev.map(u => u.id === id ? {...u, accountStatus: 'inactive'} : u));
        
        console.log(`📡 Calling updateUserAccountStatus API to deactivate...`);
        // Gọi API để cập nhật trạng thái thành inactive sử dụng endpoint chuyên biệt
        const result = await updateUserAccountStatus(id, 'inactive');
        console.log(`✅ User deactivated successfully:`, result);
        
        // Hiển thị thông báo thành công
        setToastMessage('Đã vô hiệu hóa tài khoản người dùng');
        setShowToast(true);
        
        // Refresh data nếu có callback
        if (onRefreshUsers) {
          onRefreshUsers();
        }
      } catch (err) {
        console.error(`❌ Error deactivating user:`, err);
        setError(`Có lỗi xảy ra khi vô hiệu hóa người dùng: ${err.message}`);
      }
    }
  };



  const formatLastLogin = (timestamp) => {
    if (!timestamp) return 'Chưa đăng nhập';
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  // Function to get booking/test count for a specific user using getBookingByUserId API
  const getUserTestCount = useCallback(async (user) => {
    if (!user || !user.id) return 0;
    
    // Fetch booking data nếu chưa có
    const bookings = await fetchUserBookings(user.id);
    if (!bookings || !Array.isArray(bookings)) return 0;
    
    return bookings.length;
  }, []);

  // State để lưu trữ booking data cho từng user
  const [userBookings, setUserBookings] = useState({});
  const [loadingBookings, setLoadingBookings] = useState({});
  const loadedUsersRef = useRef(new Set()); // Sử dụng ref thay vì state để tránh re-render

  // Function để fetch booking data cho một user
  const fetchUserBookings = useCallback(async (userId) => {
    if (!userId) return [];
    
    // Kiểm tra cache trước
    if (userBookings[userId]) return userBookings[userId];
    
    // Kiểm tra xem đã load chưa để tránh gọi API trùng lặp
    if (loadedUsersRef.current.has(userId)) return userBookings[userId] || [];
    
    setLoadingBookings(prev => ({ ...prev, [userId]: true }));
    try {
      const bookings = await getBookingByUserId(userId);
      setUserBookings(prev => ({ ...prev, [userId]: bookings }));
      loadedUsersRef.current.add(userId);
      return bookings;
    } catch (error) {
      console.error(`Error fetching bookings for user ${userId}:`, error);
      return [];
    } finally {
      setLoadingBookings(prev => ({ ...prev, [userId]: false }));
    }
  }, [userBookings]);

  const getUserTotalPayment = useCallback(async (user) => {
    if (!user || !user.id) return 0;
    
    // Fetch booking data nếu chưa có
    const bookings = await fetchUserBookings(user.id);
    if (!bookings || !Array.isArray(bookings)) return 0;
    
    // Tính tổng số tiền từ tất cả booking của user, sử dụng logic giống DashboardOverview
    return bookings.reduce((total, booking) => {
      // Sử dụng bookingHistories_on_booking để xác định trạng thái hiện tại (giống DashboardOverview)
      const history = booking.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
      const currentHistoryStatus = history.length > 0 ? history[0].status : null;
      
      // Loại trừ các đơn hàng có trạng thái bị hủy hoặc hết hạn (giống DashboardOverview)
      if (currentHistoryStatus && 
          !['CANCELLED', 'EXPIRED'].includes(currentHistoryStatus)) {
        if (booking.totalAmount && !isNaN(parseFloat(booking.totalAmount))) {
          return total + parseFloat(booking.totalAmount);
        }
      }
      return total;
    }, 0);
  }, [fetchUserBookings]);

  if (loading || usersLoading) return <div className="text-center py-5"><span>Đang tải dữ liệu người dùng...</span></div>;
  if (error || usersError) return <Alert variant="danger">Lỗi: {error || usersError}</Alert>;

  const renderUsersTable = () => (
    <Table hover responsive className="align-middle table-striped">
      <thead className="bg-light">
        <tr>
          <th className="text-center fw-bold" style={{ width: '35%' }}>Người dùng</th>
          <th className="text-center fw-bold" style={{ width: '15%' }}>Vai trò</th>
          <th className="text-center fw-bold" style={{ width: '15%' }}>Trạng thái</th>
          <th className="text-center fw-bold" style={{ width: '15%' }}>Xét nghiệm</th>
          <th className="text-end fw-bold" style={{ width: '10%' }}>Chi tiêu</th>
          <th className="text-center fw-bold" style={{ width: '10%' }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {loadingUsers ? (
          <tr>
            <td colSpan="6" className="text-center">
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </td>
          </tr>
        ) : currentUsers.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center">
              Không có dữ liệu người dùng
            </td>
          </tr>
        ) : (
          currentUsers.map((userItem, index) => (
            <tr key={userItem.id || index}>
              <td className="text-start">
                <div className="d-flex align-items-center">
                  <div className="me-3 flex-shrink-0">
                    {userItem.avatar ? (
                      <img
                        src={userItem.avatar}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userItem.fullname || 'U')}&background=0D8ABC&color=fff&size=40`;
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', fontSize: '18px' }}
                      >
                        {userItem.fullname?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <div className="fw-medium text-truncate">{userItem.fullname || 'Chưa cập nhật tên'}</div>
                    <small className="text-muted text-truncate d-block">{userItem.email || 'N/A'}</small>
                    {userItem.phone && (
                      <small className="text-muted text-truncate d-block">{userItem.phone}</small>
                    )}
                  </div>
                </div>
              </td>
              <td className="text-center">{getRoleBadge(userItem.role?.name)}</td>
              <td className="text-center">{getStatusBadge(userItem.accountStatus)}</td>
              <td className="text-center">
                <UserTestCount user={userItem} getUserTestCount={getUserTestCount} loadingBookings={loadingBookings} />
              </td>
              <td className="text-end">
                <UserTotalPayment user={userItem} getUserTotalPayment={getUserTotalPayment} loadingBookings={loadingBookings} />
              </td>
              <td className="text-center">
                <Dropdown className="position-static" drop={index === currentUsers.length - 1 ? 'up' : 'down'} align="end">
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <i className="bi bi-three-dots"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleShowModal('view', userItem)}>
                      <i className="bi bi-eye me-2"></i>Xem chi tiết
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleShowModal('edit', userItem)}>
                      <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => handleStatusChange(userItem.id, userItem.accountStatus === 'active' ? 'inactive' : 'active')}
                      className={userItem.accountStatus === 'active' ? "text-danger" : "text-success"}
                    >
                      <i className={`bi ${userItem.accountStatus === 'active' ? "bi-x-circle" : "bi-check-circle"} me-2`}></i>
                      {userItem.accountStatus === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  // Render staff table
  const renderStaffTable = () => (
    <Table hover responsive className="align-middle table-striped">
      <thead className="bg-light">
        <tr>
          <th className="text-center fw-bold" style={{ width: '50%' }}>Nhân viên</th>
          <th className="text-center fw-bold" style={{ width: '20%' }}>Vai trò</th>
          <th className="text-center fw-bold" style={{ width: '15%' }}>Trạng thái</th>
          <th className="text-center fw-bold" style={{ width: '15%' }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {loadingStaff ? (
          <tr>
            <td colSpan="4" className="text-center">
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </td>
          </tr>
        ) : currentStaff.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center">
              Không có dữ liệu nhân viên
            </td>
          </tr>
        ) : (
          currentStaff.map((staffItem, index) => (
            <tr key={staffItem.id || index}>
              <td className="text-start">
                <div className="d-flex align-items-center">
                  <div className="me-3 flex-shrink-0">
                    {staffItem.avatar ? (
                      <img
                        src={staffItem.avatar}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staffItem.fullname || staffItem.name || 'S')}&background=17a2b8&color=fff&size=40`;
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', fontSize: '18px' }}
                      >
                        {staffItem.fullname?.charAt(0)?.toUpperCase() || staffItem.name?.charAt(0)?.toUpperCase() || 'S'}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <div className="fw-medium text-truncate">{staffItem.fullname || staffItem.name || 'Chưa cập nhật tên'}</div>
                    <small className="text-muted text-truncate d-block">{staffItem.email || 'N/A'}</small>
                    {staffItem.phone && (
                      <small className="text-muted text-truncate d-block">{staffItem.phone}</small>
                    )}
                  </div>
                </div>
              </td>
              <td className="text-center">{getRoleBadge(staffItem.role?.name)}</td>
              <td className="text-center">{getStatusBadge(staffItem.accountStatus)}</td>
              <td className="text-center">
                <Dropdown className="position-static" drop={index === currentStaff.length - 1 ? 'up' : 'down'} align="end">
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <i className="bi bi-three-dots"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleShowModal('view', staffItem)}>
                      <i className="bi bi-eye me-2"></i>Xem chi tiết
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleShowModal('edit', staffItem)}>
                      <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => handleStatusChange(staffItem.id, staffItem.accountStatus === 'active' ? 'inactive' : 'active')}
                      className={staffItem.accountStatus === 'active' ? "text-danger" : "text-success"}
                    >
                      <i className={`bi ${staffItem.accountStatus === 'active' ? "bi-x-circle" : "bi-check-circle"} me-2`}></i>
                      {staffItem.accountStatus === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  // Render managers table
  const renderManagersTable = () => (
    <Table hover responsive className="align-middle table-striped">
      <thead className="bg-light">
        <tr>
          <th className="text-center fw-bold" style={{ width: '50%' }}>Quản lý</th>
          <th className="text-center fw-bold" style={{ width: '20%' }}>Vai trò</th>
          <th className="text-center fw-bold" style={{ width: '15%' }}>Trạng thái</th>
          <th className="text-center fw-bold" style={{ width: '15%' }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {loadingManagers ? (
          <tr>
            <td colSpan="4" className="text-center">
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </td>
          </tr>
        ) : currentManagers.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center">
              Không có dữ liệu quản lý
            </td>
          </tr>
        ) : (
          currentManagers.map((managerItem, index) => (
            <tr key={managerItem.id || index}>
              <td className="text-start">
                <div className="d-flex align-items-center">
                  <div className="me-3 flex-shrink-0">
                    {managerItem.avatar ? (
                      <img
                        src={managerItem.avatar}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(managerItem.fullname || managerItem.name || 'M')}&background=ffc107&color=fff&size=40`;
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', fontSize: '18px' }}
                      >
                        {managerItem.fullname?.charAt(0)?.toUpperCase() || managerItem.name?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1 min-width-0">
                    <div className="fw-medium text-truncate">{managerItem.fullname || managerItem.name || 'Chưa cập nhật tên'}</div>
                    <small className="text-muted text-truncate d-block">{managerItem.email || 'N/A'}</small>
                    {managerItem.phone && (
                      <small className="text-muted text-truncate d-block">{managerItem.phone}</small>
                    )}
                  </div>
                </div>
              </td>
              <td className="text-center">{getRoleBadge(managerItem.role?.name)}</td>
              <td className="text-center">{getStatusBadge(managerItem.accountStatus)}</td>
              <td className="text-center">
                <Dropdown className="position-static" drop={index === currentManagers.length - 1 ? 'up' : 'down'} align="end">
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <i className="bi bi-three-dots"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleShowModal('view', managerItem)}>
                      <i className="bi bi-eye me-2"></i>Xem chi tiết
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleShowModal('edit', managerItem)}>
                      <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() => handleStatusChange(managerItem.id, managerItem.accountStatus === 'active' ? 'inactive' : 'active')}
                      className={managerItem.accountStatus === 'active' ? "text-danger" : "text-success"}
                    >
                      <i className={`bi ${managerItem.accountStatus === 'active' ? "bi-x-circle" : "bi-check-circle"} me-2`}></i>
                      {managerItem.accountStatus === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Quản lý người dùng</h5>
          <div>
            <Button variant="primary" size="sm" onClick={() => handleShowModal('create')}>
              <i className="bi bi-person-plus me-1"></i> Thêm người dùng
            </Button>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {/* Dashboard Overview */}
        <Row className="mb-4 g-3">
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                  <i className="bi bi-people fs-4 text-primary"></i>
                </div>
                <div>
                  <h6 className="mb-0">Tổng tài khoản</h6>
                  <h3 className="mb-0">{Array.isArray(allUsers) ? allUsers.length : 0}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                  <i className="bi bi-person-check fs-4 text-success"></i>
                </div>
                <div>
                  <h6 className="mb-0">Khách hàng</h6>
                  <h3 className="mb-0">
                    {Array.isArray(allUsers) 
                      ? allUsers.filter(u => u.role?.name === 'customer').length 
                      : 0}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                  <i className="bi bi-person-badge fs-4 text-info"></i>
                </div>
                <div>
                  <h6 className="mb-0">Nhân viên</h6>
                  <h3 className="mb-0">
                    {Array.isArray(allUsers) 
                      ? allUsers.filter(u => u.role?.name === 'staff').length 
                      : 0}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                  <i className="bi bi-person-workspace fs-4 text-warning"></i>
                </div>
                <div>
                  <h6 className="mb-0">Quản lý</h6>
                  <h3 className="mb-0">
                    {Array.isArray(allUsers) 
                      ? allUsers.filter(u => u.role?.name === 'manager').length 
                      : 0}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Tabs activeKey={activeTab} onSelect={(k) => {
          setActiveTab(k);
          // Reset pagination when switching tabs
          if (k === 'users') {
            setCurrentPage(1);
          } else if (k === 'staff') {
            setCurrentStaffPage(1);
          } else if (k === 'managers') {
            setCurrentManagerPage(1);
          }
        }} className="mb-4">
          <Tab eventKey="users" title="Khách hàng">
            {/* Users Tab Content */}
            <div className="mb-3 d-flex flex-column flex-md-row gap-2 justify-content-between">
              <div className="d-flex gap-2 flex-grow-1">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="d-flex gap-2">
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-auto"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active" className="text-success">✓ Hoạt động</option>
                  <option value="inactive" className="text-danger">✗ Không hoạt động</option>
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRole('all');
                    setFilterStatus('all');
                    setCurrentPage(1);
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Xóa bộ lọc
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    if (onRefreshUsers) {
                      onRefreshUsers();
                    }
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Làm mới
                </Button>
              </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {renderUsersTable()}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                  <Pagination.Prev
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show current page, 2 pages before and after when possible
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === currentPage}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    } else if (
                      (pageNumber === currentPage - 3 && currentPage > 3) ||
                      (pageNumber === currentPage + 3 && currentPage < totalPages - 2)
                    ) {
                      return <Pagination.Ellipsis key={pageNumber} />;
                    }
                    return null;
                  })}
                  
                  <Pagination.Next
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </Tab>

          <Tab eventKey="staff" title="Nhân viên">
            {/* Staff Tab Content */}
            <div className="mb-3 d-flex flex-column flex-md-row gap-2 justify-content-between">
              <div className="d-flex gap-2 flex-grow-1">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="d-flex gap-2">
                <Form.Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-auto"
                >
                  <option value="all">Tất cả phòng ban</option>
                  <option value="lab">Phòng xét nghiệm</option>
                  <option value="reception">Lễ tân</option>
                  <option value="admin">Quản trị</option>
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDepartment('all');
                    setCurrentStaffPage(1);
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Xóa bộ lọc
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    // Fetch staff data again
                    setStaffList([]);
                    if (onRefreshUsers) {
                      onRefreshUsers();
                    }
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Làm mới
                </Button>
              </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {renderStaffTable()}

            {/* Pagination for staff */}
            {totalStaffPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.First onClick={() => setCurrentStaffPage(1)} disabled={currentStaffPage === 1} />
                  <Pagination.Prev
                    onClick={() => setCurrentStaffPage(currentStaffPage - 1)}
                    disabled={currentStaffPage === 1}
                  />
                  
                  {[...Array(totalStaffPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show current page, 2 pages before and after when possible
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalStaffPages ||
                      (pageNumber >= currentStaffPage - 2 && pageNumber <= currentStaffPage + 2)
                    ) {
                      return (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === currentStaffPage}
                          onClick={() => setCurrentStaffPage(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    } else if (
                      (pageNumber === currentStaffPage - 3 && currentStaffPage > 3) ||
                      (pageNumber === currentStaffPage + 3 && currentStaffPage < totalStaffPages - 2)
                    ) {
                      return <Pagination.Ellipsis key={pageNumber} />;
                    }
                    return null;
                  })}
                  
                  <Pagination.Next
                    onClick={() => setCurrentStaffPage(currentStaffPage + 1)}
                    disabled={currentStaffPage === totalStaffPages}
                  />
                  <Pagination.Last
                    onClick={() => setCurrentStaffPage(totalStaffPages)}
                    disabled={currentStaffPage === totalStaffPages}
                  />
                </Pagination>
              </div>
            )}
          </Tab>

          <Tab eventKey="managers" title="Quản lý">
            {/* Managers Tab Content */}
            <div className="mb-3 d-flex flex-column flex-md-row gap-2 justify-content-between">
              <div className="d-flex gap-2 flex-grow-1">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="d-flex gap-2">
                <Form.Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-auto"
                >
                  <option value="all">Tất cả phòng ban</option>
                  <option value="lab">Phòng xét nghiệm</option>
                  <option value="reception">Lễ tân</option>
                  <option value="admin">Quản trị</option>
                </Form.Select>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDepartment('all');
                    setCurrentManagerPage(1);
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Xóa bộ lọc
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    // Fetch managers data again
                    setManagerList([]);
                    if (onRefreshUsers) {
                      onRefreshUsers();
                    }
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Làm mới
                </Button>
              </div>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {renderManagersTable()}

            {/* Pagination for managers */}
            {totalManagerPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.First onClick={() => setCurrentManagerPage(1)} disabled={currentManagerPage === 1} />
                  <Pagination.Prev
                    onClick={() => setCurrentManagerPage(currentManagerPage - 1)}
                    disabled={currentManagerPage === 1}
                  />
                  
                  {[...Array(totalManagerPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show current page, 2 pages before and after when possible
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalManagerPages ||
                      (pageNumber >= currentManagerPage - 2 && pageNumber <= currentManagerPage + 2)
                    ) {
                      return (
                        <Pagination.Item
                          key={pageNumber}
                          active={pageNumber === currentManagerPage}
                          onClick={() => setCurrentManagerPage(pageNumber)}
                        >
                          {pageNumber}
                        </Pagination.Item>
                      );
                    } else if (
                      (pageNumber === currentManagerPage - 3 && currentManagerPage > 3) ||
                      (pageNumber === currentManagerPage + 3 && currentManagerPage < totalManagerPages - 2)
                    ) {
                      return <Pagination.Ellipsis key={pageNumber} />;
                    }
                    return null;
                  })}
                  
                  <Pagination.Next
                    onClick={() => setCurrentManagerPage(currentManagerPage + 1)}
                    disabled={currentManagerPage === totalManagerPages}
                  />
                  <Pagination.Last
                    onClick={() => setCurrentManagerPage(totalManagerPages)}
                    disabled={currentManagerPage === totalManagerPages}
                  />
                </Pagination>
              </div>
            )}
          </Tab>
        </Tabs>
      </Card.Body>

      {/* Create/Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white border-0">
          <Modal.Title>
            {modalType === 'create' ? 
              <><i className="bi bi-person-plus-fill me-2"></i>Tạo người dùng mới</> :
              modalType === 'edit' ? 
              <><i className="bi bi-pencil-square me-2"></i>Chỉnh sửa thông tin</> : 
              <><i className="bi bi-person-lines-fill me-2"></i>Thông tin chi tiết</>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 py-4">
          {loadingUserDetail ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3 text-muted">Đang tải thông tin chi tiết...</p>
            </div>
          ) : modalType === 'view' ? (
            <div>
              {/* View mode content */}
              {editingUser && (
                <div className="user-details">
                  <Row className="mb-4 align-items-center">
                    <Col md={3} className="text-center">
                      {editingUser.avatar ? (
                        <img
                          src={editingUser.avatar}
                          alt="Avatar"
                          className="rounded-circle img-thumbnail shadow"
                          style={{ width: '140px', height: '140px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div 
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto shadow"
                          style={{ width: '140px', height: '140px', fontSize: '3rem' }}
                        >
                          {editingUser.fullname?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </Col>
                    <Col md={9}>
                      <h3 className="fw-bold text-primary mb-2">{editingUser.fullname || 'N/A'}</h3>
                      <div className="mb-2">
                        {getRoleBadge(editingUser.role?.name)} {getStatusBadge(editingUser.accountStatus)}
                      </div>
                      <p className="text-muted mb-2 d-flex align-items-center">
                        <i className="bi bi-envelope-fill me-2 text-primary"></i>
                        <span>{editingUser.email || 'N/A'}</span>
                      </p>
                      <p className="text-muted d-flex align-items-center">
                        <i className="bi bi-telephone-fill me-2 text-primary"></i>
                        <span>{editingUser.phone || 'N/A'}</span>
                      </p>
                    </Col>
                  </Row>

                  <hr className="my-4" />

                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                          <h5 className="card-title mb-0 text-primary">
                            <i className="bi bi-person-lines-fill me-2"></i>
                            Thông tin cá nhân
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <div className="d-flex">
                              <div style={{ width: '120px' }} className="text-muted">Giới tính:</div>
                              <div className="fw-medium">
                                {editingUser.gender === 'male' ? 
                                  <><i className="bi bi-gender-male text-primary me-1"></i> Nam</> : 
                                 editingUser.gender === 'female' ? 
                                  <><i className="bi bi-gender-female text-danger me-1"></i> Nữ</> : 
                                  'Không xác định'}
                              </div>
                            </div>
                          </div>
                          <div className="mb-0">
                            <div className="d-flex">
                              <div style={{ width: '120px' }} className="text-muted">Địa chỉ:</div>
                              <div className="fw-medium">
                                {editingUser.address || 
                                  <span className="fst-italic text-muted">Chưa cập nhật</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                          <h5 className="card-title mb-0 text-primary">
                            <i className="bi bi-shield-lock-fill me-2"></i>
                            Thông tin tài khoản
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <div className="d-flex">
                              <div style={{ width: '180px' }} className="text-muted">Phương thức đăng nhập:</div>
                              <div className="fw-medium">
                                {editingUser.authProvider === 'google' ? 
                                  <><i className="bi bi-google text-danger me-1"></i> Google</> : 
                                 editingUser.authProvider === 'facebook' ? 
                                  <><i className="bi bi-facebook text-primary me-1"></i> Facebook</> : 
                                  <><i className="bi bi-envelope-fill text-success me-1"></i> Email/Password</>}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex">
                              <div style={{ width: '180px' }} className="text-muted">Đăng nhập cuối:</div>
                              <div className="fw-medium">
                                {formatLastLogin(editingUser.lastLogin)}
                              </div>
                            </div>
                          </div>
                          <div className="mb-0">
                            <div className="d-flex">
                              <div style={{ width: '180px' }} className="text-muted">Ngày tạo:</div>
                              <div className="fw-medium">
                                {editingUser.createdAt ? 
                                  new Date(editingUser.createdAt).toLocaleDateString('vi-VN') : 
                                  'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {editingUser.role?.name === 'customer' && (
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white py-3">
                        <h5 className="card-title mb-0 text-primary">
                          <i className="bi bi-graph-up me-2"></i>
                          Thống kê hoạt động
                        </h5>
                      </div>
                      <div className="card-body">
                        <Row>
                          <Col md={6}>
                            <div className="d-flex align-items-center mb-3">
                              <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                                <i className="bi bi-clipboard2-pulse fs-4 text-info"></i>
                              </div>
                              <div>
                                <h6 className="mb-0 text-muted">Tổng xét nghiệm</h6>
                                <h3 className="mb-0">{getUserTestCount(editingUser)}</h3>
                              </div>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="d-flex align-items-center mb-3">
                              <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                                <i className="bi bi-cash-stack fs-4 text-success"></i>
                              </div>
                              <div>
                                <h6 className="mb-0 text-muted">Tổng chi tiêu</h6>
                                <h3 className="mb-0">{formatCurrency(getUserTotalPayment(editingUser))} VND</h3>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Form>
              {modalType === 'edit' && (
                <Alert variant="info" className="mb-4">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Lưu ý:</strong> Email và vai trò không thể thay đổi. Để thay đổi vai trò, vui lòng liên hệ quản trị viên.
                </Alert>
              )}
              

              
              {/* Form fields */}
              {modalType === 'create' ? (
                // Form đơn giản cho create mode
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <i className="bi bi-person-fill text-primary me-2"></i>
                      Họ và tên <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      required
                      className="border-0 shadow-sm"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <i className="bi bi-envelope-fill text-primary me-2"></i>
                      Email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="Email sẽ được tự động tạo từ họ tên"
                      className="border-0 shadow-sm"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <i className="bi bi-key-fill text-primary me-2"></i>
                      Mật khẩu <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="border-0 shadow-sm"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <i className="bi bi-person-badge-fill text-primary me-2"></i>
                      Vai trò <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      disabled={loadingRoles}
                      className="border-0 shadow-sm"
                    >
                      <option value="">Chọn vai trò</option>
                      {roleOptions
                        .filter(role => ['staff', 'manager'].includes(role.name))
                        .map((role) => (
                          <option key={role.id} value={role.name}>
                            {role.name === 'staff' ? 'Nhân viên' : 
                             role.name === 'manager' ? 'Quản lý' : role.name}
                          </option>
                        ))}
                    </Form.Select>
                    {loadingRoles && <div className="text-center mt-2"><span className="spinner-border spinner-border-sm"></span> Đang tải...</div>}
                  </Form.Group>
                </div>
              ) : (
                // Form đầy đủ cho edit mode
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <i className="bi bi-person-fill text-primary me-2"></i>
                        Họ và tên <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        required
                        className="border-0 shadow-sm"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <i className="bi bi-envelope-fill text-primary me-2"></i>
                        Email {modalType === 'create' && <span className="text-danger">*</span>}
                      </Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required={modalType === 'create'}
                        readOnly={modalType === 'edit'}
                        placeholder={modalType === 'create' ? 'Email sẽ được tự động tạo từ họ tên' : ''}
                        className={`border-0 shadow-sm ${modalType === 'edit' ? 'bg-light' : ''}`}
                      />
                      {modalType === 'edit' && (
                        <Form.Text className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Email không thể thay đổi sau khi tạo tài khoản
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                            )}

              {/* Chỉ hiển thị phone và gender trong edit mode */}
              {modalType === 'edit' && (
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <i className="bi bi-telephone-fill text-primary me-2"></i>
                        Số điện thoại
                      </Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border-0 shadow-sm"
                        />
                    </Form.Group>
                      </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium">
                        <i className="bi bi-gender-ambiguous text-primary me-2"></i>
                        Giới tính
                      </Form.Label>
                        <Form.Select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="border-0 shadow-sm"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </Form.Select>
                    </Form.Group>
                      </Col>
                    </Row>
              )}
              {/* Chỉ hiển thị địa chỉ trong edit mode */}
              {modalType === 'edit' && (
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white py-3">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                      Thông tin địa chỉ
                    </h5>
                  </div>
                  <div className="card-body">
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Địa chỉ chi tiết</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.addressDetail}
                            onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                            placeholder="Số nhà, tên đường..."
                            className="border-0 shadow-sm"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Tỉnh/Thành phố</Form.Label>
                        <Form.Select
                          value={formData.city}
                            onChange={(e) => {
                              setFormData({ 
                                ...formData, 
                              city: e.target.value,
                              district: '',
                              ward: ''
                              });
                            }}
                            className="border-0 shadow-sm"
                          >
                            <option value="">Chọn Tỉnh/Thành phố</option>
                            {getProvinces().map(province => (
                              <option key={province.code} value={province.code}>
                                {province.name}
                              </option>
                          ))}
                        </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Quận/Huyện</Form.Label>
                        <Form.Select
                          value={formData.district}
                            onChange={(e) => {
                              setFormData({ 
                                ...formData, 
                              district: e.target.value,
                              ward: ''
                              });
                          }}
                          disabled={!formData.city}
                            className="border-0 shadow-sm"
                          >
                            <option value="">Chọn Quận/Huyện</option>
                            {formData.city && getDistricts()
                              .filter(d => d.province_code === formData.city)
                              .map(district => (
                                <option key={district.code} value={district.code}>
                                  {district.name}
                                </option>
                          ))}
                        </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-medium">Phường/Xã</Form.Label>
                        <Form.Select
                          value={formData.ward}
                            onChange={(e) => {
                              setFormData({ 
                                ...formData, 
                                ward: e.target.value 
                              });
                            }}
                          disabled={!formData.district}
                            className="border-0 shadow-sm"
                          >
                            <option value="">Chọn Phường/Xã</option>
                            {formData.district && getWards()
                              .filter(w => w.district_code === formData.district)
                              .map(ward => (
                                <option key={ward.code} value={ward.code}>
                                  {ward.name}
                                </option>
                          ))}
                        </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-0">
                          <Form.Label className="fw-medium">Địa chỉ đầy đủ</Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.address}
                            readOnly
                            className="border-0 shadow-sm bg-light"
                        />
                          <Form.Text className="text-muted">
                            <i className="bi bi-info-circle me-1"></i>
                            Địa chỉ đầy đủ được tự động tạo từ các thông tin bên trên
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </div>
              )}



              {error && (
                <Alert variant="danger" className="mt-3 d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </Alert>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light border-0">
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="px-4">
            <i className="bi bi-x-circle me-2"></i>Đóng
          </Button>
          {modalType !== 'view' && (
            <Button variant="primary" onClick={handleSaveUser} className="px-4">
              {modalType === 'create' ? (
                <><i className="bi bi-plus-circle me-2"></i>Tạo mới</>
              ) : (
                <><i className="bi bi-check-circle me-2"></i>Lưu thay đổi</>
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      
      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
          text="white"
        >
          <Toast.Header closeButton>
            <strong className="me-auto">Thông báo</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Card>
  );
};

export default UserManagement;