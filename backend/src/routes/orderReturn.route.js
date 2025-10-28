import { Router } from "express";
import { autenticate,checkAccessTransaksi } from "../controllers/error.controller.js";
import { insertOrderReturn } from "../controllers/orderReturn.controller.js";
const orderReturnRouter = Router();

orderReturnRouter.post("/order-returns", autenticate, checkAccessTransaksi, insertOrderReturn);

export default orderReturnRouter;
