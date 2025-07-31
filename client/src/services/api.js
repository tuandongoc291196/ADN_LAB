const API_BASE_URL = 'https://app-bggwpxm32a-uc.a.run.app';

// Lấy tất cả dịch vụ
export const getAllServices = async () => {
  try {
    console.log('Calling getAllServices API...');
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('getAllServices response status:', response.status);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('getAllServices response data:', data);

    return data.data;
  } catch (error) {
    console.error('getAllServices error:', error);
    throw new Error('Failed to fetch services: ' + error.message);
  }
};

// Lấy chi tiết một dịch vụ
export const getServiceById = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch service details: ' + error.message);
  }
};

// Lấy các phương thức của một dịch vụ
export const getMethodsByServiceId = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/method/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // API trả về serviceMethods array, cần extract method data
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(item => item.method).filter(Boolean);
    }

    return [];
  } catch (error) {
    throw new Error('Failed to fetch methods for service: ' + error.message);
  }
};

// Lấy tất cả các phương thức
export const getAllMethods = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/methods`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch all methods: ' + error.message);
  }
};

// Lấy dịch vụ theo phương thức
export const getServicesByMethodId = async (methodId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/service/methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ methodId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // API trả về serviceMethods array, cần extract service data
    if (data.data && Array.isArray(data.data)) {
      return data.data.map(item => item.service).filter(Boolean);
    }

    return [];
  } catch (error) {
    throw new Error('Failed to fetch services by method: ' + error.message);
  }
};

// Lấy tất cả user
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // Tùy response BE, có thể là data.data.users hoặc data.data
    return data.data?.users || data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch users: ' + error.message);
  }
};

// Lấy tất cả role
export const getAllRoles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data?.roles || data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch roles: ' + error.message);
  }
};

// Lấy danh sách nhân viên theo role
export const getStaffListByRole = async (roleIds) => {
  try {
    const results = await Promise.all(
      roleIds.map(async (roleId) => {
        const response = await fetch(`${API_BASE_URL}/users/role`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roleId: roleId.toString() }), // ép thành chuỗi
        });

        if (!response.ok) {
          console.error(`Lỗi khi fetch roleId ${roleId}:`, response.status);
          return []; // nếu lỗi, trả mảng rỗng
        }

        const data = await response.json();
        return data.data || [];
      })
    );

    return results.flat();
  } catch (error) {
    throw new Error('Failed to fetch staff by multiple roles: ' + error.message);
  }
};

// Lấy dịch vụ theo category
export const getServicesByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/service/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch services by category: ' + error.message);
  }
};


// Tạo mới booking
export const createBooking = async (bookingData) => {
  try {
    console.log('Sending booking data:', bookingData);

    const response = await fetch(`${API_BASE_URL}/bookings/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    console.log('Booking response status:', response.status);

    const data = await response.json();
    console.log('Booking response data:', data);

    // Kiểm tra cả response status và response data
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message || 'Network response was not ok'}`);
    }

    // Kiểm tra nếu response có error message
    if (data.error || data.message?.toLowerCase().includes('error')) {
      throw new Error(data.message || data.error || 'Booking creation failed');
    }

    // Kiểm tra nếu không có data hoặc booking_insert
    if (!data.data && !data.booking_insert && !data.id) {
      throw new Error('No booking data returned from server');
    }

    // Return data với priority: data.data > data > data.booking_insert
    return data.data || data;
  } catch (error) {
    console.error('createBooking error:', error);
    throw new Error('Failed to create booking: ' + error.message);
  }
};

// Lấy user theo id
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // Tùy response BE, có thể là data.data.user hoặc data.data
    return data.data?.user || data.data || null;
  } catch (error) {
    throw new Error('Failed to fetch user by id: ' + error.message);
  }
};

// Cập nhật thông tin user theo id
export const updateUserById = async (userId, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...updateData }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // Tùy response BE, có thể là data.data.user hoặc data.data
    return data.data?.user || data.data || null;
  } catch (error) {
    throw new Error('Failed to update user by id: ' + error.message);
  }
};

// Cập nhật trạng thái tài khoản user
export const updateUserAccountStatus = async (userId, status) => {
  try {
    console.log(`🌐 API: updateUserAccountStatus called with userId: ${userId}, status: ${status}`);

    const requestBody = { userId, status };
    console.log(`📤 Request body:`, requestBody);

    const response = await fetch(`${API_BASE_URL}/users/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`❌ API Error response:`, errorData);
      throw new Error(errorData.message || 'Failed to update user account status');
    }

    const data = await response.json();
    console.log(`✅ API Success response:`, data);
    return data.data || data;
  } catch (error) {
    console.error(`❌ API Error in updateUserAccountStatus:`, error);
    throw new Error('Failed to update user account status: ' + error.message);
  }
};
// Thêm mới service
export const addService = async (serviceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add service');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to add service: ' + error.message);
  }
};

// Cập nhật service
export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceId,
        ...serviceData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update service');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to update service: ' + error.message);
  }
};

// Xóa service
export const deleteService = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete service');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to delete service: ' + error.message);
  }
};

// Thêm method cho service (sử dụng function từ backend)
export const addMethodToService = async (serviceId, methodId) => {
  try {
    // Gọi trực tiếp function addServiceMethod từ backend
    const response = await fetch(`${API_BASE_URL}/method/services/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceId, methodId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add method to service');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to add method to service: ' + error.message);
  }
};

// Xóa method khỏi service (sử dụng function từ backend)
export const removeMethodFromService = async (serviceId, methodId) => {
  try {
    // Gọi trực tiếp function deleteOneMethodService từ backend
    const response = await fetch(`${API_BASE_URL}/method/services/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serviceId, methodId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove method from service');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to remove method from service: ' + error.message);
  }
};

