import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import { toast } from "react-toastify";
import NavbarComponent from "../NavbarComponent.jsx";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Figure,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import Select from "react-select";
import DataModal from "./DataModal.jsx";

const AddProduct = () => {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState({});
  const [nama, setNama] = useState("");
  const [barcode, setBarcode] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();

  const loadKategory = useCallback(async () => {
    let reqOptions = {
      url: "/api/categorys",
      method: "GET",
    };
    const out = await axiosInstance.request(reqOptions);
    const result = out.data.result.map((item) => {
      return { value: item.id, label: item.kategoryName };
    });
    setData(result);
  }, []);

  useEffect(() => {
    loadKategory();
  }, [loadKategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("barcode", barcode);
    formData.append("productName", nama);
    formData.append("qty", qty);
    formData.append("price", price);
    formData.append("kategoryId", category.value);
    try {
      const out = await axiosInstance.post("/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (out.data) {
        toast.success(out.data.message, {
          position: "top-center",
        });
        navigate("/product");
      }
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  };
  return (
    <>
      <NavbarComponent />
      <Container>
        <Row className="mt-3 bg-body-tertiary rounded p-3 pb-0">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="#">Master</Breadcrumb.Item>
              <Breadcrumb.Item href="/product">Product</Breadcrumb.Item>
              <Breadcrumb.Item active>Add Product</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Product Code
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    plaintext
                    readOnly
                    defaultValue="PRD-xxxxxxxx"
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Categori
                </Form.Label>
                <Col sm="5">
                  <Select
                    placeholder=""
                    className="basic-single"
                    onChange={setCategory}
                    options={data}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 5,
                      colors: {
                        ...theme.colors,
                        primary: "#c2dbfeff",
                      },
                    })}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Barcode
                </Form.Label>
                <Col sm="5">
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Product Name
                </Form.Label>
                <Col sm="10">
                  <Form.Control
                    type="text"
                    placeholder=""
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  QTY
                </Form.Label>
                <Col sm="2">
                  <Form.Control
                    type="number"
                    placeholder=""
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                  Price
                </Form.Label>
                <Col sm="2">
                  <Form.Control
                    type="number"
                    placeholder=""
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Row>
                <Col md={{ span: 10, offset: 2 }}>
                  <Button type="submit" variant="primary">
                    Submit
                  </Button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AddProduct;
