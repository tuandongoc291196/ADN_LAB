import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Image, Breadcrumb, ListGroup } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';

const hardcodedBlogs = [
    {
      id: '1',
      title: 'Quy trình xét nghiệm ADN cha-con và những điều cần biết',
      summary: 'Tìm hiểu chi tiết về quy trình xét nghiệm ADN huyết thống cha-con, từ khâu thu mẫu, phân tích đến khi nhận kết quả. Bài viết cung cấp thông tin hữu ích giúp bạn chuẩn bị tốt hơn.',
      content: 'Xét nghiệm ADN huyết thống cha-con là một phương pháp khoa học hiện đại và chính xác nhất để xác định mối quan hệ cha con.\\nQuy trình bắt đầu bằng việc thu thập mẫu. Mẫu có thể là máu, niêm mạc miệng, tóc có chân, hoặc móng tay. Tại ADN LAB, chúng tôi khuyến khích sử dụng mẫu niêm mạc miệng vì tính an toàn, không đau và dễ thực hiện.\\nSau khi thu mẫu, các mẫu sẽ được gửi đến phòng thí nghiệm đạt chuẩn quốc tế ISO 15189:2012 của chúng tôi. Tại đây, các chuyên gia sẽ tách chiết ADN và sử dụng công nghệ giải trình tự gen để phân tích 24 locus gen. Kết quả so sánh sẽ cho thấy mối quan hệ huyết thống với độ chính xác lên đến 99.9999%.\\nThời gian trả kết quả thường từ 2-5 ngày làm việc. Kết quả sẽ được bảo mật tuyệt đối và trả cho người yêu cầu xét nghiệm dưới nhiều hình thức: online qua website, bản cứng tại trung tâm hoặc gửi qua bưu điện.',
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop',
      createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
      author: 'TS. Nguyễn Văn Minh'
    },
    {
      id: '2',
      title: 'Tầm quan trọng của xét nghiệm ADN trong thủ tục pháp lý',
      summary: 'Kết quả xét nghiệm ADN không chỉ để biết sự thật mà còn là một chứng cứ pháp lý quan trọng trong nhiều vụ việc như làm giấy khai sinh, phân chia tài sản thừa kế, hoặc thủ tục di dân.',
      content: 'Trong các vấn đề pháp lý, sự chính xác và minh bạch là yếu tố hàng đầu. Kết quả xét nghiệm ADN từ một đơn vị được cấp phép như ADN LAB có giá trị pháp lý và được các cơ quan chức năng công nhận.\\nĐối với việc làm giấy khai sinh cho con khi cha mẹ không có giấy đăng ký kết hôn, kết quả xét nghiệm ADN là giấy tờ bắt buộc để chứng minh quan hệ cha-con. Tương tự, trong các tranh chấp về tài sản thừa kế, kết quả ADN là bằng chứng không thể chối cãi để xác định quyền lợi của những người liên quan.\\nNgoài ra, đối với các thủ tục bảo lãnh, di dân sang các nước như Mỹ, Úc, Canada, kết quả xét nghiệm ADN cũng thường được yêu cầu bởi cơ quan lãnh sự để chứng minh mối quan hệ huyết thống. Quy trình thu mẫu cho mục đích pháp lý sẽ nghiêm ngặt hơn, cần có sự chứng kiến của người có thẩm quyền và lăn tay, chụp ảnh người tham gia để đảm bảo tính khách quan.',
      imageUrl: 'https://images.unsplash.com/photo-1581092580497-c2d29a0a4839?q=80&w=2070&auto=format&fit=crop',
      createdAt: new Date('2023-10-20T14:30:00Z').toISOString(),
      author: 'ThS. Lê Văn Đức'
    }
];

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const foundBlog = hardcodedBlogs.find(b => b.id === id);
    if (foundBlog) {
      setBlog(foundBlog);
      setOtherBlogs(hardcodedBlogs.filter(b => b.id !== id));
    } else {
      setError('Không thể tìm thấy bài viết. Có thể bài viết đã bị xóa hoặc không tồn tại.');
    }
  }, [id]);

  const renderContent = (content) => {
    return content.split('\\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  }

  if (error) {
    return (
        <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
        </Container>
    );
  }

  if (!blog) {
      return null; // or a loading spinner
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold mt-4">{blog.title}</h1>
          <div className="text-white-50 mt-4">
            <span>
              <i className="bi bi-calendar-event me-2"></i>
              Đăng ngày: {new Date(blog.createdAt).toLocaleDateString('vi-VN')} 
            </span>
            <span className="ms-4">           
              |
            </span>
            <span className="ms-4">
              <i className="bi bi-person me-2"></i>
              Tác giả: {blog.author || 'Admin'}
            </span>
          </div>
        </Container>
      </section>
      
      {/* Main Content Section */}
      <section className="py-5 bg-light">
        <Container>
            <Row>
                {/* Blog Content */}
                <Col lg={8} className="mb-4 mb-lg-0">
                    <Card className="p-4 shadow-sm border-0 h-100">
                        {blog.imageUrl && (
                            <Image 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            fluid 
                            rounded 
                            className="mb-4"
                            />
                        )}
                        <div className="blog-content lh-lg text-break fs-5">
                            {renderContent(blog.content)}
                        </div>

                        <hr className="my-4" />

                        <div className="text-center">
                            <Link to="/blog" className="btn btn-outline-primary">
                                <i className="bi bi-arrow-left me-2"></i>
                                Quay lại
                            </Link>
                        </div>
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col lg={4}>
                    <div className="position-sticky" style={{top: '2rem'}}>
                        <Card className="shadow-sm border-0">
                            <Card.Header as="h5" className="fw-bold bg-white border-bottom p-3">
                                <i className="bi bi-newspaper me-2"></i>
                                Các bài viết khác
                            </Card.Header>
                            <ListGroup variant="flush">
                                {otherBlogs.map(other => (
                                    <ListGroup.Item action as={Link} to={`/blog/${other.id}`} key={other.id} className="py-3">
                                        <div className="fw-bold mb-1">{other.title}</div>
                                        <small className="text-muted">
                                            <i className="bi bi-clock me-2"></i>
                                            {new Date(other.createdAt).toLocaleDateString('vi-VN')}
                                            <span className="mx-2">|</span>
                                            <i className="bi bi-person"></i>
                                            <span className="mx-2">{other.author || 'Admin'}</span>
                                        </small>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
      </section>
    </>
  );
};

export default BlogDetail; 