// Cập nhật trạng thái featured của service
export const updateServiceFeatured = async (serviceId, featured) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceId,
        featured
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update service featured status');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to update service featured status: ' + error.message);
  }
};

// Thêm mới payment
export const createPayment = async (paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to create payment: ' + error.message);
  }
};

// Lấy booking theo bookingId (sử dụng getOneBooking)
export const getBookingById = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    // Trả về trực tiếp object booking chi tiết
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch booking by id: ' + error.message);
  }
};

// Thêm mới user
export const addUser = async ({ email, password, name, roleId }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, roleId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add user');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to add user: ' + error.message);
  }
};

// Lấy thông tin chi tiết staff theo id
export const getStaffById = async (staffId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/staffs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to fetch staff by id: ' + error.message);
  }
};

// Cập nhật thông tin staff
export const updateStaff = async (staffData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/staffs`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffData),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to update staff: ' + error.message);
  }
};

// Lấy thông tin thanh toán theo bookingId
export const getPaymentByBookingId = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to fetch payment by bookingId: ' + error.message);
  }
};

// Lấy danh sách booking theo userId
export const getBookingByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    // API mới trả về bookings array trực tiếp
    return data.data?.bookings || data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch bookings by user ID: ' + error.message);
  }
};

// Lấy danh sách booking theo staffId
export const getBookingByStaffId = async (staffId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ staffId }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // API trả về bookings array trực tiếp
    return data.data?.bookings || data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch bookings by staff ID: ' + error.message);
  }
};

// ==================== BLOG API FUNCTIONS ====================

// Lấy tất cả bài blog
export const getAllBlogs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Lỗi ${response.status}: ${errorData.message || 'Không thể lấy danh sách bài blog'}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Lỗi khi lấy tất cả bài blog:', error);
    throw error;
  }
};

// Lấy chi tiết một bài blog bằng ID
export const getBlogById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blogId: id }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Lỗi ${response.status}: ${errorData.message || 'Không thể lấy chi tiết bài blog'}`);
    }

    const data = await response.json();
    return data.data?.blog || data.data || null;
  } catch (error) {
    console.error(`Lỗi khi lấy bài blog với ID ${id}:`, error);
    throw error;
  }
};

export const addBlog = async (blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }
    return result;
  } catch (error) {
    console.error('Lỗi khi tạo bài viết mới:', error);
    throw error;
  }
};

export const updateBlog = async (blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }
    return result;
  } catch (error) {
    console.error(`Lỗi khi cập nhật bài viết ${blogData.blogId}:`, error);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blogId: id }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete blog');
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Error in deleteBlog:', error);
    throw error;
  }
};

// Cập nhật trạng thái blog
export const updateBlogStatus = async (blogId, status) => {
  try {
    return await updateBlog(blogId, { status });
  } catch (error) {
    throw new Error('Failed to update blog status: ' + error.message);
  }
};

// Toggle featured status của blog
export const toggleBlogFeatured = async (blogId, featured) => {
  try {
    return await updateBlog(blogId, { featured });
  } catch (error) {
    throw new Error('Failed to toggle blog featured: ' + error.message);
  }
};

// Lấy lịch sử booking theo userId hoặc staffId
export const getBookingHistory = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // API có thể trả về data.data.history hoặc data.data
    return data.data?.history || data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch booking history: ' + error.message);
  }
};

// Thêm mới lịch sử booking
export const addBookingHistory = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/booking/history/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to add booking history: ' + error.message);
  }
};

// Lấy danh sách mẫu theo bookingId
export const getSamplesByBookingId = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/samples/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // API có thể trả về data.data.samples hoặc data.data
    return data.data?.samples || data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch samples by bookingId: ' + error.message);
  }
};

// Cập nhật chất lượng mẫu
export const updateSample = async ({ sampleId, sampleQuality, sampleConcentration, sampleType, notes }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/samples`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sampleId, sampleQuality, sampleConcentration, sampleType, notes }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update sample quality');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to update sample quality: ' + error.message);
  }
};

// Lấy tất cả payment
export const getAllPayments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('getAllPayments error:', error);
    throw new Error('Failed to fetch payments: ' + error.message);
  }
};

// Lấy tất cả booking
export const getAllBookings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('getAllBookings error:', error);
    throw new Error('Failed to fetch bookings: ' + error.message);
  }
};

// Lấy booking theo userId
export const getBookingsByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('getBookingsByUserId error:', error);
    throw new Error('Failed to fetch bookings by user: ' + error.message);
  }
};

// Lấy kết quả xét nghiệm theo bookingId
export const getTestResultByBookingId = async (bookingId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/testresult/booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to fetch test result by bookingId: ' + error.message);
  }
};

// Cập nhật kết quả xét nghiệm
export const updateTestResult = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/testresult`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update test result');
    }
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to update test result: ' + error.message);
  }
};

export const getDashboardReports = async (filters = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('getDashboardReports error:', error);
    throw new Error('Failed to fetch dashboard reports: ' + error.message);
  }
};

export const getOverviewReports = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/overview`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('getOverviewReports error:', error);
    throw new Error('Failed to fetch overview reports: ' + error.message);
  }
};

// Lấy tất cả kết quả xét nghiệm của user theo userId
export const getTestResultByUserId = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/testresult/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    throw new Error('Failed to fetch test results by userId: ' + error.message);
  }
};
