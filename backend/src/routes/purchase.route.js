import { Router } from "express";
import { autenticate,checkAccessTransaksi } from "../controllers/error.controller.js";
import {
  createPurchase,
  generatePdf,
  getAllPurchase,
  getPurchaseById,
  purchaseYearly,
} from "../controllers/purchase.controller.js";
const purchaseRouter = Router();

purchaseRouter.post("/purchases", autenticate, checkAccessTransaksi,createPurchase);
purchaseRouter.get("/purchases", autenticate, checkAccessTransaksi, getAllPurchase);
purchaseRouter.get("/purchases/:id", autenticate, checkAccessTransaksi, getPurchaseById);
purchaseRouter.post("/purchases-pdf", autenticate, checkAccessTransaksi, generatePdf);
purchaseRouter.get("/purchase-year", autenticate, checkAccessTransaksi, purchaseYearly);

export default purchaseRouter;
