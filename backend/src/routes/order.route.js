import { Router } from "express";
import { autenticate, checkAccessTransaksi } from "../controllers/error.controller.js";
import {
  generatePdf,
  getAllOrder,
  getOrderById,
  insertOrder,
  orderYearly,
} from "../controllers/order.controller.js";
const orderRouter = Router();

orderRouter.post("/orders/:userId", autenticate, checkAccessTransaksi, insertOrder);
orderRouter.get("/orders/:id", autenticate, checkAccessTransaksi, getOrderById);
orderRouter.get("/orders", autenticate, checkAccessTransaksi,getAllOrder);
orderRouter.post("/orders-pdf", autenticate, checkAccessTransaksi,generatePdf);
orderRouter.get("/orders-year", autenticate, checkAccessTransaksi ,orderYearly);
export default orderRouter;
