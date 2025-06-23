const API_BASE_URL = 'https://app-bggwpxm32a-uc.a.run.app';

// Lấy tất cả dịch vụ
export const getAllServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
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
      const response = await fetch(`${API_BASE_URL}/services/methods`, {
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
export const getStaffListByRole = async (roleNameOrId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roleId: '1' }), // hoặc { roleId: ... } tùy BE
    });
    console.log(response);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch staff by role: ' + error.message);
  }
}; 