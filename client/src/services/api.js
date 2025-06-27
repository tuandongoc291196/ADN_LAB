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

// Lấy tất cả service categories
export const getServiceCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
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
    throw new Error('Failed to fetch service categories: ' + error.message);
  }
};

// Tạo mới booking
export const createBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to create booking: ' + error.message);
  }
};