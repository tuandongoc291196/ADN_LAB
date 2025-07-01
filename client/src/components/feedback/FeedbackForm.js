/**
 * Component biểu mẫu đánh giá dịch vụ
 * Cho phép người dùng gửi đánh giá và nhận xét về dịch vụ đã sử dụng
 */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

/**
 * Component FeedbackForm hiển thị form đánh giá dịch vụ
 * @param {Object} user - Thông tin người dùng hiện tại
 */
const FeedbackForm = ({ user }) => {
  // Lấy ID dịch vụ từ tham số URL
  const { serviceId } = useParams();
  
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });
  
  // State quản lý trạng thái form
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Xử lý sự kiện thay đổi giá trị trong form
   * @param {Event} e - Sự kiện thay đổi input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Xử lý sự kiện gửi form đánh giá
   * @param {Event} e - Sự kiện submit form
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Giả lập gọi API - sẽ được thay thế bằng gọi API thực tế
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      // Reset form sau khi gửi thành công
      setFormData({
        rating: 5,
        comment: '',
      });
    } catch (err) {
      setError('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Đánh giá dịch vụ</h1>
      <Card>
        <Card.Body>
          {/* Thông báo thành công */}
          {success && (
            <Alert variant="success" className="mb-4">
              Cảm ơn bạn đã gửi đánh giá! Phản hồi của bạn rất quan trọng với chúng tôi.
            </Alert>
          )}
          
          {/* Thông báo lỗi */}
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          {/* Form đánh giá */}
          <Form onSubmit={handleSubmit}>
            {/* Trường hiển thị ID dịch vụ */}
            <Form.Group className="mb-3">
              <Form.Label>Dịch vụ</Form.Label>
              <Form.Control
                type="text"
                value={`Dịch vụ ID: ${serviceId}`}
                disabled
              />
            </Form.Group>
            
            {/* Trường chọn đánh giá sao */}
            <Form.Group className="mb-3">
              <Form.Label>Đánh giá</Form.Label>
              <Form.Select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                disabled={loading || success}
              >
                <option value="5">5 sao - Rất hài lòng</option>
                <option value="4">4 sao - Hài lòng</option>
                <option value="3">3 sao - Bình thường</option>
                <option value="2">2 sao - Không hài lòng</option>
                <option value="1">1 sao - Rất không hài lòng</option>
              </Form.Select>
            </Form.Group>
            
            {/* Trường nhập nhận xét */}
            <Form.Group className="mb-4">
              <Form.Label>Nhận xét</Form.Label>
              <Form.Control
                as="textarea"
                name="comment"
                rows={4}
                placeholder="Nhập nhận xét của bạn về dịch vụ..."
                value={formData.comment}
                onChange={handleChange}
                disabled={loading || success}
              />
            </Form.Group>
            
            {/* Nút gửi đánh giá */}
            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                disabled={loading || success}
              >
                {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FeedbackForm; 