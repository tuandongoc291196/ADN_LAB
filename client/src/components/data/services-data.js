// client/src/data/services-data.js

// Mapping cho methods từ BE để thêm icon và color
export const METHOD_MAPPING = {
  '0': { // Lấy mẫu tại nhà
    icon: 'bi-house',
    color: 'success',
    process: ['Đặt hẹn', 'Nhận kit', 'Thu mẫu', 'Gửi lại', 'Nhận kết quả'],
    note: 'Chỉ áp dụng cho xét nghiệm ADN dân sự',
    allowedFor: ['civil']
  },
  '1': { // Nhân viên tới nhà lấy mẫu
    icon: 'bi-truck',
    color: 'warning',
    process: ['Đặt hẹn', 'Nhân viên đến', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả'],
    note: 'Phí dịch vụ nhân viên: 400,000 VNĐ (trong nội thành)',
    allowedFor: ['civil', 'administrative']
  },
  '2': { // Lấy mẫu tại lab
    icon: 'bi-hospital',
    color: 'primary',
    process: ['Đặt hẹn', 'Đến cơ sở', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả'],
    note: 'Đảm bảo tính chính xác và có giá trị pháp lý',
    allowedFor: ['civil', 'administrative']
  }
};

// Helper function để enrich method data với icon và color
export const enrichMethodData = (methods) => {
  if (!methods || !Array.isArray(methods)) return [];
  
  return methods.map(method => {
    const mapping = METHOD_MAPPING[method.id] || {};
    return {
      ...method,
      icon: mapping.icon || 'bi-gear',
      color: mapping.color || 'secondary',
      process: mapping.process || [],
      note: mapping.note || '',
      allowedFor: mapping.allowedFor || ['civil', 'administrative']
    };
  });
};

// Helper functions - Sử dụng dữ liệu từ BE thay vì mock data
export const getServiceById = (services, id) => {
  if (!services || !Array.isArray(services)) return null;
  return services.find(service => service.id === id);
};

export const getServicesByType = (services, type) => {
  if (!services || !Array.isArray(services)) return [];
  
  // Lọc dịch vụ active trước
  const activeServices = services.filter(service => service.isActive !== false);
  
  if (type === 'administrative') {
    return activeServices.filter(service => service.category?.hasLegalValue === true);
  } else if (type === 'civil') {
    return activeServices.filter(service => service.category?.hasLegalValue === false);
  }
  
  return activeServices; // Trả về tất cả dịch vụ active nếu không có type
};

export const getAvailableMethodsForService = (serviceId, methods) => {
  if (!methods || !Array.isArray(methods)) return [];
  
  // Logic này có thể cần điều chỉnh tùy theo cấu trúc dữ liệu từ BE
  // Hiện tại trả về tất cả methods có sẵn
  return methods;
};

export const isMethodAllowedForService = (serviceId, methodId, serviceMethods) => {
  if (!serviceMethods || !Array.isArray(serviceMethods)) return false;
  
  return serviceMethods.some(sm => 
    sm.serviceId === serviceId && sm.methodId === methodId
  );
};

// Helper functions cho AppointmentBooking
export const canServiceUseSelfSample = (service) => {
  if (!service) return false;
  
  // Dịch vụ hành chính không thể dùng self-sample
  if (service.category?.hasLegalValue === true) {
    return false;
  }
  
  // ADN trước sinh không thể dùng self-sample
  if (service.id === 'civil-prenatal') {
    return false;
  }
  
  return true;
};

export const isAdministrativeService = (service) => {
  return service?.category?.hasLegalValue === true;
};

// Helper function để check method restriction
export const isMethodDisabled = (methodId, service) => {
  if (!service) return true;
  
  // Method ID "0" là lấy mẫu tại nhà
  if (methodId === '0') {
    // Dịch vụ hành chính không thể dùng self-sample
    if (service.category?.hasLegalValue === true) {
      return true;
    }
    
    // ADN trước sinh không thể dùng self-sample
    if (service.id === 'civil-prenatal') {
      return true;
    }
  }
  
  return false;
};

// Helper function để get method restriction reason
export const getMethodRestrictionReason = (methodId, service) => {
  if (!service) return 'Không có dịch vụ được chọn';
  
  // Method ID "0" là lấy mẫu tại nhà
  if (methodId === '0') {
    if (service.category?.hasLegalValue === true) {
      return 'Dịch vụ hành chính bắt buộc phải có giám sát khi lấy mẫu';
    }
    
    if (service.id === 'civil-prenatal') {
      return 'ADN trước sinh cần chuyên gia y tế thực hiện';
    }
  }
  
  return 'Phương thức này không khả dụng cho dịch vụ này';
};

// Helper function để lấy icon cho service
export const getServiceIcon = (service) => {
  if (!service) return 'bi-dna';
  
  // Nếu service có icon từ BE, sử dụng
  if (service.icon) {
    return service.icon;
  }
  
  // Mapping icon theo service ID hoặc title
  const serviceId = service.id?.toLowerCase();
  const serviceTitle = service.title?.toLowerCase();
  
  // Mapping theo service ID
  if (serviceId) {
    if (serviceId.includes('prenatal') || serviceId.includes('trước sinh')) {
      return 'bi-heart-pulse';
    }
    if (serviceId.includes('parentage') || serviceId.includes('cha con')) {
      return 'bi-people';
    }
    if (serviceId.includes('sibling') || serviceId.includes('anh em')) {
      return 'bi-person-lines-fill';
    }
    if (serviceId.includes('grandparent') || serviceId.includes('ông bà')) {
      return 'bi-person-heart';
    }
    if (serviceId.includes('maternal') || serviceId.includes('mẹ con')) {
      return 'bi-person-heart';
    }
    if (serviceId.includes('paternal') || serviceId.includes('cha con')) {
      return 'bi-person';
    }
    if (serviceId.includes('twin') || serviceId.includes('sinh đôi')) {
      return 'bi-people-fill';
    }
    if (serviceId.includes('y-chromosome') || serviceId.includes('y')) {
      return 'bi-gender-male';
    }
    if (serviceId.includes('mt-dna') || serviceId.includes('mitochondrial')) {
      return 'bi-gender-female';
    }
  }
  
  // Mapping theo service title
  if (serviceTitle) {
    if (serviceTitle.includes('trước sinh') || serviceTitle.includes('prenatal')) {
      return 'bi-heart-pulse';
    }
    if (serviceTitle.includes('cha con') || serviceTitle.includes('parentage')) {
      return 'bi-people';
    }
    if (serviceTitle.includes('anh em') || serviceTitle.includes('sibling')) {
      return 'bi-person-lines-fill';
    }
    if (serviceTitle.includes('ông bà') || serviceTitle.includes('grandparent')) {
      return 'bi-person-heart';
    }
    if (serviceTitle.includes('mẹ con') || serviceTitle.includes('maternal')) {
      return 'bi-person-heart';
    }
    if (serviceTitle.includes('sinh đôi') || serviceTitle.includes('twin')) {
      return 'bi-people-fill';
    }
    if (serviceTitle.includes('y-chromosome') || serviceTitle.includes('y')) {
      return 'bi-gender-male';
    }
    if (serviceTitle.includes('mt-dna') || serviceTitle.includes('mitochondrial')) {
      return 'bi-gender-female';
    }
  }
  
  // Icon mặc định
  return 'bi-dna';
};