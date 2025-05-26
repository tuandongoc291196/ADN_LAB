import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerWithEmailAndPassword } from '../config/firebase';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const validateForm = () => {
    // Password should be at least 6 characters
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    // Passwords should match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    
    // Terms should be accepted
    if (!formData.agreeTerms) {
      setError('Vui lòng chấp nhận điều khoản dịch vụ');
      return false;
    }
    
    // Phone number validation (simple example)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Use Firebase authentication
      await registerWithEmailAndPassword(
        formData.fullName,
        formData.phone,
        formData.email,
        formData.password
      );
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      // Handle Firebase authentication errors
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Định dạng email không hợp lệ.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
            break;
          default:
            errorMessage = err.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
        }
      }
      
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-row">
        <div className="register-col">
          <div className="register-card">
            <div className="register-card-body">
              <div className="register-header">
                <h2 className="register-title">Đăng ký tài khoản</h2>
                <p className="register-subtitle">Tạo tài khoản để sử dụng dịch vụ xét nghiệm ADN</p>
              </div>
              
              {error && (
                <div className="register-alert register-alert-danger">{error}</div>
              )}
              {success && (
                <div className="register-alert register-alert-success">
                  Đăng ký tài khoản thành công! Vui lòng chờ trong giây lát, hệ thống sẽ chuyển đến trang đăng nhập.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="register-form-row">
                  <div className="register-form-col">
                    <div className="register-form-group">
                      <label className="register-form-label" htmlFor="fullName">Họ và tên</label>
                      <input
                        className="register-form-control"
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Nhập họ và tên đầy đủ"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                      />
                    </div>
                  </div>
                  <div className="register-form-col">
                    <div className="register-form-group">
                      <label className="register-form-label" htmlFor="phone">Số điện thoại</label>
                      <input
                        className="register-form-control"
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="register-form-group">
                  <label className="register-form-label" htmlFor="email">Email</label>
                  <input
                    className="register-form-control"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                  />
                </div>
                
                <div className="register-form-row">
                  <div className="register-form-col">
                    <div className="register-form-group">
                      <label className="register-form-label" htmlFor="password">Mật khẩu</label>
                      <input
                        className="register-form-control"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                      />
                    </div>
                  </div>
                  <div className="register-form-col">
                    <div className="register-form-group">
                      <label className="register-form-label" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                      <input
                        className="register-form-control"
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="register-checkbox-group">
                  <div className="register-checkbox">
                    <label className="register-checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                      />
                      Tôi đồng ý với{' '}
                      <Link to="/terms" target="_blank" className="register-checkbox-link">
                        Điều khoản dịch vụ
                      </Link>{' '}
                      và{' '}
                      <Link to="/privacy" target="_blank" className="register-checkbox-link">
                        Chính sách bảo mật
                      </Link>
                    </label>
                  </div>
                </div>
                
                <div className="register-submit-container">
                  <button
                    className="register-submit-btn"
                    type="submit"
                    disabled={loading || success}
                  >
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                  </button>
                </div>
              </form>
              
              <div className="register-footer">
                <p>
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="register-footer-link">
                    Đăng nhập
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 