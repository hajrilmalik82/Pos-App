import "dotenv/config";
import { productValidation } from "../validations/product.validation.js";
import { setCode } from "../utils/documentPatern.js";
import { logger } from "../utils/winston.js";
import prisma from "../utils/client.js";
import pdf from "pdf-creator-node";
import excelJS from "exceljs";
import path from "path";
import fs from "fs";

export const createProduct = async (req, res) => {
  const { error, value } = productValidation(req.body);
  if (error != null) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }

  try {
    // Logika file.mv() dihapus, langsung create ke database
    const result = await prisma.product.create({
      data: {
        code: setCode("PRD-"),
        barcode: value.barcode ? value.barcode : null,
        productName: value.productName,
        qty: value.qty,
        price: value.price,
        kategoryId: value.kategoryId,
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/product.controller.js:createProduct - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getAllProduct = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  let result = [];
  try {
    if (last_id < 1) {
      result = await prisma.$queryRaw`
          SELECT 
                id, 
                code, 
                barcode, 
                productName, 
                qty, 
                price, 
                kategoryId, 
                createdAt, 
                updatedAt 
            FROM 
                Product 
            WHERE 
                (
                    code LIKE ${`%${search}%`}
                    OR productName LIKE ${`%${search}%`}
                    OR barcode LIKE ${`%${search}%`}
                    OR qty LIKE ${`%${search}%`}
                    OR price LIKE ${`%${search}%`}
                )
                AND isDeleted = false
            ORDER BY 
                id DESC 
            LIMIT ${limit};
      `;
    } else {
      result = await prisma.$queryRaw`
          SELECT 
                id, 
                code, 
                barcode, 
                productName, 
                qty, 
                price, 
                kategoryId, 
                createdAt, 
                updatedAt 
            FROM 
                Product 
            WHERE 
                (
                    code LIKE ${`%${search}%`}
                    OR productName LIKE ${`%${search}%`}
                    OR barcode LIKE ${`%${search}%`}
                    OR CAST(qty AS CHAR) LIKE ${`%${search}%`}
                    OR CAST(price AS CHAR) LIKE ${`%${search}%`}
                )
                AND id < ${last_id}
                AND isDeleted = false
            ORDER BY 
                id DESC 
            LIMIT ${limit};
      `;
    }
    return res.status(200).json({
      message: "success",
      result,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  } catch (error) {
    logger.error(
      "controllers/product.controller.js:getAllProduct - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const result = await prisma.product.findUnique({
      include: {
        kategory: true,
      },
      where: {
        id: Number(req.params.id),
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/product.controller.js:getProductById - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await prisma.product.findMany({
      where: {
        kategoryId: Number(id),
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/product.controller.js:getProductByCategory - " +
        error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      result: null,
    });
  }
  const { error, value } = productValidation(req.body);
  if (error != null) {
    return res.status(400).json({
      message: error.details[0].message,
      result: null,
    });
  }
  
  // SEMUA LOGIKA VALIDASI, UPLOAD, DAN HAPUS FILE LAMA DIHAPUS DARI SINI
  // (fs.unlinkSync, file.mv, dll)

  try {
    const result = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        code: product.code,
        barcode: value.barcode ? value.barcode : null,
        productName: value.productName,
        // 'image' dan 'url' dihapus
        qty: value.qty,
        price: value.price,
        kategoryId: value.kategoryId,
      },
    });
    return res.status(200).json({
      message: "success",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/product.controller.js:updateProduct - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const deleteProduct = async (req, res) => {
  // ... (Tidak ada perubahan di deleteProduct, biarkan apa adanya)
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    const result = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        isDeleted: true,
      },
    });

    return res.status(200).json({
      message: "Product successfully archived",
      result,
    });
  } catch (error) {
    logger.error(
      "controllers/product.controller.js:deleteProduct - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

// ... (Biarkan fungsi generatePdf dan generateExcel apa adanya)
// ... (Salin sisa fungsi generatePdf dan generateExcel dari file asli Anda)
export const generatePdf = async (req, res) => {
  let pathFile = "./public/pdf";
  let fileName = "product.pdf";
  let fullPath = pathFile + "/" + fileName;
  let html = fs.readFileSync("./src/templates/ProductTemplate.html", "utf-8");
  let options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "0.1mm",
      contents: "",
    },
    footer: {
      height: "28mm",
      contents: {
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
      },
    },
  };
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
    const data = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
    });
    let barangs = [];
    data.forEach((barang, no) => {
      barangs.push({
        no: no + 1,
        id: barang.code,
        nama_barang: barang.productName,
        jumlah: Number(barang.qty).toLocaleString("id-ID"),
        harga_satuan: Number(barang.price).toLocaleString("id-ID"),
      });
    });
    let document = {
      html: html,
      data: {
        barangs: barangs,
      },
      path: fullPath,
      type: "",
    };
    const process = await pdf.create(document, options);
    if (process) {
      return res.status(200).json({
        message: "success",
        result: "/pdf/" + fileName,
      });
    }
  } catch (error) {
    logger.error(
      "controllers/product.controller.js:generatePdf - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const generateExcel = async (req, res) => {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("Product");
  const path = "./public/excel";
  try {
    if (fs.existsSync(`${path}/Product.xlsx`)) {
      fs.unlinkSync(`${path}/Product.xlsx`);
    }
    const data = await prisma.product.findMany({
      where: {
        isDeleted: false,
      },
    });
    worksheet.columns = [
      { header: "No", key: "s_no", width: 5 },
      { header: "Nama Product", key: "productName", width: 20 },
      { header: "Jumlah", key: "qty", width: 10 },
      { header: "Harga Satuan", key: "price", width: 20 },
    ];
    let counter = 1;
    data.forEach((barang) => {
      barang.s_no = counter;
      barang.qty = Number(barang.qty).toLocaleString("id-ID");
      barang.price = Number(barang.price).toLocaleString("id-ID");
      worksheet.addRow(barang);
      counter++;
    });
    let list = ["A", "B", "C", "D"];
    for (let i = 0; i <= counter; i++) {
      list.forEach((item) => {
        worksheet.getCell(item + i).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    await workbook.xlsx.writeFile(`${path}/Product.xlsx`);
    return res.status(200).json({
      message: "success",
      result: `/excel/Product.xlsx`,
    });
  } catch (error) {
    logger.error(
      "controllers/product.controller.js:generateExcel - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};