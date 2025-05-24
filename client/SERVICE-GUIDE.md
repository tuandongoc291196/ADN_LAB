# Hướng dẫn Hệ thống Dịch vụ ADN Lab

## 📋 Tổng quan

Hệ thống dịch vụ ADN Lab được tổ chức thành 2 nhóm chính:

### 🏛️ **ADN Hành chính (Administrative)**
- **Có giá trị pháp lý** - Được tòa án và cơ quan nhà nước công nhận
- **Thu mẫu có giám sát** - Bắt buộc phải tại cơ sở hoặc có nhân viên giám sát
- **Phục vụ thủ tục pháp lý**: Khai sinh, nhập tịch, visa, thừa kế, cấp dưỡng

### 🏠 **ADN Dân sự (Civil)**
- **Mục đích cá nhân** - Chỉ mang tính tham khảo
- **Linh hoạt về phương thức** - Có thể tự lấy mẫu tại nhà
- **Phục vụ tìm hiểu**: Huyết thống, nguồn gốc, sức khỏe cá nhân

---

## 🗂️ Cấu trúc Dữ liệu

### Dịch vụ (Service)
```javascript
{
  id: 'unique-service-id',
  title: 'Tên dịch vụ',
  description: 'Mô tả ngắn',
  fullDescription: 'Mô tả chi tiết đầy đủ',
  price: 'Giá dịch vụ',
  duration: 'Thời gian có kết quả',
  category: 'civil|administrative',
  serviceType: 'civil|administrative',
  hasLegalValue: true|false,
  icon: 'bootstrap-icon-class',
  allowedMethods: ['self-sample', 'home-visit', 'at-facility'],
  participants: ['Danh sách người tham gia'],
  requiredDocuments: ['Giấy tờ cần thiết'],
  procedures: ['Các bước thực hiện'],
  featured: true|false
}
```

### Phương thức Thu mẫu (Collection Methods)
```javascript
{
  id: 'method-id',
  title: 'Tên phương thức',
  description: 'Mô tả',
  icon: 'bootstrap-icon',
  color: 'bootstrap-color',
  process: ['Quy trình thực hiện'],
  note: 'Ghi chú đặc biệt',
  allowedFor: ['civil', 'administrative']
}
```

---

## 🎯 Danh sách Dịch vụ

### ADN Hành chính (5 dịch vụ)

#### 1. **ADN làm giấy khai sinh**
- **ID**: `admin-birth-cert`
- **Giá**: 4,200,000 VNĐ
- **Thời gian**: 3-5 ngày
- **Phương thức**: Thu mẫu tại cơ sở, Nhân viên tới nhà
- **Mục đích**: Hoàn tất thủ tục khai sinh khi cha mẹ chưa đăng ký kết hôn

#### 2. **ADN nhập tịch, làm visa, hộ chiều**
- **ID**: `admin-immigration`
- **Giá**: 5,800,000 VNĐ
- **Thời gian**: 3-5 ngày
- **Phương thức**: Thu mẫu tại cơ sở, Nhân viên tới nhà
- **Mục đích**: Chứng minh quan hệ huyết thống cho thủ tục nhập tịch, visa

#### 3. **ADN xác nhận quyền thừa kế**
- **ID**: `admin-inheritance`
- **Giá**: 5,200,000 VNĐ
- **Thời gian**: 3-5 ngày
- **Phương thức**: Thu mẫu tại cơ sở, Nhân viên tới nhà
- **Mục đích**: Giải quyết tranh chấp thừa kế, xác định người thừa kế hợp pháp

#### 4. **ADN xác định trách nhiệm cấp dưỡng**
- **ID**: `admin-child-support`
- **Giá**: 4,800,000 VNĐ
- **Thời gian**: 3-5 ngày
- **Phương thức**: Thu mẫu tại cơ sở, Nhân viên tới nhà
- **Mục đích**: Xác định trách nhiệm cấp dưỡng trong các vụ ly hôn

#### 5. **ADN nhận người thân**
- **ID**: `admin-missing-person`
- **Giá**: 6,200,000 VNĐ
- **Thời gian**: 3-7 ngày
- **Phương thức**: Thu mẫu tại cơ sở, Nhân viên tới nhà
- **Mục đích**: Tìm kiếm, xác minh danh tính người thân thất lạc

