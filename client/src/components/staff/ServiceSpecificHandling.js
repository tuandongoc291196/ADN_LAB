// ServiceSpecificHandling.js - Xử lý đặc thù theo từng loại dịch vụ

export const SERVICE_TYPES = {
  ADMINISTRATIVE: 'administrative',
  CIVIL: 'civil'
};

export const SERVICE_CONFIGS = {
  // Dịch vụ hành chính (có giá trị pháp lý)
  'admin-birth-cert': {
    name: 'ADN làm giấy khai sinh',
    type: SERVICE_TYPES.ADMINISTRATIVE,
    kitRequirements: {
      name: 'Kit ADN khai sinh',
      items: 'Que tăm bông chuyên dụng, túi bảo quản có mã, form pháp lý, hướng dẫn chi tiết',
      instructions: 'Bắt buộc có nhân viên giám sát. Que tăm bông quệt vào má trong 30 giây, bảo quản trong túi có mã định danh',
      specialRequirements: ['Giấy tờ tùy thân', 'Nhân chứng (nếu cần)', 'Giấy ủy quyền (nếu có)'],
      legalNote: 'Kit này có giá trị pháp lý, cần tuân thủ nghiêm ngặt quy trình'
    },
    collectionRequirements: {
      allowedMethods: ['home-visit', 'at-facility'],
      supervisionRequired: true,
      witnessRequired: true,
      documentVerification: true,
      chainOfCustody: true
    },
    testingRequirements: {
      markersRequired: 21,
      accuracyLevel: '99.999%',
      equipment: 'ABI 3500 Genetic Analyzer',
      method: 'STR Analysis (21 markers)',
      legalCompliance: true,
      reportType: 'legal'
    },
    resultRequirements: {
      approvalLevels: 2,
      witnessSignature: false,
      notarization: true,
      bilingualReport: false,
      legalValue: true
    }
  },

  'admin-immigration': {
    name: 'ADN nhập tịch, làm visa, hộ chiếu',
    type: SERVICE_TYPES.ADMINISTRATIVE,
    kitRequirements: {
      name: 'Kit ADN nhập tịch/visa',
      items: 'Que tăm bông quốc tế, túi bảo quản đặc biệt, form song ngữ, hướng dẫn quốc tế',
      instructions: 'Tuân thủ tiêu chuẩn quốc tế. Thu mẫu có giám sát, bảo quản theo chuẩn ISO',
      specialRequirements: ['Hộ chiếu', 'Visa (nếu có)', 'Giấy tờ nhập tịch'],
      legalNote: 'Kit đáp ứng tiêu chuẩn quốc tế cho thủ tục ngoại giao'
    },
    collectionRequirements: {
      allowedMethods: ['home-visit', 'at-facility'],
      supervisionRequired: true,
      witnessRequired: false,
      documentVerification: true,
      chainOfCustody: true,
      internationalStandard: true
    },
    testingRequirements: {
      markersRequired: 24,
      accuracyLevel: '99.999%',
      equipment: 'ABI 3500 Genetic Analyzer + International Kit',
      method: 'STR Analysis (24 markers) + International Standards',
      legalCompliance: true,
      reportType: 'international'
    },
    resultRequirements: {
      approvalLevels: 2,
      witnessSignature: false,
      notarization: true,
      bilingualReport: true,
      legalValue: true,
      internationalRecognition: true
    }
  },

  'admin-inheritance': {
    name: 'ADN xác nhận quyền thừa kế',
    type: SERVICE_TYPES.ADMINISTRATIVE,
    kitRequirements: {
      name: 'Kit ADN thừa kế',
      items: 'Que tăm bông pháp lý, túi bảo quản có niêm phong, biên bản thu mẫu, hướng dẫn tòa án',
      instructions: 'Thu mẫu có nhân chứng, niêm phong theo quy định pháp luật',
      specialRequirements: ['CCCD/CMND', 'Giấy chứng tử', 'Giấy tờ tài sản'],
      legalNote: 'Kit phục vụ thủ tục tòa án, cần có biên bản thu mẫu'
    },
    collectionRequirements: {
      allowedMethods: ['home-visit', 'at-facility'],
      supervisionRequired: true,
      witnessRequired: true,
      documentVerification: true,
      chainOfCustody: true,
      courtCompliance: true
    },
    testingRequirements: {
      markersRequired: 21,
      accuracyLevel: '99.999%',
      equipment: 'ABI 3500 Genetic Analyzer',
      method: 'STR Analysis (21 markers)',
      legalCompliance: true,
      reportType: 'court'
    },
    resultRequirements: {
      approvalLevels: 2,
      witnessSignature: true,
      notarization: true,
      bilingualReport: false,
      legalValue: true,
      courtAdmissible: true
    }
  },

  // Dịch vụ dân sự (không có giá trị pháp lý)
  'civil-paternity': {
    name: 'ADN huyết thống',
    type: SERVICE_TYPES.CIVIL,
    kitRequirements: {
      name: 'Kit ADN huyết thống',
      items: 'Que tăm bông tiêu chuẩn, túi đựng mẫu, hướng dẫn tự thu mẫu',
      instructions: 'Có thể tự thu mẫu tại nhà. Que tăm bông quệt vào má trong 30 giây',
      specialRequirements: ['CCCD/CMND để xác minh'],
      legalNote: 'Kết quả chỉ mang tính tham khảo, không có giá trị pháp lý'
    },
    collectionRequirements: {
      allowedMethods: ['self-sample', 'home-visit', 'at-facility'],
      supervisionRequired: false,
      witnessRequired: false,
      documentVerification: false,
      chainOfCustody: false
    },
    testingRequirements: {
      markersRequired: 16,
      accuracyLevel: '99.99%',
      equipment: 'ABI 3130 Genetic Analyzer',
      method: 'STR Analysis (16 markers)',
      legalCompliance: false,
      reportType: 'personal'
    },
    resultRequirements: {
      approvalLevels: 1,
      witnessSignature: false,
      notarization: false,
      bilingualReport: false,
      legalValue: false
    }
  },

  'civil-prenatal': {
    name: 'ADN trước sinh',
    type: SERVICE_TYPES.CIVIL,
    kitRequirements: {
      name: 'Kit ADN trước sinh',
      items: 'Ống lấy máu chuyên dụng, que tăm bông cho cha, túi bảo quản lạnh, hướng dẫn đặc biệt',
      instructions: 'Bắt buộc có nhân viên y tế. Lấy máu mẹ 10ml, mẫu ADN cha',
      specialRequirements: ['Sổ khám thai', 'Siêu âm tuần tuổi thai', 'CCCD/CMND'],
      legalNote: 'Thực hiện từ tuần 7-8, an toàn cho mẹ và bé'
    },
    collectionRequirements: {
      allowedMethods: ['home-visit', 'at-facility'],
      supervisionRequired: true,
      witnessRequired: false,
      documentVerification: true,
      chainOfCustody: false,
      medicalSupervision: true,
      pregnancyVerification: true
    },
    testingRequirements: {
      markersRequired: 15,
      accuracyLevel: '99.9%',
      equipment: 'Illumina MiSeq + cfDNA Kit',
      method: 'cfDNA Analysis + SNP',
      legalCompliance: false,
      reportType: 'prenatal',
      specialAnalysis: 'cfDNA'
    },
    resultRequirements: {
      approvalLevels: 2,
      witnessSignature: false,
      notarization: false,
      bilingualReport: false,
      legalValue: false,
      medicalConsultation: true
    }
  },

  'civil-discreet': {
    name: 'ADN bí mật',
    type: SERVICE_TYPES.CIVIL,
    kitRequirements: {
      name: 'Kit ADN bí mật',
      items: 'Que tăm bông không nhãn, túi bảo quản ẩn danh, hướng dẫn bảo mật',
      instructions: 'Thu mẫu kín đáo, bảo mật tuyệt đối danh tính',
      specialRequirements: ['Chỉ cần CCCD người yêu cầu'],
      legalNote: 'Bảo mật hoàn toàn, kết quả chỉ cung cấp cho người yêu cầu'
    },
    collectionRequirements: {
      allowedMethods: ['self-sample', 'home-visit', 'at-facility'],
      supervisionRequired: false,
      witnessRequired: false,
      documentVerification: false,
      chainOfCustody: false,
      confidentialHandling: true,
      anonymousProcessing: true
    },
    testingRequirements: {
      markersRequired: 16,
      accuracyLevel: '99.99%',
      equipment: 'ABI 3130 Genetic Analyzer',
      method: 'STR Analysis (16 markers)',
      legalCompliance: false,
      reportType: 'confidential',
      encryptedProcessing: true
    },
    resultRequirements: {
      approvalLevels: 1,
      witnessSignature: false,
      notarization: false,
      bilingualReport: false,
      legalValue: false,
      encryptedDelivery: true,
      limitedAccess: true
    }
  }
};

