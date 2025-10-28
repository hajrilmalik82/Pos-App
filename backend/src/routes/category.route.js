import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
} from "../controllers/kategory.controller.js";
import { autenticate, checkAccessMaster } from "../controllers/error.controller.js";
const categoryRoute = Router();

categoryRoute.get("/categorys", autenticate, checkAccessMaster, getAllCategory);
categoryRoute.get("/categorys/:id", autenticate, checkAccessMaster, getCategoryById);
categoryRoute.post("/categorys", autenticate, checkAccessMaster, createCategory);
categoryRoute.put("/categorys/:id", autenticate, checkAccessMaster, updateCategory);
categoryRoute.put("/categorys/:id", autenticate, checkAccessMaster, updateCategory);
categoryRoute.delete("/categorys/:id", autenticate, checkAccessMaster, deleteCategory);

export default categoryRoute;
