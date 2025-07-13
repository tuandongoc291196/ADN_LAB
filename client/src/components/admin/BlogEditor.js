/**
 * COMPONENT: BlogEditor
 * MỤC ĐÍCH: Form tạo và chỉnh sửa bài viết blog cho admin
 * CHỨC NĂNG:
 * - Tạo/chỉnh sửa bài viết với editor đơn giản
 * - Quản lý hình ảnh đại diện
 * - Xuất bản hoặc lưu bản nháp
 * - Quản lý trạng thái hiển thị
 * - Rich text editor với định dạng cơ bản
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Form, Alert, Badge, Tab, Nav, Modal, ButtonGroup, Dropdown } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../config/firebase';
import { addBlog, getBlogById, updateBlog } from '../../services/api';
import { useAuth } from '../context/auth';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { user } = useAuth();
  const contentRef = useRef(null);

  // Check user permissions
  useEffect(() => {
    if (!user?.id && !user?.user_id) {
      navigate('/login');
      return;
    }
    if (isEditMode) {
      fetchBlog();
    }
  }, [user, id]);

  const [loading, setLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isActive: true,
  });

  const [showPreview, setShowPreview] = useState(false);

  const fetchBlog = async () => {
    try {
      const blog = await getBlogById(id);
      if (!blog) {
        setMessage({ type: 'danger', content: 'Không tìm thấy bài viết!' });
        return;
      }
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        imageUrl: blog.imageUrl || '',
        isActive: blog.isActive !== undefined ? blog.isActive : true,
      });
      if (blog.imageUrl) {
        setImagePreview(blog.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setMessage({ type: 'danger', content: 'Lỗi khi tải bài viết: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    console.log('Input change:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Rich Text Editor Functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current.focus();
  };

  const insertHTML = (html) => {
    document.execCommand('insertHTML', false, html);
    contentRef.current.focus();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'danger', content: 'Chỉ chấp nhận file hình ảnh!' });
        return;
      }

      // Kiểm tra file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'danger', content: 'Kích thước file không được vượt quá 5MB!' });
        return;
      }

      setSelectedImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setMessage({ type: '', content: '' });
    }
  };

  const validateForm = () => {
    console.log('Validating form...');
    
    if (!user?.id && !user?.user_id) {
      console.log('User validation failed:', user);
      setMessage({ type: 'danger', content: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!' });
      return false;
    }
    
    if (!formData.title.trim()) {
      console.log('Title validation failed');
      setMessage({ type: 'danger', content: 'Tiêu đề bài viết không được để trống!' });
      return false;
    }
    
    if (!formData.content.trim()) {
      console.log('Content validation failed');
      setMessage({ type: 'danger', content: 'Nội dung bài viết không được để trống!' });
      return false;
    }

    console.log('Form validation passed');
    return true;
  };

  const uploadImageAndGetURL = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `blogs/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Có thể thêm logic xử lý progress bar ở đây
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const handleSave = async (publish = false) => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setMessage({ type: '', content: '' });

      let imageUrl = formData.imageUrl;

      // Upload image if new file is selected
      if (selectedImageFile) {
        console.log('Uploading new image...');
        imageUrl = await uploadImageAndGetURL(selectedImageFile);
        console.log('Image uploaded:', imageUrl);
      }

      const blogData = {
        userId: user.id || user.user_id,
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageUrl: imageUrl,
        isActive: formData.isActive
      };

      console.log('Saving blog data:', blogData);

      let response;
      if (isEditMode) {
        response = await updateBlog({ blogId: id, ...blogData });
      } else {
        response = await addBlog(blogData);
      }

      console.log('Save response:', response);

      setMessage({ 
        type: 'success', 
        content: isEditMode 
          ? 'Cập nhật bài viết thành công!' 
          : 'Tạo bài viết thành công!' 
      });

      // Redirect to blog management after a short delay
      setTimeout(() => {
        navigate('/admin/blog');
      }, 2000);

    } catch (error) {
      console.error('Error saving blog:', error);
      setMessage({ 
        type: 'danger', 
        content: 'Lỗi khi lưu bài viết: ' + error.message 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage({ type: 'warning', content: 'Vui lòng điền đầy đủ tiêu đề và nội dung để xem trước!' });
      return;
    }
    setShowPreview(true);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">{isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
              <p className="text-muted mb-0">
                {isEditMode ? 'Cập nhật thông tin bài viết' : 'Tạo bài viết blog mới'}
              </p>
            </div>
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/admin/blog')}
                className="me-2"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại
              </Button>
              <Button 
                variant="outline-primary" 
                onClick={handlePreview}
                disabled={isSaving}
              >
                <i className="bi bi-eye me-2"></i>
                Xem trước
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Message Alert */}
      {message.content && (
        <Alert variant={message.type} className="mb-4" dismissible onClose={() => setMessage({ type: '', content: '' })}>
          {message.content}
        </Alert>
      )}

      {/* Main Form */}
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">Thông tin bài viết</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                {/* Title */}
                <Form.Group className="mb-3">
                  <Form.Label>Tiêu đề bài viết *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tiêu đề bài viết..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Rich Text Editor Toolbar */}
                <Form.Group className="mb-3">
                  <Form.Label>Nội dung bài viết *</Form.Label>
                  <div className="border rounded mb-2">
                    <div className="bg-light p-2 border-bottom">
                      <ButtonGroup size="sm" className="me-2">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => execCommand('bold')}
                          title="Bold"
                        >
                          <i className="bi bi-type-bold"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => execCommand('italic')}
                          title="Italic"
                        >
                          <i className="bi bi-type-italic"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => execCommand('underline')}
                          title="Underline"
                        >
                          <i className="bi bi-type-underline"></i>
                        </Button>
                      </ButtonGroup>

                      <ButtonGroup size="sm" className="me-2">
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="bi bi-palette"></i> Màu sắc
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => execCommand('foreColor', '#000000')}>Đen</Dropdown.Item>
                            <Dropdown.Item onClick={() => execCommand('foreColor', '#ff0000')}>Đỏ</Dropdown.Item>
                            <Dropdown.Item onClick={() => execCommand('foreColor', '#0000ff')}>Xanh dương</Dropdown.Item>
                            <Dropdown.Item onClick={() => execCommand('foreColor', '#008000')}>Xanh lá</Dropdown.Item>
                            <Dropdown.Item onClick={() => execCommand('foreColor', '#ffa500')}>Cam</Dropdown.Item>
                            <Dropdown.Item onClick={() => execCommand('foreColor', '#800080')}>Tím</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="bi bi-type"></i> Cỡ chữ
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => execCommand('fontSize', '1')}>Nhỏ</Dropdown.Item>
                            <Dropdown.Item onClick={() => execCommand('fontSize', '3')}>Vừa</Dropdown.Item>
                            <Dropdown.Item onClick={() => execCommand('fontSize', '5')}>Lớn</Dropdown.Item>
                            <Dropdown.Item onClick={() => execCommand('fontSize', '7')}>Rất lớn</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </ButtonGroup>

                      <ButtonGroup size="sm" className="me-2">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => execCommand('justifyLeft')}
                          title="Căn trái"
                        >
                          <i className="bi bi-text-left"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => execCommand('justifyCenter')}
                          title="Căn giữa"
                        >
                          <i className="bi bi-text-center"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => execCommand('justifyRight')}
                          title="Căn phải"
                        >
                          <i className="bi bi-text-right"></i>
                        </Button>
                      </ButtonGroup>

                      <ButtonGroup size="sm">
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => insertHTML('<ul><li>Danh sách</li></ul>')}
                          title="Danh sách"
                        >
                          <i className="bi bi-list-ul"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => insertHTML('<blockquote>Trích dẫn</blockquote>')}
                          title="Trích dẫn"
                        >
                          <i className="bi bi-quote"></i>
                        </Button>
                      </ButtonGroup>
                    </div>
                    
                    {/* Rich Text Editor Content */}
                    <div
                      ref={contentRef}
                      contentEditable={true}
                      className="p-3"
                      style={{ 
                        minHeight: '300px', 
                        outline: 'none',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                      onInput={(e) => handleInputChange('content', e.target.innerHTML)}
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                      placeholder="Nhập nội dung bài viết..."
                    />
                  </div>
                  <Form.Text className="text-muted">
                    Sử dụng thanh công cụ trên để định dạng văn bản. Hỗ trợ: <strong>Bold</strong>, <em>Italic</em>, <u>Underline</u>, màu sắc, cỡ chữ, căn lề, danh sách.
                  </Form.Text>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Settings */}
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">Cài đặt</h5>
            </Card.Header>
            <Card.Body>
              {/* Status */}
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái hiển thị</Form.Label>
                <Form.Check
                  type="switch"
                  id="isActive"
                  label="Hiển thị bài viết"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
              </Form.Group>

              {/* Image Upload */}
              <Form.Group className="mb-3">
                <Form.Label>Hình ảnh đại diện</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Form.Text className="text-muted">
                  Chỉ chấp nhận file JPG, PNG. Kích thước tối đa 5MB.
                </Form.Text>
              </Form.Group>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3">
                  <Form.Label>Xem trước hình ảnh</Form.Label>
                  <div className="border rounded p-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Save Actions */}
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Thao tác</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid">
                <Button 
                  variant="success" 
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      {isEditMode ? 'Cập nhật' : 'Tạo bài viết'}
                    </>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Xem trước bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="blog-preview">
            <h2>{formData.title}</h2>
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt={formData.title} 
                className="img-fluid rounded mb-3"
              />
            )}
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: formData.content }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlogEditor;