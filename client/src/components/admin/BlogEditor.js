/**
 * COMPONENT: BlogEditor
 * MỤC ĐÍCH: Form tạo và chỉnh sửa bài viết blog cho admin
 * CHỨC NĂNG:
 * - Tạo/chỉnh sửa bài viết với editor WYSIWYG
 * - Quản lý hình ảnh đại diện và tags
 * - Cài đặt SEO (title, description, keywords)
 * - Xuất bản hoặc lưu bản nháp
 * - Lên lịch xuất bản
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Form, Alert, Badge, Tab, Nav, Modal } from 'react-bootstrap';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../config/firebase';
import { addBlog, getBlogById, updateBlog } from '../../services/api';
import { useAuth } from '../context/auth';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { user } = useAuth();

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
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    status: 'draft',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    publishDate: '',
  });

  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    'Xét nghiệm ADN',
    'Hướng dẫn',
    'Công nghệ',
    'Tin tức',
    'Khoa học',
    'Sức khỏe',
    'Gia đình'
  ];

  const fetchBlog = async () => {
    try {
      const blog = await getBlogById(id);
      if (!blog) {
        setMessage({ type: 'danger', content: 'Không tìm thấy bài viết!' });
        return;
      }
      setFormData({
        title: blog.title || '',
        slug: blog.slug || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || '',
        tags: blog.tags || [],
        status: blog.status || 'draft',
        featured: blog.featured || false,
        seoTitle: blog.seoTitle || '',
        seoDescription: blog.seoDescription || '',
        seoKeywords: blog.seoKeywords || '',
        publishDate: blog.publishDate || '',
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
    
    if (field === 'title') {
      // Tự động tạo slug từ title
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Loại bỏ ký tự đặc biệt
        .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
        .replace(/-+/g, '-'); // Loại bỏ nhiều dấu gạch ngang liên tiếp
      
      console.log('Generated slug:', slug);
      
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: slug
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
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
          console.error("Upload failed:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSave = async (status = 'draft') => {
    console.log('Starting save with status:', status);

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', content: '' });

    try {
      const userId = user?.id || user?.user_id;
      if (!userId) {
        throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!');
      }

      let imageUrl = isEditMode ? formData.imageUrl : '';

      // Nếu có file ảnh mới được chọn, upload nó trước
      if (selectedImageFile) {
        setMessage({ type: 'info', content: 'Đang tải ảnh lên...' });
        imageUrl = await uploadImageAndGetURL(selectedImageFile);
        setMessage({ type: '', content: '' });
      }

      const blogData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        status: status,
        userId: userId,
        imageUrl: imageUrl, // Gửi link ảnh đã upload (hoặc link cũ)
        // Thêm các trường khác nếu cần
        slug: formData.slug?.trim() || formData.title.trim().toLowerCase().replace(/\s+/g, '-'),
        excerpt: formData.excerpt?.trim(),
        category: formData.category?.trim(),
        tags: formData.tags,
        seoTitle: formData.seoTitle?.trim(),
        seoDescription: formData.seoDescription?.trim(),
        seoKeywords: formData.seoKeywords?.trim(),
        featured: formData.featured,
      };

      let response;
      if (isEditMode) {
        console.log('Updating blog with data:', { blogId: id, ...blogData });
        response = await updateBlog({ blogId: id, ...blogData });
      } else {
        console.log('Adding new blog with data:', blogData);
        response = await addBlog(blogData);
      }

      setMessage({ type: 'success', content: response.message || 'Lưu bài viết thành công!' });
      setTimeout(() => {
        navigate('/admin/blog');
      }, 2000);

    } catch (error) {
      console.error('Error saving blog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi không mong muốn.';
      setMessage({ type: 'danger', content: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  if (loading) {
    return (
      <Card className="shadow-sm mb-4">
        <Card.Body className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Đang tải dữ liệu bài viết...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                {isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
              </h2>
              <p className="text-muted mb-0">
                {isEditMode ? 'Cập nhật nội dung bài viết' : 'Viết bài viết mới cho blog ADN LAB'}
              </p>
            </div>
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/admin/blog')} 
                className="me-2"
                disabled={isSaving}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSave('draft')}
                disabled={isSaving}
                className="me-2"
              >
                <i className="bi bi-save me-2"></i>
                Lưu nháp
              </Button>
              <Button
                variant="success"
                onClick={() => handleSave('published')}
                disabled={isSaving}
              >
                <i className="bi bi-cloud-upload me-2"></i>
                {isSaving ? 'Đang lưu...' : 'Xuất bản'}
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

      <Row>
        {/* Main Editor */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">Nội dung bài viết</h5>
            </Card.Header>
            <Card.Body>
              {/* Title */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  Tiêu đề bài viết <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  size="lg"
                />
                {formData.title && (
                  <Form.Text className="text-muted">
                    Slug: /{formData.slug}
                  </Form.Text>
                )}
              </Form.Group>

              {/* Excerpt */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Mô tả ngắn</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Viết mô tả ngắn gọn về nội dung bài viết..."
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                />
                <Form.Text className="text-muted">
                  {formData.excerpt.length}/300 ký tự
                </Form.Text>
              </Form.Group>

              {/* Content Editor */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  Nội dung bài viết <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={15}
                  placeholder="Viết nội dung chi tiết bài viết tại đây..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  style={{ fontFamily: 'monospace' }}
                />
                <Form.Text className="text-muted">
                  Hỗ trợ Markdown. {formData.content.length} ký tự
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Featured Image */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h6 className="mb-0">
                <i className="bi bi-image me-2"></i>
                Ảnh bài viết
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px' }}
                  />
                ) : (
                  <div className="border rounded p-3">
                    <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted mb-0">Chưa có ảnh</p>
                  </div>
                )}
              </div>
              <Form.Group>
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                  className="mb-2"
                  name="images"
                />
                <Form.Text className="text-muted">
                  Chọn file ảnh (JPG, PNG) với kích thước tối đa 5MB
                </Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Publishing Options */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white">
              <h6 className="mb-0">
                <i className="bi bi-gear me-2"></i>
                Tùy chọn xuất bản
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Đánh dấu là bài viết nổi bật"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Danh mục</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* SEO Settings */}
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h6 className="mb-0">
                <i className="bi bi-search me-2"></i>
                Cài đặt SEO
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">SEO Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tiêu đề SEO..."
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">SEO Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Mô tả SEO..."
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="fw-bold">SEO Keywords</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Từ khóa SEO (phân cách bằng dấu phẩy)..."
                  value={formData.seoKeywords}
                  onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                />
              </Form.Group>
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
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt={formData.title}
                className="img-fluid rounded mb-3"
              />
            )}
            
            <h1 className="mb-3">{formData.title || 'Tiêu đề bài viết'}</h1>
            
            {formData.category && (
              <Badge bg="primary" className="mb-3">{formData.category}</Badge>
            )}
            
            <div className="mb-3">
              <small className="text-muted">
                Tác giả: {user?.name || 'Admin'} • Ngày xuất bản: {new Date().toLocaleDateString('vi-VN')}
              </small>
            </div>
            
            {formData.excerpt && (
              <div className="lead mb-4">{formData.excerpt}</div>
            )}
            
            <div className="content">
              {formData.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>

            {formData.tags.length > 0 && (
              <div className="mt-4">
                <strong>Tags: </strong>
                {formData.tags.map(tag => (
                  <Badge key={tag} bg="light" text="dark" className="me-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
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