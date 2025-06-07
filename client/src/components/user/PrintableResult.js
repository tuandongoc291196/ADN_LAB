import React from 'react';
import { Badge, Alert } from 'react-bootstrap';

const PrintableResult = ({ resultData, className = "" }) => {
  if (!resultData) return null;

  const getResultBadge = (conclusion) => {
    switch (conclusion) {
      case 'POSITIVE':
        return <Badge bg="success" className="fs-6">XÁC NHẬN QUAN HỆ</Badge>;
      case 'NEGATIVE':
        return <Badge bg="danger" className="fs-6">LOẠI TRỪ QUAN HỆ</Badge>;
      case 'INCONCLUSIVE':
        return <Badge bg="warning" className="fs-6">KHÔNG KẾT LUẬN</Badge>;
      default:
        return <Badge bg="secondary" className="fs-6">CHƯA XÁC ĐỊNH</Badge>;
    }
  };

  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative' 
      ? <Badge bg="warning" text="dark">Có giá trị pháp lý</Badge>
      : <Badge bg="info">Dân sự</Badge>;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className={`printable-result ${className}`}>
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .printable-result, .printable-result * {
            visibility: visible;
          }
          
          .printable-result {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            font-size: 12px;
            line-height: 1.4;
            color: #000 !important;
            background: #fff !important;
          }
          
          .printable-result h3 {
            font-size: 18px;
            margin-bottom: 10px;
          }
          
          .printable-result h4 {
            font-size: 16px;
            margin-bottom: 8px;
          }
          
          .printable-result h5, .printable-result h6 {
            font-size: 14px;
            margin-bottom: 6px;
          }
          
          .printable-result table {
            font-size: 11px;
            border-collapse: collapse;
            width: 100%;
          }
          
          .printable-result table td,
          .printable-result table th {
            border: 1px solid #ccc;
            padding: 4px 6px;
            text-align: left;
          }
          
          .printable-result .alert {
            border: 2px solid #000 !important;
            background-color: #f8f9fa !important;
            color: #000 !important;
            padding: 10px;
            margin: 10px 0;
          }
          
          .printable-result .badge {
            border: 1px solid #000 !important;
            background-color: #fff !important;
            color: #000 !important;
            padding: 2px 6px;
            font-weight: bold;
          }
          
          .printable-result .border-bottom {
            border-bottom: 2px solid #000 !important;
            margin-bottom: 15px;
            padding-bottom: 10px;
          }
          
          .printable-result .border-top {
            border-top: 1px solid #000 !important;
            margin-top: 15px;
            padding-top: 10px;
          }
          
          .no-print {
            display: none !important;
          }
        }
        
        @page {
          margin: 2cm;
          size: A4;
        }
      `}</style>

      {/* Header */}
      <div className="text-center mb-4 border-bottom pb-3">
        <h3 className="fw-bold">TRUNG TÂM XÉT NGHIỆM ADN LAB</h3>
        <p className="mb-1">123 Đường ABC, Quận XYZ, Hà Nội</p>
        <p className="mb-1">Hotline: 1900 1234 | Email: info@adnlab.vn</p>
        <h4 className="text-primary mt-3 mb-2 fw-bold">KẾT QUẢ XÉT NGHIỆM ADN</h4>
        <p className="mb-0">Mã xét nghiệm: <strong>{resultData.id}</strong></p>
      </div>

      {/* Basic Information */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h6 className="fw-bold mb-3">THÔNG TIN CHUNG</h6>
          <table className="table table-borderless table-sm">
            <tbody>
              <tr>
                <td style={{ width: '40%' }}><strong>Dịch vụ:</strong></td>
                <td>{resultData.service}</td>
              </tr>
              <tr>
                <td><strong>Loại xét nghiệm:</strong></td>
                <td>{getServiceTypeBadge(resultData.serviceType)}</td>
              </tr>
              <tr>
                <td><strong>Ngày lấy mẫu:</strong></td>
                <td>{formatDate(resultData.appointmentDate)}</td>
              </tr>
              <tr>
                <td><strong>Ngày có kết quả:</strong></td>
                <td>{formatDate(resultData.completionDate)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h6 className="fw-bold mb-3">THÔNG TIN KỸ THUẬT</h6>
          <table className="table table-borderless table-sm">
            <tbody>
              <tr>
                <td style={{ width: '40%' }}><strong>Phương pháp:</strong></td>
                <td>{resultData.result.method}</td>
              </tr>
              <tr>
                <td><strong>Loại mẫu:</strong></td>
                <td>{resultData.result.sampleType}</td>
              </tr>
              <tr>
                <td><strong>Mã phòng lab:</strong></td>
                <td>{resultData.result.labCode}</td>
              </tr>
              <tr>
                <td><strong>Kỹ thuật viên:</strong></td>
                <td>{resultData.result.technician}</td>
              </tr>
              {resultData.result.gestationalAge && (
                <tr>
                  <td><strong>Tuổi thai:</strong></td>
                  <td>{resultData.result.gestationalAge}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participants Information */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">THÔNG TIN NGƯỜI THAM GIA</h6>
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Họ và tên</th>
              <th>Vai trò</th>
              <th>Mối quan hệ</th>
              <th>Loại mẫu</th>
            </tr>
          </thead>
          <tbody>
            {resultData.participants.map((participant, index) => (
              <tr key={index}>
                <td><strong>{participant.name}</strong></td>
                <td>{participant.role}</td>
                <td>{participant.relationship}</td>
                <td>{resultData.result.sampleType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Main Result */}
      <div className="mb-4 p-4 border rounded">
        <h5 className="text-center fw-bold mb-3">
          KẾT QUẢ XÉT NGHIỆM
        </h5>
        
        <div className="text-center mb-4">
          {getResultBadge(resultData.result.conclusion)}
          <div className="h4 text-primary mt-2 fw-bold">
            Độ chính xác: {resultData.result.confidence}
          </div>
        </div>

        <Alert 
          variant={
            resultData.result.conclusion === 'POSITIVE' ? 'success' : 
            resultData.result.conclusion === 'NEGATIVE' ? 'danger' : 'warning'
          }
          className="text-center"
        >
          <div className="fw-bold h6 mb-2">KẾT LUẬN:</div>
          <p className="mb-0 fw-bold">{resultData.result.summary}</p>
        </Alert>

        <div className="mt-3">
          <h6 className="fw-bold">Chi tiết kết quả:</h6>
          <p className="mb-0">{resultData.result.details}</p>
        </div>
      </div>

      {/* Legal Notice */}
      {resultData.result.hasLegalValue && (
        <Alert variant="warning" className="mb-4">
          <strong>GIÁ TRỊ PHÁP LÝ:</strong> Kết quả này có đầy đủ giá trị pháp lý và được 
          công nhận bởi các cơ quan tòa án, cơ quan nhà nước trong các thủ tục hành chính.
        </Alert>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-top text-center">
        <p className="mb-1">
          <strong>Địa chỉ phòng lab:</strong> 123 Đường ABC, Quận XYZ, Hà Nội
        </p>
        <p className="mb-1">
          Kết quả được ký và xác nhận bởi: <strong>{resultData.result.technician}</strong>
        </p>
        <p className="mb-1">
          <strong>Ngày in:</strong> {new Date().toLocaleDateString('vi-VN')}
        </p>
        <p className="mb-0">
          <em>Mọi thắc mắc xin liên hệ hotline: 1900 1234</em>
        </p>
      </div>
    </div>
  );
};

// Utility function để in kết quả
export const printResult = (resultData) => {
  // Tạo cửa sổ mới để in
  const printWindow = window.open('', '_blank');
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Kết quả xét nghiệm ${resultData.id}</title>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
          background: #fff;
        }
        
        h3 { font-size: 18px; margin-bottom: 10px; text-align: center; }
        h4 { font-size: 16px; margin-bottom: 8px; }
        h5, h6 { font-size: 14px; margin-bottom: 6px; }
        
        table {
          font-size: 11px;
          border-collapse: collapse;
          width: 100%;
          margin-bottom: 10px;
        }
        
        table td, table th {
          border: 1px solid #ccc;
          padding: 4px 6px;
          text-align: left;
        }
        
        .table-borderless td {
          border: none;
          padding: 2px 6px;
        }
        
        .alert {
          border: 2px solid #000;
          background-color: #f8f9fa;
          padding: 10px;
          margin: 10px 0;
          text-align: center;
        }
        
        .badge {
          border: 1px solid #000;
          background-color: #fff;
          color: #000;
          padding: 2px 6px;
          font-weight: bold;
          font-size: 10px;
        }
        
        .border-bottom {
          border-bottom: 2px solid #000;
          margin-bottom: 15px;
          padding-bottom: 10px;
        }
        
        .border-top {
          border-top: 1px solid #000;
          margin-top: 15px;
          padding-top: 10px;
        }
        
        .text-center { text-align: center; }
        .fw-bold { font-weight: bold; }
        .mb-1 { margin-bottom: 0.25rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-3 { margin-bottom: 1rem; }
        .mb-4 { margin-bottom: 1.5rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-3 { margin-top: 1rem; }
        .mt-4 { margin-top: 1.5rem; }
        .p-4 { padding: 1.5rem; }
        .pt-3 { padding-top: 1rem; }
        .pb-3 { padding-bottom: 1rem; }
        
        @page {
          margin: 2cm;
          size: A4;
        }
      </style>
    </head>
    <body>
      ${generatePrintHTML(resultData)}
    </body>
    </html>
  `;
  
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  
  // Đợi một chút để nội dung load xong rồi in
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

