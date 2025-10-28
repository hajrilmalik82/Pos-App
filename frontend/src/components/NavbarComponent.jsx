import { useState } from "react";
import { Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import secureLocalStorage from "react-secure-storage";
import { FaBuffer, FaChartBar } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import ProfileModal from "./ProfileModal.jsx";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
const NavbarComponent = () => {
  const [modalShow, setModalShow] = useState(false);
  const { user } = useAuth();
  let nama = "User";
  if (user) {
    nama = user.name;
  }

  const avatar = (
    <Image
      src={"/img/img_avatar.png"}
      alt="User"
      roundedCircle
      style={{ width: "30px" }}
    />
  );
  return (
    <Navbar expand="lg" className="bg-body-tertiary print">
      <Container fluid>
        <Navbar.Brand href="/">
        <Image
    src="/img/Logo.jpg" // <-- Ganti dengan nama file logo Anda
    alt="POS App Logo"
    style={{ height: "38px", marginRight: "10px" }} // Atur tinggi & beri jarak
  />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {(user?.role === "admin" || user?.canAccessMaster) && (
                <NavDropdown title="Master" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/category">
                    Kategori
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/product">
                    Produk
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            {(user?.role === "admin" || user?.canAccessTransaksi) && (
                <NavDropdown title="Transaksi" id="basic-nav-dropdown-transaksi">
                  <NavDropdown.Item as={Link} to="/sales">
                    Penjualan
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/sales-history">
                    Riwayat Penjualan
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/purchase">
                    Pembelian
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {(user?.role === "admin" || user?.canAccessReport) && (
                <NavDropdown title="Laporan" id="basic-nav-dropdown-laporan">
                  <NavDropdown.Item as={Link} to="/sales-report">
                    Laporan Penjualan
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/purchase-report">
                    Laporan Pembelian
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/product-report">
                    Laporan Produk
                  </NavDropdown.Item>
                </NavDropdown>
              )}
          </Nav>
          <Nav>
            <NavDropdown
              title={
                <>
                  {avatar} {nama}
                </>
              }
              id="collapsible-nav-dropdown"
            >
              {user?.role === "admin" && (
                <Nav.Link as={Link} to="/users">
                  Manajemen User
                </Nav.Link>
              )}
              <NavDropdown.Item href="#" onClick={() => setModalShow(true)}>
                Profil
              </NavDropdown.Item>
              <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <ProfileModal
        show={modalShow}
        size="xl"
        modalTitle="Search Supplier"
        onHide={() => setModalShow(false)}
      />
    </Navbar>
  );
};

export default NavbarComponent;
