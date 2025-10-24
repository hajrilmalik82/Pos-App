import { Router } from "express";
import { autenticate } from "../controllers/error.controller.js";
import {
  generatePdf,
  getAllOrder,
  getOrderById,
  insertOrder,
  orderYearly,
} from "../controllers/order.controller.js";
const orderRouter = Router();

orderRouter.post("/orders/:userId", autenticate, insertOrder);
orderRouter.get("/orders/:id", autenticate, getOrderById);
orderRouter.get("/orders", autenticate, getAllOrder);
orderRouter.post("/orders-pdf", autenticate, generatePdf);
orderRouter.get("/orders-year", autenticate, orderYearly);
export default orderRouter;