### ADN Dân sự (5 dịch vụ)

#### 1. **ADN huyết thống**
- **ID**: `civil-paternity`
- **Giá**: 3,500,000 VNĐ
- **Thời gian**: 5-7 ngày
- **Phương thức**: Tự lấy mẫu, Nhân viên tới nhà, Thu mẫu tại cơ sở
- **Mục đích**: Kiểm tra quan hệ huyết thống cho mục đích cá nhân

#### 2. **ADN trước sinh**
- **ID**: `civil-prenatal`
- **Giá**: 12,500,000 VNĐ
- **Thời gian**: 7-10 ngày
- **Phương thức**: Nhân viên tới nhà, Thu mẫu tại cơ sở
- **Mục đích**: Xác định quan hệ huyết thống khi thai nhi còn trong bụng mẹ

#### 3. **ADN nguồn gốc tổ tiên**
- **ID**: `civil-ancestry`
- **Giá**: 4,800,000 VNĐ
- **Thời gian**: 10-14 ngày
- **Phương thức**: Tự lấy mẫu, Nhân viên tới nhà, Thu mẫu tại cơ sở
- **Mục đích**: Khám phá nguồn gốc địa lý và dân tộc của tổ tiên

#### 4. **ADN cá nhân**
- **ID**: `civil-personal`
- **Giá**: 6,800,000 VNĐ
- **Thời gian**: 14-21 ngày
- **Phương thức**: Tự lấy mẫu, Nhân viên tới nhà, Thu mẫu tại cơ sở
- **Mục đích**: Phân tích đặc điểm di truyền, khả năng phản ứng với thuốc

#### 5. **ADN bí mật**
- **ID**: `civil-discreet`
- **Giá**: 8,500,000 VNĐ
- **Thời gian**: 7-10 ngày
- **Phương thức**: Tự lấy mẫu, Nhân viên tới nhà, Thu mẫu tại cơ sở
- **Mục đích**: Kiểm tra quan hệ huyết thống một cách bảo mật tuyệt đối

---

## 🔧 Phương thức Thu mẫu

### 1. **Tự lấy mẫu tại nhà** (`self-sample`)
- **Màu sắc**: `success` (xanh lá)
- **Icon**: `bi-house`
- **Áp dụng cho**: Chỉ ADN dân sự
- **Quy trình**: Đặt hẹn → Nhận kit → Thu mẫu → Gửi lại → Nhận kết quả
- **Ưu điểm**: Thuận tiện, riêng tư, tiết kiệm thời gian

### 2. **Nhân viên tới nhà lấy mẫu** (`home-visit`)
- **Màu sắc**: `warning` (vàng)
- **Icon**: `bi-truck`
- **Áp dụng cho**: Cả ADN dân sự và hành chính
- **Quy trình**: Đặt hẹn → Nhân viên đến → Thu mẫu → Xét nghiệm → Nhận kết quả
- **Phí bổ sung**: 200,000 VNĐ (nội thành)

### 3. **Tới cơ sở lấy mẫu** (`at-facility`)
- **Màu sắc**: `primary` (xanh dương)
- **Icon**: `bi-hospital`
- **Áp dụng cho**: Cả ADN dân sự và hành chính
- **Quy trình**: Đặt hẹn → Đến cơ sở → Thu mẫu → Xét nghiệm → Nhận kết quả
- **Bắt buộc cho**: ADN hành chính (có giá trị pháp lý)

---

## 🛠️ Cách sử dụng API

### Import dữ liệu
```javascript
import { 
  getAllServices, 
  getServiceById, 
  getServicesByType,
  getAvailableMethodsForService,
  COLLECTION_METHODS,
  SERVICES_DATA
} from '../data/services-data';
```

### Lấy tất cả dịch vụ
```javascript
const allServices = getAllServices();
```

### Lấy dịch vụ theo loại
```javascript
const civilServices = getServicesByType('civil');
const adminServices = getServicesByType('administrative');
```

### Lấy chi tiết dịch vụ
```javascript
const service = getServiceById('civil-paternity');
```

### Lấy phương thức có sẵn cho dịch vụ
```javascript
const methods = getAvailableMethodsForService('civil-paternity');
```

### Kiểm tra phương thức được phép
```javascript
import { isMethodAllowedForService } from '../data/services-data';

const isAllowed = isMethodAllowedForService('admin-birth-cert', 'self-sample');
// false - vì ADN hành chính không cho phép tự lấy mẫu
```

