// File: frontend/src/auth/RouteNavigation.jsx
// GANTI SELURUH ISI FILE ANDA DENGAN KODE INI

// 1. Import dari router
import { Route, Routes, Outlet } from "react-router-dom"; 
import { ToastContainer } from "react-toastify";

// 2. Import Komponen Publik (Bisa diakses tanpa login)
import Login from "../components/Login.jsx";
import Logout from "../components/Logout.jsx";
import NoPage from "../components/NoPage.jsx";

// 3. Import Komponen Privat (Hanya bisa diakses setelah login)
import Home from "../components/Home.jsx";
// Master
import ListCategory from "../components/category/ListCategory.jsx";
import AddCategory from "../components/category/AddCategory.jsx";
import EditCategory from "../components/category/EditCategory.jsx";
import ListProduct from "../components/product/ListProduct.jsx";
import AddProduct from "../components/product/AddProduct.jsx";
import EditProduct from "../components/product/EditProduct.jsx";
// Transaksi
import ListSales from "../components/sales/ListSales.jsx";
import ListSalesHistory from "../components/salesHistory/ListSalesHistory.jsx";
import SalesReturn from "../components/salesHistory/SalesReturn.jsx";
import ListPurchase from "../components/purchase/ListPurchase.jsx";
import AddPurchase from "../components/purchase/AddPurchase.jsx";
import PrintPurchase from "../components/purchase/PrintPurchase.jsx";
import OrderSend from "../components/sales/OrderSend.jsx"; // <-- Rute yang hilang
// Laporan
import ProductReport from "../components/report/product/ProductReport.jsx";
import SalesReport from "../components/report/sales/SalesReport.jsx";
import PurchaseReport from "../components/report/purchase/PurchaseReport.jsx";
// Manajemen User
import ListUser from "../components/user/ListUser.jsx"; 

// 4. Import Komponen Auth & Layout
import ProtectedRoute from "./ProtectedRoute";
import NavbarComponent from "../components/NavbarComponent"; 

/**
 * Komponen PrivateLayout
 * Bertugas merender Navbar HANYA untuk halaman privat/terproteksi.
 */
const PrivateLayout = () => (
  <>
    <NavbarComponent />
    <Outlet /> 
  </>
);

const RouteNavigation = () => {
  return (
    <>
      <Routes>
        {/* --- Rute Publik (Tanpa Navbar) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NoPage />} /> 

        {/* --- Rute Privat / Terproteksi (Dengan Navbar) --- */}
        <Route element={<ProtectedRoute />}>

        <Route element={<ProtectedRoute permissionKey="canAccessTransaksi" />}>
        <Route path="/purchase/print/:id" element={<PrintPurchase />} />
        </Route>
        
          <Route element={<PrivateLayout />}>
            
            <Route path="/" element={<Home />} />

            {/* --- RUTE MASTER --- */}
            <Route element={<ProtectedRoute permissionKey="canAccessMaster" />}>
              <Route path="/category" element={<ListCategory />} />
              <Route path="/category/add" element={<AddCategory />} />
              <Route path="/category/:id" element={<EditCategory />} /> {/* <-- Path diperbaiki */}
              <Route path="/product" element={<ListProduct />} />
              <Route path="/product/add" element={<AddProduct />} />
              <Route path="/product/:id" element={<EditProduct />} /> {/* <-- Path diperbaiki */}
            </Route>

            {/* --- RUTE TRANSAKSI --- */}
            <Route element={<ProtectedRoute permissionKey="canAccessTransaksi" />}>
              <Route path="/sales" element={<ListSales />} />
              <Route path="/sales-history" element={<ListSalesHistory />} />
              <Route path="/sales-return/:id" element={<SalesReturn />} />
              <Route path="/purchase" element={<ListPurchase />} />
              <Route path="/purchase/add" element={<AddPurchase />} />
              
              <Route path="/orders/:id" element={<OrderSend />} /> {/* <-- Rute ditambahkan */}
            </Route>

            {/* --- RUTE LAPORAN --- */}
            <Route element={<ProtectedRoute permissionKey="canAccessReport" />}>
              <Route path="/sales-report" element={<SalesReport />} />
              <Route path="/purchase-report" element={<PurchaseReport />} />
              <Route path="/product-report" element={<ProductReport />} />
            </Route>

            {/* --- RUTE ADMIN ONLY --- */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/users" element={<ListUser />} />
            </Route>

          </Route>
        </Route>
      </Routes>
      
      <ToastContainer />
    </>
  );
};

export default RouteNavigation;