// File: frontend/src/components/user/ListUser.jsx

import { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { axiosInstance } from "../../auth/AxiosConfig";
import { toast } from "react-toastify";
import { PencilSquare, Trash } from "react-bootstrap-icons"; // Import ikon

// Objek untuk mereset form
const initialFormData = {
  name: "",
  userName: "",
  password: "",
  confirmPassword: "",
  role: "user",
  canAccessMaster: false,
  canAccessTransaksi: false,
  canAccessReport: false,
};

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk Modal dan Form
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // Fungsi untuk mengambil data user
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/users");
      setUsers(response.data.result);
    } catch (error) {
      toast.error("Gagal mengambil data user.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen dimuat
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handler untuk input form (text dan select)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler khusus untuk checkbox
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handler untuk menutup modal
  const handleClose = () => {
    setShow(false);
    setFormData(initialFormData);
    setIsEdit(false);
    setCurrentUserId(null);
  };

  // Handler untuk membuka modal "Tambah User"
  const handleShowAdd = () => {
    setIsEdit(false);
    setFormData(initialFormData);
    setShow(true);
  };

  // Handler untuk membuka modal "Edit User"
  const handleShowEdit = (user) => {
    setIsEdit(true);
    setCurrentUserId(user.id);
    setFormData({
      name: user.name,
      userName: user.userName,
      password: "", // Kosongkan password saat edit
      role: user.role,
      canAccessMaster: user.canAccessMaster,
      canAccessTransaksi: user.canAccessTransaksi,
      canAccessReport: user.canAccessReport,
    });
    setShow(true);
  };

  // Handler untuk submit form (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Salin data form dan hapus password jika kosong (untuk update)
    const dataToSubmit = { ...formData };
    if (isEdit && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }

    try {
      if (isEdit) {
        // --- PROSES UPDATE ---
        await axiosInstance.put(`/api/users/${currentUserId}`, dataToSubmit);
        toast.success("User berhasil diperbarui!");
      } else {
        // --- PROSES CREATE ---
        await axiosInstance.post("/api/users", dataToSubmit);
        toast.success("User baru berhasil ditambahkan!");
      }
      fetchUsers(); // Ambil ulang data
      handleClose(); // Tutup modal
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message;
      toast.error(`Gagal menyimpan user: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler untuk menghapus user
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        await axiosInstance.delete(`/api/users/${id}`);
        toast.success("User berhasil dihapus.");
        fetchUsers(); // Ambil ulang data
      } catch (error) {
        toast.error("Gagal menghapus user.");
        console.error(error);
      }
    }
  };

  // Helper untuk render badge akses
  const renderAccessBadge = (hasAccess) => {
    return hasAccess ? (
      <span className="badge bg-success">Ya</span>
    ) : (
      <span className="badge bg-danger">Tidak</span>
    );
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h4>Manajemen User</h4>
          <Button variant="primary" onClick={handleShowAdd}>
            Tambah User
          </Button>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Role</th>
                <th>Akses Master</th>
                <th>Akses Transaksi</th>
                <th>Akses Report</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    <Spinner animation="border" />
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.userName}</td>
                    <td>{user.role}</td>
                    <td>{renderAccessBadge(user.canAccessMaster)}</td>
                    <td>{renderAccessBadge(user.canAccessTransaksi)}</td>
                    <td>{renderAccessBadge(user.canAccessReport)}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleShowEdit(user)}
                        className="me-2"
                      >
                        <PencilSquare />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* --- Modal untuk Tambah / Edit User --- */}
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit User" : "Tambah User"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formUserName">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
        {!isEdit && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Masukkan password..."
                      required={!isEdit} 
                    />
                  </Form.Group>
                </Col>
                {/* 2. TAMBAHKAN BLOK 'Col' BARU INI UNTUK KONFIRMASI */}
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Konfirmasi Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword" // <-- Sesuaikan 'name'
                      value={formData.confirmPassword} // <-- Gunakan state
                      onChange={handleChange}
                      placeholder="Ketik ulang password..."
                      required={!isEdit} // Wajib diisi saat Tambah
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formRole">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* --- BAGIAN CHECKBOX HAK AKSES --- */}
            <hr />
            <h5>Tambahkan Hak Akses</h5>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Akses Master (Produk, Kategori)"
                name="canAccessMaster"
                checked={formData.canAccessMaster}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Akses Transaksi (Penjualan, Pembelian)"
                name="canAccessTransaksi"
                checked={formData.canAccessTransaksi}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Akses Laporan (Cetak Laporan)"
                name="canAccessReport"
                checked={formData.canAccessReport}
                onChange={handleCheckboxChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Tutup
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner as="span" size="sm" /> : "Simpan"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ListUser;