---

## 🎨 UI Components

### Service Card
```jsx
import { getServiceById, COLLECTION_METHODS } from '../data/services-data';

const ServiceCard = ({ serviceId }) => {
  const service = getServiceById(serviceId);
  
  return (
    <Card>
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div className={`bg-${service.serviceType === 'administrative' ? 'warning' : 'success'} bg-opacity-10 rounded-circle p-3 me-3`}>
            <i className={`${service.icon} text-${service.serviceType === 'administrative' ? 'warning' : 'success'} fs-4`}></i>
          </div>
          <div>
            <Card.Title>{service.title}</Card.Title>
            <div className="text-primary fw-bold">{service.price}</div>
          </div>
        </div>
        
        <Card.Text>{service.description}</Card.Text>
        
        <div className="mb-3">
          {service.hasLegalValue ? (
            <Badge bg="warning" text="dark">Có giá trị pháp lý</Badge>
          ) : (
            <Badge bg="success">Dân sự</Badge>
          )}
        </div>
        
        <div className="mb-3">
          <small className="text-muted d-block mb-2">Phương thức:</small>
          {service.allowedMethods.map(methodId => {
            const method = COLLECTION_METHODS[methodId];
            return (
              <Badge key={methodId} bg={method.color} className="me-1">
                <i className={`${method.icon} me-1`}></i>
                {method.title}
              </Badge>
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};
```

---

## 📊 Helper Functions

### Sử dụng với helpers
```javascript
import { 
  formatCurrency, 
  formatDate, 
  getServiceTypeDisplayName,
  getCollectionMethodDisplayName 
} from '../utils/helpers';

// Format giá tiền
const price = formatCurrency(3500000); // "3.500.000 ₫"

// Format ngày tháng
const date = formatDate('2024-01-15'); // "15 tháng 1, 2024"

// Tên hiển thị loại dịch vụ
const typeName = getServiceTypeDisplayName('civil'); // "ADN Dân sự"

// Tên hiển thị phương thức
const methodName = getCollectionMethodDisplayName('self-sample'); // "Lấy mẫu tại nhà"
```

---

## 🔄 Migration từ Code cũ

### Thay đổi chính:
1. **Cấu trúc dữ liệu**: Từ hardcode sang file riêng biệt
2. **Phân loại rõ ràng**: Civil vs Administrative
3. **Phương thức linh hoạt**: Mỗi dịch vụ có phương thức riêng
4. **Thông tin đầy đủ**: Thêm participants, documents, procedures

### Cập nhật components:
1. **ServiceList.js**: Sử dụng API mới
2. **ServiceDetail.js**: Hiển thị thông tin chi tiết hơn
3. **AppointmentBooking.js**: Logic chọn phương thức dựa trên dịch vụ
4. **Home.js**: Hiển thị dịch vụ featured

---

## 🧪 Testing

### Test cơ bản:
```javascript
// Test lấy dữ liệu
console.log('Total services:', getAllServices().length); // 10
console.log('Civil services:', getServicesByType('civil').length); // 5
console.log('Admin services:', getServicesByType('administrative').length); // 5

// Test phương thức
const service = getServiceById('civil-paternity');
console.log('Available methods:', service.allowedMethods); // ['self-sample', 'home-visit', 'at-facility']

const adminService = getServiceById('admin-birth-cert');
console.log('Admin methods:', adminService.allowedMethods); // ['home-visit', 'at-facility']
```

---

## 🎯 Tính năng sắp tới

- [ ] **API Backend Integration**: Kết nối với database thực
- [ ] **Dynamic Pricing**: Giá thay đổi theo khu vực, khuyến mại
- [ ] **Real-time Availability**: Lịch hẹn theo thời gian thực
- [ ] **Multi-language Support**: Hỗ trợ đa ngôn ngữ
- [ ] **Advanced Filtering**: Lọc theo giá, thời gian, địa điểm
- [ ] **Service Recommendations**: Gợi ý dịch vụ phù hợp

---

## 📞 Hỗ trợ

Nếu có thắc mắc về cấu trúc dịch vụ:
- **Email**: dev@adnlab.vn
- **Documentation**: Xem file này
- **Code Examples**: Trong folder `/examples`