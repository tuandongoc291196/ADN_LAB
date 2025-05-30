import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Form, Alert, Badge, Tab, Nav, Modal } from 'react-bootstrap';

const BlogEditor = ({ user }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: [],
    status: 'draft',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    publishDate: '',
    schedulePublish: false
  });

  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Xét nghiệm ADN',
    'Hướng dẫn',
    'Công nghệ',
    'Tin tức',
    'Khoa học',
    'Sức khỏe',
    'Gia đình'
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Auto generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Auto generate SEO title if not manually edited
    if (field === 'title' && !formData.seoTitle) {
      setFormData(prev => ({ ...prev, seoTitle: value }));
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
      // In real app, upload to server/cloud storage
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, featuredImage: imageUrl });
    }
  };

  const handleSave = async (status = 'draft') => {
    setIsSaving(true);
    
    try {
      // Validation
      if (!formData.title.trim()) {
        setMessage({ type: 'danger', content: 'Tiêu đề bài viết không được để trống!' });
        setIsSaving(false);
        return;
      }
      
      if (!formData.content.trim()) {
        setMessage({ type: 'danger', content: 'Nội dung bài viết không được để trống!' });
        setIsSaving(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const postData = {
        ...formData,
        status,
        publishDate: status === 'published' ? new Date().toISOString().split('T')[0] : formData.publishDate,
        author: user?.name || 'Admin',
        lastModified: new Date().toISOString()
      };

      console.log('Saving post:', postData);

      setMessage({ 
        type: 'success', 
        content: `Bài viết đã được ${status === 'published' ? 'xuất bản' : 'lưu'} thành công!` 
      });

      // Redirect after successful save
      setTimeout(() => {
        navigate('/admin/blog');
      }, 2000);

    } catch (error) {
      setMessage({ type: 'danger', content: 'Có lỗi xảy ra khi lưu bài viết!' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

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
              <Button variant="outline-secondary" onClick={() => navigate('/admin/blog')} className="me-2">
                <i className="bi bi-arrow-left me-2"></i>
                Quay lại
              </Button>
              <Button variant="outline-info" onClick={handlePreview} className="me-2">
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
                  placeholder="Viết nội dung chi tiết bài viết tại đây...

Bạn có thể sử dụng Markdown để định dạng:
- **text in đậm**
- *text in nghiêng*
- # Tiêu đề lớn
- ## Tiêu đề phụ
- [link](https://example.com)
- ![hình ảnh](url)

Hãy viết nội dung chất lượng, có giá trị cho người đọc!"
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
          {/* Publishing Options */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">
                <i className="bi bi-send me-2"></i>
                Xuất bản
              </h6>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Trạng thái</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="published">Đã xuất bản</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Đặt làm bài viết nổi bật"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Lên lịch xuất bản"
                  checked={formData.schedulePublish}
                  onChange={(e) => handleInputChange('schedulePublish', e.target.checked)}
                />
                {formData.schedulePublish && (
                  <Form.Control
                    type="datetime-local"
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="mt-2"
                  />
                )}
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="success" 
                  onClick={() => handleSave('published')}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Đang lưu...</>
                  ) : (
                    <><i className="bi bi-check-circle me-2"></i>Xuất bản</>
                  )}
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={() => handleSave('draft')}
                  disabled={isSaving}
                >
                  <i className="bi bi-save me-2"></i>
                  Lưu nháp
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Featured Image */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-info text-white">
              <h6 className="mb-0">
                <i className="bi bi-image me-2"></i>
                Hình ảnh đại diện
              </h6>
            </Card.Header>
            <Card.Body>
              {formData.featuredImage ? (
                <div className="text-center mb-3">
                  <img 
                    src={formData.featuredImage} 
                    alt="Featured" 
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px' }}
                  />
                  <div className="mt-2">
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleInputChange('featuredImage', '')}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Xóa ảnh
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <i className="bi bi-image text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-2">Chưa có hình ảnh đại diện</p>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              <div className="d-grid">
                <Button 
                  variant="outline-info"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bi bi-upload me-2"></i>
                  {formData.featuredImage ? 'Đổi ảnh' : 'Tải ảnh lên'}
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Category & Tags */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-warning text-dark">
              <h6 className="mb-0">
                <i className="bi bi-tags me-2"></i>
                Phân loại
              </h6>
            </Card.Header>
            <Card.Body>
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

              <Form.Group>
                <Form.Label className="fw-bold">Tags</Form.Label>
                <div className="mb-2">
                  {formData.tags.map(tag => (
                    <Badge 
                      key={tag} 
                      bg="primary" 
                      className="me-1 mb-1"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} <i className="bi bi-x ms-1"></i>
                    </Badge>
                  ))}
                </div>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Thêm tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button variant="outline-secondary" onClick={handleAddTag}>
                    <i className="bi bi-plus"></i>
                  </Button>
                </div>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* SEO Settings */}
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
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
                  placeholder="Tiêu đề hiển thị trên search engine"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                />
                <Form.Text className="text-muted">
                  {formData.seoTitle.length}/60 ký tự
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Meta Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Mô tả hiển thị trên search engine"
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                />
                <Form.Text className="text-muted">
                  {formData.seoDescription.length}/160 ký tự
                </Form.Text>
              </Form.Group>

              <Form.Group>
                <Form.Label className="fw-bold">Keywords</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="keyword1, keyword2, keyword3"
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
            {formData.featuredImage && (
              <img 
                src={formData.featuredImage} 
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