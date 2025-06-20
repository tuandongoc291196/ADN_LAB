const API_BASE_URL = 'https://app-bggwpxm32a-uc.a.run.app';

// Lấy tất cả dịch vụ và phương thức
export const getAllServicesAndMethods = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services&methods`, {
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

// Lấy chi tiết một dịch vụ và phương thức
export const getServiceAndMethodsById = async (serviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/services&methods`, {
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