// Function để tạo HTML cho in
const generatePrintHTML = (resultData) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getResultText = (conclusion) => {
    switch (conclusion) {
      case 'POSITIVE': return 'XÁC NHẬN QUAN HỆ';
      case 'NEGATIVE': return 'LOẠI TRỪ QUAN HỆ';
      case 'INCONCLUSIVE': return 'KHÔNG KẾT LUẬN';
      default: return 'CHƯA XÁC ĐỊNH';
    }
  };

  const getServiceTypeText = (serviceType) => {
    return serviceType === 'administrative' ? 'Có giá trị pháp lý' : 'Dân sự';
  };

  return `
    <div class="border-bottom pb-3 mb-4">
      <h3 class="fw-bold">TRUNG TÂM XÉT NGHIỆM ADN LAB</h3>
      <p class="mb-1">123 Đường ABC, Quận XYZ, Hà Nội</p>
      <p class="mb-1">Hotline: 1900 1234 | Email: info@adnlab.vn</p>
      <h4 class="mt-3 mb-2 fw-bold">KẾT QUẢ XÉT NGHIỆM ADN</h4>
      <p class="mb-0">Mã xét nghiệm: <strong>${resultData.id}</strong></p>
    </div>

    <div style="display: flex; margin-bottom: 1.5rem;">
      <div style="width: 50%; padding-right: 15px;">
        <h6 class="fw-bold mb-3">THÔNG TIN CHUNG</h6>
        <table class="table-borderless">
          <tr><td style="width: 40%;"><strong>Dịch vụ:</strong></td><td>${resultData.service}</td></tr>
          <tr><td><strong>Loại:</strong></td><td>${getServiceTypeText(resultData.serviceType)}</td></tr>
          <tr><td><strong>Ngày lấy mẫu:</strong></td><td>${formatDate(resultData.appointmentDate)}</td></tr>
          <tr><td><strong>Ngày có KQ:</strong></td><td>${formatDate(resultData.completionDate)}</td></tr>
        </table>
      </div>
      <div style="width: 50%; padding-left: 15px;">
        <h6 class="fw-bold mb-3">THÔNG TIN KỸ THUẬT</h6>
        <table class="table-borderless">
          <tr><td style="width: 40%;"><strong>Phương pháp:</strong></td><td>${resultData.result.method}</td></tr>
          <tr><td><strong>Loại mẫu:</strong></td><td>${resultData.result.sampleType}</td></tr>
          <tr><td><strong>Mã lab:</strong></td><td>${resultData.result.labCode}</td></tr>
          <tr><td><strong>KTV:</strong></td><td>${resultData.result.technician}</td></tr>
          ${resultData.result.gestationalAge ? `<tr><td><strong>Tuổi thai:</strong></td><td>${resultData.result.gestationalAge}</td></tr>` : ''}
        </table>
      </div>
    </div>

    <div class="mb-4">
      <h6 class="fw-bold mb-3">THÔNG TIN NGƯỜI THAM GIA</h6>
      <table>
        <thead>
          <tr><th>Họ và tên</th><th>Vai trò</th><th>Mối quan hệ</th><th>Loại mẫu</th></tr>
        </thead>
        <tbody>
          ${resultData.participants.map(p => `
            <tr>
              <td><strong>${p.name}</strong></td>
              <td>${p.role}</td>
              <td>${p.relationship}</td>
              <td>${resultData.result.sampleType}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="mb-4 p-4" style="border: 2px solid #000;">
      <h5 class="text-center fw-bold mb-3">KẾT QUẢ XÉT NGHIỆM</h5>
      
      <div class="text-center mb-4">
        <div class="badge fw-bold" style="font-size: 14px; padding: 8px 16px;">
          ${getResultText(resultData.result.conclusion)}
        </div>
        <div class="mt-2 fw-bold" style="font-size: 16px;">
          Độ chính xác: ${resultData.result.confidence}
        </div>
      </div>

      <div class="alert">
        <div class="fw-bold mb-2">KẾT LUẬN:</div>
        <p class="mb-0 fw-bold">${resultData.result.summary}</p>
      </div>

      <div class="mt-3">
        <h6 class="fw-bold">Chi tiết kết quả:</h6>
        <p class="mb-0">${resultData.result.details}</p>
      </div>
    </div>

    ${resultData.result.hasLegalValue ? `
      <div class="alert mb-4">
        <strong>GIÁ TRỊ PHÁP LÝ:</strong> Kết quả này có đầy đủ giá trị pháp lý và được 
        công nhận bởi các cơ quan tòa án, cơ quan nhà nước trong các thủ tục hành chính.
      </div>
    ` : ''}

    <div class="mt-4 pt-3 border-top text-center">
      <p class="mb-1"><strong>Địa chỉ phòng lab:</strong> 123 Đường ABC, Quận XYZ, Hà Nội</p>
      <p class="mb-1">Kết quả được ký và xác nhận bởi: <strong>${resultData.result.technician}</strong></p>
      <p class="mb-1"><strong>Ngày in:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
      <p class="mb-0"><em>Mọi thắc mắc xin liên hệ hotline: 1900 1234</em></p>
    </div>
  `;
};

export default PrintableResult;