// Utility functions
export const getServiceConfig = (serviceId) => {
  return SERVICE_CONFIGS[serviceId] || null;
};

export const isAdministrativeService = (serviceId) => {
  const config = getServiceConfig(serviceId);
  return config?.type === SERVICE_TYPES.ADMINISTRATIVE;
};

export const isCivilService = (serviceId) => {
  const config = getServiceConfig(serviceId);
  return config?.type === SERVICE_TYPES.CIVIL;
};

export const getAllowedCollectionMethods = (serviceId) => {
  const config = getServiceConfig(serviceId);
  return config?.collectionRequirements?.allowedMethods || [];
};

export const isMethodAllowed = (serviceId, method) => {
  const allowedMethods = getAllowedCollectionMethods(serviceId);
  return allowedMethods.includes(method);
};

export const getKitRequirements = (serviceId) => {
  const config = getServiceConfig(serviceId);
  return config?.kitRequirements || null;
};

export const getCollectionRequirements = (serviceId) => {
  const config = getServiceConfig(serviceId);
  return config?.collectionRequirements || null;
};

export const getTestingRequirements = (serviceId) => {
  const config = getServiceConfig(serviceId);
  return config?.testingRequirements || null;
};

export const getResultRequirements = (serviceId) => {
  const config = getServiceConfig(serviceId);
  return config?.resultRequirements || null;
};

