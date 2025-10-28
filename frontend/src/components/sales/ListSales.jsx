import { Container, Row } from "react-bootstrap";
import ListCategory from "./ListCategory.jsx";
import ListProduct from "./ListProduct.jsx";
import ListOrder from "./ListOrder.jsx";

const ListSales = () => {
  return (
    <>
      <Container fluid>
        <Row className="mt-3">
          <ListCategory />
          <ListProduct />
          <ListOrder />
        </Row>
      </Container>
    </>
  );
};

export default ListSales;
