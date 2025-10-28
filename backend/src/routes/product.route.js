import { Router } from "express";
import { autenticate, checkAccessMaster, checkAccessReport} from "../controllers/error.controller.js";
import {
  createProduct,
  deleteProduct,
  generatePdf,
  getAllProduct,
  getProductByCategory,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
const productRoute = Router();

productRoute.post("/products", autenticate, checkAccessMaster, createProduct);
productRoute.get("/products", autenticate, checkAccessMaster, getAllProduct);
productRoute.get("/products/:id", autenticate, checkAccessMaster, getProductById);
productRoute.get("/products/category/:id",autenticate,checkAccessMaster,getProductByCategory);
productRoute.put("/products/:id", autenticate, checkAccessMaster, updateProduct);
productRoute.delete("/products/:id",autenticate,checkAccessMaster,deleteProduct);
productRoute.get("/products-pdf", autenticate, checkAccessReport, generatePdf);


export default productRoute;