// Validation functions
export const validateKitPreparation = (serviceId, kitData) => {
  const requirements = getKitRequirements(serviceId);
  if (!requirements) return { valid: false, errors: ['Service not found'] };

  const errors = [];
  
  // Validate based on service type
  if (isAdministrativeService(serviceId)) {
    if (!kitData.legalCompliance) {
      errors.push('Legal compliance documentation required');
    }
    if (!kitData.chainOfCustody) {
      errors.push('Chain of custody must be maintained');
    }
  }

  return { valid: errors.length === 0, errors };
};

export const validateSampleCollection = (serviceId, collectionData) => {
  const requirements = getCollectionRequirements(serviceId);
  if (!requirements) return { valid: false, errors: ['Service not found'] };

  const errors = [];

  if (requirements.supervisionRequired && !collectionData.supervisionConfirmed) {
    errors.push('Supervision is required for this service');
  }

  if (requirements.witnessRequired && !collectionData.witnessPresent) {
    errors.push('Witness is required for this service');
  }

  if (requirements.documentVerification && !collectionData.documentsVerified) {
    errors.push('Document verification is required');
  }

  return { valid: errors.length === 0, errors };
};

export const validateTesting = (serviceId, testingData) => {
  const requirements = getTestingRequirements(serviceId);
  if (!requirements) return { valid: false, errors: ['Service not found'] };

  const errors = [];

  if (testingData.markersAnalyzed < requirements.markersRequired) {
    errors.push(`Minimum ${requirements.markersRequired} markers required`);
  }

  if (requirements.legalCompliance && !testingData.legalProtocolFollowed) {
    errors.push('Legal testing protocol must be followed');
  }

  return { valid: errors.length === 0, errors };
};

export default {
  SERVICE_TYPES,
  SERVICE_CONFIGS,
  getServiceConfig,
  isAdministrativeService,
  isCivilService,
  getAllowedCollectionMethods,
  isMethodAllowed,
  getKitRequirements,
  getCollectionRequirements,
  getTestingRequirements,
  getResultRequirements,
  validateKitPreparation,
  validateSampleCollection,
  validateTesting
}; 