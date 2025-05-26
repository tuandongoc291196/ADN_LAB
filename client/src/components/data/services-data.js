// client/src/data/services-data.js

export const COLLECTION_METHODS = {
  'self-sample': {
    id: 'self-sample',
    title: 'Lấy mẫu tại nhà',
    description: 'Tự thu mẫu theo hướng dẫn tại nhà',
    icon: 'bi-house',
    color: 'success',
    process: ['Đặt hẹn', 'Nhận kit', 'Thu mẫu', 'Gửi lại', 'Nhận kết quả'],
    note: 'Chỉ áp dụng cho xét nghiệm ADN dân sự',
    allowedFor: ['civil']
  },
  'home-visit': {
    id: 'home-visit',
    title: 'Nhân viên tới nhà lấy mẫu',
    description: 'Nhân viên chuyên nghiệp đến tận nhà thu mẫu',
    icon: 'bi-truck',
    color: 'warning',
    process: ['Đặt hẹn', 'Nhân viên đến', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả'],
    note: 'Phí dịch vụ nhân viên: 400,000 VNĐ (trong nội thành)',
    allowedFor: ['civil', 'administrative']
  },
  'at-facility': {
    id: 'at-facility',
    title: 'Tới cơ sở lấy mẫu',
    description: 'Đến trực tiếp cơ sở y tế để lấy mẫu',
    icon: 'bi-hospital',
    color: 'primary',
    process: ['Đặt hẹn', 'Đến cơ sở', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả'],
    note: 'Đảm bảo tính chính xác và có giá trị pháp lý',
    allowedFor: ['civil', 'administrative']
  }
};

export const SERVICES_DATA = {
  // NHÓM HÀNH CHÍNH (CÓ GIÁ TRỊ PHÁP LÝ)
  administrative: [
    {
      id: 'admin-birth-cert',
      title: 'ADN làm giấy khai sinh',
      description: 'Xác nhận quan hệ huyết thống để hoàn tất thủ tục giấy khai sinh (thường áp dụng khi cha mẹ không đăng ký kết hôn).',
      fullDescription: `
        Xét nghiệm ADN làm giấy khai sinh được thực hiện khi cần xác nhận mối quan hệ huyết thống giữa cha và con để hoàn tất các thủ tục đăng ký khai sinh.
        
        Dịch vụ này thường được sử dụng trong các trường hợp:
        - Cha mẹ chưa đăng ký kết hôn
        - Thiếu giấy tờ chứng minh quan hệ huyết thống
        - Yêu cầu từ cơ quan nhà nước trong thủ tục hành chính
        
        Kết quả xét nghiệm có đầy đủ giá trị pháp lý và được các cơ quan nhà nước công nhận.
      `,
      price: '4,200,000 VNĐ',
      duration: '3-5 ngày',
      category: 'administrative',
      serviceType: 'administrative',
      hasLegalValue: true,
      icon: 'bi-file-earmark-text',
      allowedMethods: ['home-visit', 'at-facility'],
      participants: ['Cha', 'Con', 'Mẹ (nếu có)'],
      requiredDocuments: ['CCCD/CMND của tất cả người tham gia', 'Giấy khai sinh (nếu có)', 'Giấy tờ liên quan đến thủ tục'],
      procedures: [
        'Tư vấn yêu cầu pháp lý và thủ tục',
        'Thu thập mẫu ADN có sự giám sát của nhân viên y tế',
        'Phân tích ADN theo tiêu chuẩn pháp lý',
        'Lập báo cáo có giá trị pháp lý',
        'Hỗ trợ thủ tục pháp lý (nếu cần)'
      ],
      featured: true
    },
    {
      id: 'admin-immigration',
      title: 'ADN nhập tịch, làm visa, hộ chiều',
      description: 'Chứng minh quan hệ huyết thống trong các thủ tục nhập tịch, xin visa, làm hộ chiều để đảm bảo quyền lợi gia đình và công dân.',
      fullDescription: `
        Xét nghiệm ADN nhập tịch, làm visa, hộ chiều được sử dụng để chứng minh mối quan hệ huyết thống trong các thủ tục:
        
        - Nhập tịch và nhập quốc tịch
        - Xin visa đoàn tụ gia đình
        - Làm hộ chiều cho trẻ em
        - Thủ tục bảo lãnh gia đình
        
        Kết quả được các cơ quan ngoại giao và nhập cư quốc tế công nhận.
      `,
      price: '5,800,000 VNĐ',
      duration: '3-5 ngày',
      category: 'administrative',
      serviceType: 'administrative',
      hasLegalValue: true,
      icon: 'bi-globe',
      allowedMethods: ['home-visit', 'at-facility'],
      participants: ['Người bảo lãnh', 'Người được bảo lãnh'],
      requiredDocuments: ['Hộ chiếu/CCCD', 'Giấy tờ liên quan đến thủ tục nhập tịch/visa'],
      procedures: [
        'Tư vấn yêu cầu pháp lý quốc tế',
        'Thu thập mẫu theo tiêu chuẩn quốc tế',
        'Phân tích ADN với báo cáo song ngữ',
        'Cung cấp kết quả có giá trị pháp lý quốc tế',
        'Hỗ trợ thủ tục với cơ quan ngoại giao'
      ],
      featured: true
    },
    {
      id: 'admin-inheritance',
      title: 'ADN xác nhận quyền thừa kế',
      description: 'Xác định người thừa kế hợp pháp trong tranh chấp tài sản hoặc chia tài sản thừa kế.',
      fullDescription: `
        Xét nghiệm ADN xác nhận quyền thừa kế được sử dụng trong các vụ việc:
        
        - Tranh chấp thừa kế tài sản
        - Xác định người thừa kế hợp pháp
        - Giải quyết các tranh chấp gia đình về tài sản
        - Thủ tục phân chia di sản
        
        Kết quả có giá trị pháp lý đầy đủ để sử dụng tại tòa án và các cơ quan pháp luật.
      `,
      price: '5,200,000 VNĐ',
      duration: '3-5 ngày',
      category: 'administrative',
      serviceType: 'administrative',
      hasLegalValue: true,
      icon: 'bi-building',
      allowedMethods: ['home-visit', 'at-facility'],
      participants: ['Người để lại di sản', 'Người thừa kế'],
      requiredDocuments: ['CCCD/CMND', 'Giấy chứng tử', 'Giấy tờ liên quan đến tài sản'],
      procedures: [
        'Tư vấn pháp lý về thừa kế',
        'Thu thập mẫu các bên liên quan',
        'Phân tích ADN chi tiết',
        'Lập báo cáo pháp lý',
        'Hỗ trợ thủ tục tòa án'
      ],
      featured: false
    },
    {
      id: 'admin-child-support',
      title: 'ADN xác định trách nhiệm cấp dưỡng',
      description: 'Hỗ trợ xác định trách nhiệm cấp dưỡng của cha mẹ đối với con trong các vụ ly hôn hoặc tranh chấp gia đình.',
      fullDescription: `
        Xét nghiệm ADN xác định trách nhiệm cấp dưỡng được sử dụng trong:
        
        - Các vụ ly hôn có tranh chấp về con
        - Xác định trách nhiệm nuôi con
        - Thủ tục đòi cấp dưỡng
        - Giải quyết tranh chấp gia đình
        
        Kết quả giúp tòa án có căn cứ pháp lý để quyết định về trách nhiệm cấp dưỡng.
      `,
      price: '4,800,000 VNĐ',
      duration: '3-5 ngày',
      category: 'administrative',
      serviceType: 'administrative',
      hasLegalValue: true,
      icon: 'bi-heart',
      allowedMethods: ['home-visit', 'at-facility'],
      participants: ['Cha', 'Con', 'Mẹ (nếu cần)'],
      requiredDocuments: ['CCCD/CMND', 'Giấy khai sinh của con', 'Giấy tờ tòa án (nếu có)'],
      procedures: [
        'Tư vấn về quyền và nghĩa vụ cấp dưỡng',
        'Thu thập mẫu có giám sát',
        'Phân tích ADN theo yêu cầu tòa án',
        'Cung cấp báo cáo pháp lý',
        'Hỗ trợ thủ tục tại tòa án'
      ],
      featured: false
    },
    {
      id: 'admin-missing-person',
      title: 'ADN nhận người thân',
      description: 'Xác minh và tìm kiếm mối quan hệ huyết thống với người thân bị thất lạc hoặc chưa được công nhận hợp pháp.',
      fullDescription: `
        Xét nghiệm ADN nhận người thân được sử dụng để:
        
        - Tìm kiếm người thân thất lạc
        - Xác minh danh tính người thân
        - Đoàn tụ gia đình sau thảm họa
        - Nhận người thân từ nước ngoài
        
        Đây là dịch vụ nhân văn giúp các gia đình đoàn tụ và có căn cứ pháp lý.
      `,
      price: '6,200,000 VNĐ',
      duration: '3-7 ngày',
      category: 'administrative',
      serviceType: 'administrative',
      hasLegalValue: true,
      icon: 'bi-people',
      allowedMethods: ['home-visit', 'at-facility'],
      participants: ['Người tìm kiếm', 'Người được tìm kiếm'],
      requiredDocuments: ['CCCD/CMND', 'Giấy tờ chứng minh quan hệ (nếu có)', 'Giấy báo mất tích (nếu có)'],
      procedures: [
        'Tư vấn và hỗ trợ tìm kiếm',
        'Thu thập mẫu từ các bên',
        'Phân tích ADN mở rộng',
        'So sánh với cơ sở dữ liệu',
        'Cung cấp báo cáo và hỗ trợ pháp lý'
      ],
      featured: false
    }
  ],

  // NHÓM DÂN SỰ (KHÔNG CÓ GIÁ TRỊ PHÁP LÝ)
  civil: [
    {
      id: 'civil-paternity',
      title: 'ADN huyết thống',
      description: 'Kiểm tra mối quan hệ huyết thống (cha - con, mẹ - con, anh chị em, họ hàng,...) phục vụ cho mục đích cá nhân.',
      fullDescription: `
        Xét nghiệm ADN huyết thống dân sự được sử dụng để xác định mối quan hệ huyết thống cho mục đích cá nhân:
        
        - Xác định quan hệ cha - con
        - Xác định quan hệ mẹ - con
        - Xác định quan hệ anh chị em
        - Xác định quan hệ họ hàng khác
        
        Kết quả chỉ mang tính chất tham khảo cá nhân, không có giá trị pháp lý.
      `,
      price: '3,500,000 VNĐ',
      duration: '5-7 ngày',
      category: 'civil',
      serviceType: 'civil',
      hasLegalValue: false,
      icon: 'bi-people',
      allowedMethods: ['self-sample', 'home-visit', 'at-facility'],
      participants: ['Người thứ nhất', 'Người thứ hai'],
      requiredDocuments: ['CCCD/CMND (để xác minh danh tính)'],
      procedures: [
        'Tư vấn và đặt lịch hẹn',
        'Thu thập mẫu ADN (tế bào má, tóc, máu...)',
        'Phân tích mẫu ADN tại phòng thí nghiệm',
        'Phân tích kết quả và xuất báo cáo',
        'Tư vấn và giải thích kết quả'
      ],
      featured: true
    },
    {
      id: 'civil-prenatal',
      title: 'ADN trước sinh',
      description: 'Xác định quan hệ huyết thống giữa thai nhi và người cha giả định; thường được tiến hành từ tuần 7-8 của thai kỳ bằng phương pháp không xâm lấn.',
      fullDescription: `
        Xét nghiệm ADN trước sinh là phương pháp hiện đại, an toàn để xác định quan hệ huyết thống khi thai nhi còn trong bụng mẹ:
        
        - Thực hiện từ tuần thứ 7-8 của thai kỳ
        - Phương pháp không xâm lấn, an toàn cho mẹ và bé
        - Sử dụng mẫu máu của mẹ để tách ADN thai nhi
        - Độ chính xác cao lên đến 99.9%
        
        Đây là lựa chọn lý tưởng cho những gia đình muốn xác định quan hệ huyết thống sớm.
      `,
      price: '12,500,000 VNĐ',
      duration: '7-10 ngày',
      category: 'civil',
      serviceType: 'civil',
      hasLegalValue: false,
      icon: 'bi-heart',
      allowedMethods: ['home-visit', 'at-facility'],
      participants: ['Mẹ mang thai', 'Cha nghi ngờ'],
      requiredDocuments: ['CCCD/CMND', 'Sổ khám thai', 'Siêu âm xác định tuần tuổi thai'],
      procedures: [
        'Tư vấn và kiểm tra điều kiện thai kỳ',
        'Lấy mẫu máu mẹ (10ml) và mẫu ADN của cha',
        'Tách chiết ADN thai nhi từ máu mẹ',
        'Phân tích và so sánh với ADN của cha',
        'Cung cấp kết quả và tư vấn chi tiết'
      ],
      featured: true
    },
    {
      id: 'civil-ancestry',
      title: 'ADN nguồn gốc tổ tiên',
      description: 'Phân tích nguồn gốc di truyền, giúp xác định tổ tiên và dòng họ của nhân.',
      fullDescription: `
        Xét nghiệm ADN nguồn gốc tổ tiên giúp bạn khám phá lịch sử gia đình và nguồn gốc dân tộc:
        
        - Xác định nguồn gốc địa lý của tổ tiên
        - Phân tích thành phần dân tộc
        - Tìm hiểu lịch sử di cư của gia đình
        - Kết nối với họ hàng xa
        
        Sử dụng công nghệ phân tích ADN hiện đại để cung cấp thông tin chi tiết về nguồn gốc.
      `,
      price: '4,800,000 VNĐ',
      duration: '10-14 ngày',
      category: 'civil',
      serviceType: 'civil',
      hasLegalValue: false,
      icon: 'bi-tree',
      allowedMethods: ['self-sample', 'home-visit', 'at-facility'],
      participants: ['Người yêu cầu'],
      requiredDocuments: ['CCCD/CMND'],
      procedures: [
        'Tư vấn về phân tích nguồn gốc',
        'Thu thập mẫu ADN',
        'Phân tích marker di truyền đặc trưng',
        'So sánh với cơ sở dữ liệu toàn cầu',
        'Cung cấp báo cáo nguồn gốc chi tiết'
      ],
      featured: false
    },
    {
      id: 'civil-personal',
      title: 'ADN cá nhân',
      description: 'Phân tích đặc điểm di truyền cá nhân như khả năng phản ứng với thuốc, nguy cơ mắc bệnh di truyền, hay các đặc tính sinh học khác.',
      fullDescription: `
        Xét nghiệm ADN cá nhân cung cấp thông tin về đặc điểm di truyền của bản thân:
        
        - Phân tích khả năng phản ứng với thuốc
        - Đánh giá nguy cơ mắc các bệnh di truyền
        - Phân tích đặc tính thể chất và sinh học
        - Tư vấn về lối sống phù hợp với gen
        
        Giúp bạn hiểu rõ hơn về bản thân và đưa ra các quyết định sức khỏe phù hợp.
      `,
      price: '6,800,000 VNĐ',
      duration: '14-21 ngày',
      category: 'civil',
      serviceType: 'civil',
      hasLegalValue: false,
      icon: 'bi-person-circle',
      allowedMethods: ['self-sample', 'home-visit', 'at-facility'],
      participants: ['Người yêu cầu'],
      requiredDocuments: ['CCCD/CMND'],
      procedures: [
        'Tư vấn về phân tích gen cá nhân',
        'Thu thập mẫu ADN',
        'Phân tích toàn bộ genome',
        'Đánh giá các marker sức khỏe',
        'Cung cấp báo cáo và tư vấn chuyên sâu'
      ],
      featured: false
    },
    {
      id: 'civil-discreet',
      title: 'ADN bí mật',
      description: 'Thực hiện kiểm tra quan hệ huyết thống một cách an toàn, phù hợp khi cần bảo mật và riêng tư toàn diện thông tin xét nghiệm.',
      fullDescription: `
        Xét nghiệm ADN bí mật được thiết kế cho những trường hợp cần sự bảo mật tuyệt đối:
        
        - Bảo mật hoàn toàn danh tính và thông tin
        - Không yêu cầu sự đồng ý của tất cả các bên
        - Quy trình riêng tư và kín đáo
        - Kết quả chỉ cung cấp cho người yêu cầu
        
        Phù hợp cho những tình huống nhạy cảm cần sự thận trọng cao.
      `,
      price: '8,500,000 VNĐ',
      duration: '7-10 ngày',
      category: 'civil',
      serviceType: 'civil',
      hasLegalValue: false,
      icon: 'bi-shield-lock',
      allowedMethods: ['self-sample', 'home-visit', 'at-facility'],
      participants: ['Người yêu cầu', 'Đối tượng xét nghiệm'],
      requiredDocuments: ['Chỉ cần CCCD của người yêu cầu'],
      procedures: [
        'Tư vấn bảo mật và quy trình',
        'Thu thập mẫu theo yêu cầu riêng tư',
        'Phân tích trong môi trường bảo mật',
        'Xuất báo cáo mã hóa',
        'Giao kết quả trực tiếp cho người yêu cầu'
      ],
      featured: true
    }
  ]
};

// Helper functions
export const getAllServices = () => {
  return [...SERVICES_DATA.administrative, ...SERVICES_DATA.civil];
};

export const getServiceById = (id) => {
  const allServices = getAllServices();
  return allServices.find(service => service.id === id);
};

export const getServicesByType = (type) => {
  return SERVICES_DATA[type] || [];
};

export const getAvailableMethodsForService = (serviceId) => {
  const service = getServiceById(serviceId);
  if (!service) return [];
  
  return service.allowedMethods.map(methodId => COLLECTION_METHODS[methodId]);
};

export const isMethodAllowedForService = (serviceId, methodId) => {
  const service = getServiceById(serviceId);
  if (!service) return false;
  
  return service.allowedMethods.includes(methodId);
};