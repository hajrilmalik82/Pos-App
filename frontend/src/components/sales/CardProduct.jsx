import { Col, Card } from "react-bootstrap";
import PropTypes from "prop-types";

const CardProduct = ({ product, setCart }) => {
  // Fungsi ini dipanggil saat kartu di-klik
  const handleAddToCart = () => {
    setCart(product);
  };

  return (
    <Col md={3} xs={6} className="mb-4">
      <Card
        className="shadow-sm border-0 h-100 "
        onClick={handleAddToCart}
        style={{ cursor: "pointer" }}
      >
        <Card.Body className="d-flex flex-column">
          <div className="flex-grow-1">
            <Card.Title
              className="mb-1"
              style={{
                fontSize: "1rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {product.productName.toUpperCase()}
            </Card.Title>
            <small className="text-muted">Stok: {product.qty}</small>
          </div>
          <strong style={{ fontSize: "1rem" }}>
            Rp. {parseInt(product.price).toLocaleString("id-ID")}
          </strong>
        </Card.Body>
      </Card>
    </Col>
  );
};

CardProduct.propTypes = {
  product: PropTypes.object.isRequired,
  setCart: PropTypes.func.isRequired,
};

export default CardProduct;