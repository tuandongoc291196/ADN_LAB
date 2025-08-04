/**
 * COMPONENT: BlogEditor
 * CHỨC NĂNG: Form tạo và chỉnh sửa bài viết blog cho admin
 * LUỒNG HOẠT ĐỘNG:
 * 1. Kiểm tra quyền admin từ user context
 * 2. Nếu edit mode, tải dữ liệu blog từ API getBlogById()
 * 3. Hiển thị form với rich text editor
 * 4. Upload hình ảnh lên Firebase Storage
 * 5. Validate form trước khi lưu
 * 6. Lưu bài viết qua API addBlog() hoặc updateBlog()
 * 7. Preview bài viết trước khi xuất bản
 * 8. Quản lý trạng thái active/inactive
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Form, Alert, Badge, Tab, Nav, Modal, ButtonGroup, Dropdown } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../config/firebase';
import { addBlog, getBlogById, updateBlog } from '../../services/api';
import { useAuth } from '../context/auth';

const BlogEditor = () => {
  // ROUTER HOOKS
  const { id } = useParams(); // ID bài viết (nếu edit mode)
  const navigate = useNavigate(); // Hook điều hướng
  
  // AUTH CONTEXT
  const { user } = useAuth(); // Context authentication
  
  // COMPUTED VALUES
  const isEditMode = !!id; // Xác định mode tạo mới hay chỉnh sửa
  
  // REFS
  const contentRef = useRef(null); // Ref cho rich text editor
  
  // STATE QUẢN LÝ UI
  const [loading, setLoading] = useState(isEditMode); // Loading state
  const [isSaving, setIsSaving] = useState(false); // Loading state khi lưu
  const [message, setMessage] = useState({ type: '', content: '' }); // Thông báo
  const [showPreview, setShowPreview] = useState(false); // Hiển thị preview
  
  // STATE QUẢN LÝ HÌNH ẢNH
  const [selectedImageFile, setSelectedImageFile] = useState(null); // File hình ảnh được chọn
  const [imagePreview, setImagePreview] = useState(''); // URL preview hình ảnh
  
  // STATE QUẢN LÝ FORM DATA
  const [formData, setFormData] = useState({
    title: '',           // Tiêu đề bài viết
    content: '',         // Nội dung bài viết
    imageUrl: '',        // URL hình ảnh đại diện
    isActive: true,      // Trạng thái active/inactive
  });

  /**
   * EFFECT: Kiểm tra quyền và tải dữ liệu blog (nếu edit mode)
   * BƯỚC 1: Kiểm tra nếu user đã đăng nhập
   * BƯỚC 2: Nếu chưa đăng nhập, redirect về trang login
   * BƯỚC 3: Nếu là edit mode, gọi fetchBlog() để tải dữ liệu
   */
  useEffect(() => {
    if (!user?.id && !user?.user_id) {
      navigate('/login');
      return;
    }
    if (isEditMode) {
      fetchBlog();
    }
  }, [user, id]);

  /**
   * API CALL: Tải dữ liệu blog từ API (edit mode)
   * BƯỚC 1: Gọi API getBlogById() với ID bài viết
   * BƯỚC 2: Kiểm tra nếu có blog data
   * BƯỚC 3: Cập nhật formData với dữ liệu blog
   * BƯỚC 4: Set imagePreview nếu có hình ảnh
   * BƯỚC 5: Xử lý lỗi nếu có
   * BƯỚC 6: Set loading state thành false
   */
  const fetchBlog = async () => {
    try {
      // BƯỚC 1: Gọi API getBlogById() với ID bài viết
      const blog = await getBlogById(id);
      // BƯỚC 2: Kiểm tra nếu có blog data
      if (!blog) {
        setMessage({ type: 'danger', content: 'Không tìm thấy bài viết!' });
        return;
      }
      // BƯỚC 3: Cập nhật formData với dữ liệu blog
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        imageUrl: blog.imageUrl || '',
        isActive: blog.isActive !== undefined ? blog.isActive : true,
      });
      // BƯỚC 4: Set imagePreview nếu có hình ảnh
      if (blog.imageUrl) {
        setImagePreview(blog.imageUrl);
      }
    } catch (error) {
      // BƯỚC 5: Xử lý lỗi nếu có
      setMessage({ type: 'danger', content: 'Lỗi khi tải bài viết: ' + error.message });
    } finally {
      // BƯỚC 6: Set loading state thành false
      setLoading(false);
    }
  };

  /**
   * EVENT HANDLER: Cập nhật form data
   * INPUT: field (string) - tên field, value (any) - giá trị mới
   * BƯỚC 1: Cập nhật formData với field và value mới
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * HELPER FUNCTION: Thực hiện command cho rich text editor
   * INPUT: command (string) - tên command, value (string) - giá trị (optional)
   * BƯỚC 1: Gọi document.execCommand() với command và value
   * BƯỚC 2: Focus vào contentRef
   */
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current.focus();
  };

  /**
   * HELPER FUNCTION: Chèn HTML vào editor
   * INPUT: html (string) - HTML cần chèn
   * BƯỚC 1: Gọi document.execCommand() với 'insertHTML'
   * BƯỚC 2: Focus vào contentRef
   */
  const insertHTML = (html) => {
    document.execCommand('insertHTML', false, html);
    contentRef.current.focus();
  };

  /**
   * EVENT HANDLER: Upload hình ảnh
   * INPUT: e (event) - event từ input file
   * BƯỚC 1: Lấy file từ event
   * BƯỚC 2: Kiểm tra file type (chỉ chấp nhận image)
   * BƯỚC 3: Set selectedImageFile và tạo preview
   * BƯỚC 4: Xử lý lỗi nếu có
   */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // BƯỚC 2: Kiểm tra file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'danger', content: 'Chỉ chấp nhận file hình ảnh!' });
        return;
      }
      
      // BƯỚC 3: Set selectedImageFile và tạo preview
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * HELPER FUNCTION: Validate form trước khi lưu
   * OUTPUT: boolean - true nếu form hợp lệ, false nếu không
   * BƯỚC 1: Kiểm tra title không được rỗng
   * BƯỚC 2: Kiểm tra content không được rỗng
   * BƯỚC 3: Kiểm tra độ dài title (tối thiểu 10 ký tự)
   * BƯỚC 4: Kiểm tra độ dài content (tối thiểu 50 ký tự)
   * BƯỚC 5: Return true nếu tất cả điều kiện đều hợp lệ
   */
  const validateForm = () => {
    // BƯỚC 1: Kiểm tra title không được rỗng
    if (!formData.title.trim()) {
      setMessage({ type: 'danger', content: 'Vui lòng nhập tiêu đề bài viết!' });
      return false;
    }
    
    // BƯỚC 2: Kiểm tra content không được rỗng
    if (!formData.content.trim()) {
      setMessage({ type: 'danger', content: 'Vui lòng nhập nội dung bài viết!' });
      return false;
    }
    
    // BƯỚC 3: Kiểm tra độ dài title
    if (formData.title.trim().length < 10) {
      setMessage({ type: 'danger', content: 'Tiêu đề phải có ít nhất 10 ký tự!' });
      return false;
    }
    
    // BƯỚC 4: Kiểm tra độ dài content
    if (formData.content.trim().length < 50) {
      setMessage({ type: 'danger', content: 'Nội dung phải có ít nhất 50 ký tự!' });
      return false;
    }
    
    // BƯỚC 5: Return true nếu tất cả điều kiện đều hợp lệ
    return true;
  };

  /**
   * HELPER FUNCTION: Upload hình ảnh lên Firebase Storage
   * INPUT: file (File) - file hình ảnh cần upload
   * OUTPUT: Promise<string> - URL của hình ảnh đã upload
   * BƯỚC 1: Tạo storage reference với tên file unique
   * BƯỚC 2: Upload file lên Firebase Storage
   * BƯỚC 3: Lấy download URL
   * BƯỚC 4: Return URL
   */
  const uploadImageAndGetURL = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `blog-images/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress tracking (có thể thêm progress bar ở đây)
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  /**
   * EVENT HANDLER: Lưu bài viết
   * INPUT: publish (boolean) - true nếu xuất bản, false nếu lưu nháp
   * BƯỚC 1: Validate form
   * BƯỚC 2: Set isSaving thành true
   * BƯỚC 3: Upload hình ảnh nếu có
   * BƯỚC 4: Chuẩn bị dữ liệu để lưu
   * BƯỚC 5: Gọi API addBlog() hoặc updateBlog()
   * BƯỚC 6: Hiển thị thông báo thành công
   * BƯỚC 7: Navigate về trang blog management
   * BƯỚC 8: Xử lý lỗi nếu có
   * BƯỚC 9: Set isSaving thành false
   */
  const handleSave = async (publish = false) => {
    // BƯỚC 1: Validate form
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      let imageUrl = formData.imageUrl;
      
      // BƯỚC 3: Upload hình ảnh nếu có
      if (selectedImageFile) {
        imageUrl = await uploadImageAndGetURL(selectedImageFile);
      }
      
      // BƯỚC 4: Chuẩn bị dữ liệu để lưu
      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageUrl: imageUrl,
        isActive: publish ? true : formData.isActive,
        publishedAt: publish ? new Date().toISOString() : null
      };
      
      // BƯỚC 5: Gọi API addBlog() hoặc updateBlog()
      if (isEditMode) {
        await updateBlog(id, blogData);
      } else {
        await addBlog(blogData);
      }
      
      // BƯỚC 6: Hiển thị thông báo thành công
      setMessage({ 
        type: 'success', 
        content: `Bài viết đã được ${publish ? 'xuất bản' : 'lưu'} thành công!` 
      });
      
      // BƯỚC 7: Navigate về trang blog management
      setTimeout(() => {
        navigate('/admin/blog');
      }, 1500);
      
    } catch (error) {
      // BƯỚC 8: Xử lý lỗi nếu có
      setMessage({ 
        type: 'danger', 
        content: `Lỗi khi ${publish ? 'xuất bản' : 'lưu'} bài viết: ` + error.message 
      });
    } finally {
      // BƯỚC 9: Set isSaving thành false
      setIsSaving(false);
    }
  };

  /**
   * EVENT HANDLER: Preview bài viết
   * BƯỚC 1: Validate form
   * BƯỚC 2: Hiển thị modal preview
   */
  const handlePreview = () => {
    if (!validateForm()) return;
    setShowPreview(true);
  };

  return (
    <div>
      {/* HEADER: Tiêu đề trang */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">{isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
          <p className="text-muted mb-0">
            {isEditMode ? 'Chỉnh sửa nội dung và cài đặt bài viết' : 'Tạo bài viết blog mới cho hệ thống'}
          </p>
        </div>
        <div>
          <Button variant="outline-secondary" onClick={() => navigate('/admin/blog')} className="me-2">
            <i className="bi bi-arrow-left me-2"></i>Quay lại
          </Button>
          <Button variant="outline-info" onClick={handlePreview} className="me-2">
            <i className="bi bi-eye me-2"></i>Xem trước
          </Button>
          <Button 
            variant="success" 
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            {isSaving ? 'Đang lưu...' : 'Xuất bản'}
          </Button>
        </div>
      </div>

      {/* ALERT: Hiển thị thông báo */}
      {message.content && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', content: '' })} dismissible>
          {message.content}
        </Alert>
      )}

      {/* LOADING STATE: Hiển thị loading */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Đang tải dữ liệu bài viết...</p>
        </div>
      ) : (
        <Row>
          {/* MAIN EDITOR: Form chỉnh sửa chính */}
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Body>
                {/* TITLE FIELD: Trường tiêu đề */}
                <Form.Group className="mb-4">
                  <Form.Label>Tiêu đề bài viết *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="fs-5"
                  />
                  <Form.Text className="text-muted">
                    Tiêu đề nên ngắn gọn, rõ ràng và hấp dẫn (10-100 ký tự)
                  </Form.Text>
                </Form.Group>

                {/* CONTENT EDITOR: Rich text editor */}
                <Form.Group className="mb-4">
                  <Form.Label>Nội dung bài viết *</Form.Label>
                  
                  {/* TOOLBAR: Thanh công cụ định dạng */}
                  <div className="border rounded-top p-2 bg-light">
                    <ButtonGroup size="sm" className="me-2">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => execCommand('bold')}
                        title="In đậm"
                      >
                        <i className="bi bi-type-bold"></i>
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => execCommand('italic')}
                        title="In nghiêng"
                      >
                        <i className="bi bi-type-italic"></i>
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => execCommand('underline')}
                        title="Gạch chân"
                      >
                        <i className="bi bi-type-underline"></i>
                      </Button>
                    </ButtonGroup>
                    
                    <ButtonGroup size="sm" className="me-2">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => execCommand('insertUnorderedList')}
                        title="Danh sách không thứ tự"
                      >
                        <i className="bi bi-list-ul"></i>
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => execCommand('insertOrderedList')}
                        title="Danh sách có thứ tự"
                      >
                        <i className="bi bi-list-ol"></i>
                      </Button>
                    </ButtonGroup>
                    
                    <ButtonGroup size="sm" className="me-2">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => insertHTML('<h2>Tiêu đề</h2>')}
                        title="Tiêu đề H2"
                      >
                        H2
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => insertHTML('<h3>Tiêu đề</h3>')}
                        title="Tiêu đề H3"
                      >
                        H3
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => insertHTML('<p>Đoạn văn</p>')}
                        title="Đoạn văn"
                      >
                        P
                      </Button>
                    </ButtonGroup>
                    
                    <ButtonGroup size="sm">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => insertHTML('<blockquote>Trích dẫn</blockquote>')}
                        title="Trích dẫn"
                      >
                        <i className="bi bi-quote"></i>
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => insertHTML('<hr>')}
                        title="Đường kẻ ngang"
                      >
                        <i className="bi bi-dash"></i>
                      </Button>
                    </ButtonGroup>
                  </div>
                  
                  {/* EDITOR AREA: Khu vực soạn thảo */}
                  <div
                    ref={contentRef}
                    contentEditable
                    className="border rounded-bottom p-3"
                    style={{ 
                      minHeight: '400px', 
                      maxHeight: '600px', 
                      overflowY: 'auto',
                      outline: 'none'
                    }}
                    onInput={(e) => handleInputChange('content', e.target.innerHTML)}
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                    placeholder="Nhập nội dung bài viết..."
                  />
                  
                  <Form.Text className="text-muted">
                    Nội dung nên chi tiết, có cấu trúc rõ ràng (tối thiểu 50 ký tự)
                  </Form.Text>
                </Form.Group>

                {/* SAVE BUTTONS: Nút lưu */}
                <div className="d-flex justify-content-end gap-2">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => handleSave(false)}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Đang lưu...' : 'Lưu nháp'}
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Đang lưu...' : 'Xuất bản'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* SIDEBAR: Cài đặt và hình ảnh */}
          <Col lg={4}>
            {/* IMAGE UPLOAD: Upload hình ảnh */}
            <Card className="shadow-sm mb-4">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="bi bi-image me-2"></i>
                  Hình ảnh đại diện
                </h6>
              </Card.Header>
              <Card.Body>
                {imagePreview && (
                  <div className="mb-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  </div>
                )}
                
                <Form.Group>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-2"
                  />
                  <Form.Text className="text-muted">
                    Chọn hình ảnh đại diện cho bài viết (JPG, PNG, GIF)
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>

            {/* SETTINGS: Cài đặt bài viết */}
            <Card className="shadow-sm">
              <Card.Header>
                <h6 className="mb-0">
                  <i className="bi bi-gear me-2"></i>
                  Cài đặt
                </h6>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Check
                    type="switch"
                    id="active-switch"
                    label="Hiển thị bài viết"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  />
                  <Form.Text className="text-muted">
                    Bật/tắt hiển thị bài viết trên website
                  </Form.Text>
                </Form.Group>
                
                <hr />
                
                <div className="text-muted small">
                  <p><strong>Hướng dẫn:</strong></p>
                  <ul className="mb-0">
                    <li>Tiêu đề: 10-100 ký tự</li>
                    <li>Nội dung: Tối thiểu 50 ký tự</li>
                    <li>Hình ảnh: JPG, PNG, GIF</li>
                    <li>Định dạng: Hỗ trợ HTML cơ bản</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* PREVIEW MODAL: Modal xem trước */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Xem trước bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="blog-preview">
            <h2>{formData.title}</h2>
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="img-fluid rounded mb-3"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: formData.content }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Đóng
          </Button>
          <Button variant="success" onClick={() => {
            setShowPreview(false);
            handleSave(true);
          }}>
            Xuất bản
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BlogEditor;