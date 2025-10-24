import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import {
  Button,
  Col,
  // Figure, // Dihapus
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

const ProductModal = (props) => {
  const { show, onHide, size, currIndex, handleChange } = props;
  const [keyword, setKeyword] = useState("");
  const [lastId, setLastId] = useState(0);
  const limit = 20;
  const [data, setData] = useState([]);
  const [tempId, setTempId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");

  const loadData = async () => {
    let reqOptions = {
      url: `/api/products?search_query=${keyword}&lastId=${lastId}&limit=${limit}`,
      method: "GET",
    };
    try {
      const response = await axiosInstance.request(reqOptions);
      const newData = response.data.result;

      // === PERBAIKAN LOGIC INTI ADA DI SINI ===
      // Jika lastId = 0 (beban awal / pencarian baru), GANTI data.
      // Jika tidak (infinite scroll), TAMBAHKAN data.
      if (lastId === 0) {
        setData(newData);
      } else {
        setData((prevData) => [...prevData, ...newData]);
      }
      // === AKHIR PERBAIKAN ===

      setTempId(response.data.lastId);
      setHasMore(response.data.hasMore);
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    // Hanya panggil loadData jika modal terlihat (show = true)
    if (show) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastId, keyword, show]); // Tambahkan 'show' sebagai dependency

  const serchData = (e) => {
    e.preventDefault();
    setLastId(0);
    // setData([]); // <-- HAPUS BARIS INI, ini yang menyebabkan bug
    setKeyword(query);
  };

  const fetchMore = () => {
    setLastId(tempId);
  };

  // Fungsi untuk mereset state saat modal ditutup
  const handleOnHide = () => {
    onHide();
    // Reset state ke awal saat modal ditutup
    setKeyword("");
    setLastId(0);
    setData([]);
    setTempId(0);
    setHasMore(true);
    setQuery("");
  };

  return (
    <>
      <Modal
        // onClose={onHide} // Hapus prop yang tidak standar
        size={size}
        show={show}
        onHide={handleOnHide} // Gunakan handleOnHide
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Search Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <form onSubmit={serchData}>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Search ..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    Search
                  </Button>
                </InputGroup>
              </form>
            </Col>
          </Row>
          <Row id="scrollableDiv" style={{ height: "600px", overflow: "auto" }}>
            <Col>
              <InfiniteScroll
                dataLength={data.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product Name</th>
                      <th>QTY</th>
                      <th>Price</th>
                      {/* <th>Image</th> Dihapus */}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr
                        style={{ cursor: "pointer" }}
                        key={item.id} // Gunakan item.id, bukan index
                        onClick={() => {
                          handleChange(
                            { name: "product", value: JSON.stringify(item) },
                            currIndex
                          ),
                            handleOnHide(); // Gunakan handleOnHide
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>{item.productName}</td>
                        <td>{Number(item.qty).toLocaleString("id-ID")}</td>
                        <td>Rp {Number(item.price).toLocaleString("id-ID")}</td>
                        {/* Kolom <td> untuk gambar dihapus */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </InfiniteScroll>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

ProductModal.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  size: PropTypes.string,
  currIndex: PropTypes.number,
  handleChange: PropTypes.func,
};

export default ProductModal;