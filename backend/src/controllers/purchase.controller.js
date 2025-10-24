import prisma from "../utils/client.js";
import { setOrderCode } from "../utils/documentPatern.js";
import { logger } from "../utils/winston.js";
import { purchaseValidation } from "../validations/purchase.validation.js";
import fs from "fs";
import pdf from "pdf-creator-node";
import excelJS from "exceljs";

export const createPurchase = async (req, res) => {
  try {
    // validasi data
    const { error, value } = purchaseValidation(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        result: null,
      });
    }

    // Menggunakan nested writes untuk menangani transaksi secara otomatis
    const newPurchase = await prisma.purchase.create({
      data: {
        code: setOrderCode("PUR-"),
        date: value.date,
        note: value.note,
        total: Number(value.total),
        ppn: Number(value.ppn),
        grandTotal: Number(value.grandTotal),
        supplierName: value.supplierName, // <-- Menambahkan nama supplier
        userId: Number(req.user.id), // Mengambil userId dari user yang login
        Purchasedetail: {
          create: value.detail.map((item) => ({
            productId: Number(item.product.productId),
            productName: item.product.productName,
            price: Number(item.price), // Harga beli bisa custom per item
            qty: Number(item.qty),
            total: Number(item.totalPrice),
          })),
        },
      },
    });

    // Update stok produk setelah purchase berhasil dibuat
    for (const item of value.detail) {
      await prisma.product.update({
        where: {
          id: Number(item.product.productId),
        },
        data: {
          qty: {
            increment: Number(item.qty),
          },
        },
      });
    }

    return res.status(200).json({
      message: "Purchase created successfully",
      result: newPurchase,
    });
  } catch (error) {
    logger.error(
      "controllers/purchase.controller.js:createPurchase - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const getAllPurchase = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  let result = [];
  try {
    if (last_id < 1) {
      result = await prisma.$queryRaw`
        SELECT 
            p.id, p.code, p.date, p.note, p.supplierName, p.userId, u.name 
          FROM  Purchase p 
          INNER JOIN  User u 
          ON p.userId = u.id
          WHERE 
              p.code LIKE CONCAT('%', ${search}, '%')
              OR p.date LIKE CONCAT('%', ${search}, '%')
              OR p.note LIKE CONCAT('%', ${search}, '%')
              OR p.supplierName LIKE CONCAT('%', ${search}, '%') -- <-- Tambah pencarian supplierName
              OR u.name LIKE CONCAT('%', ${search}, '%')
          ORDER BY 
              p.id DESC 
          LIMIT ${limit};
      `;
    } else {
      result = await prisma.$queryRaw`
          SELECT 
            p.id, p.code, p.date, p.note, p.supplierName, p.userId, u.name 
        FROM  Purchase p 
        INNER JOIN User u 
        ON p.userId = u.id
        WHERE 
            (
                p.code LIKE CONCAT('%', ${search}, '%')
                OR p.date LIKE CONCAT('%', ${search}, '%')
                OR p.note LIKE CONCAT('%', ${search}, '%')
                OR p.supplierName LIKE CONCAT('%', ${search}, '%') -- <-- Tambah pencarian supplierName
                OR u.name LIKE CONCAT('%', ${search}, '%')
            )
            AND p.id < ${last_id}
        ORDER BY 
            p.id DESC 
        LIMIT ${limit};`;
    }
    return res.status(200).json({
      message: "success",
      result: result,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  } catch (error) {
    logger.error(
      "controllers/purchase.controller.js:getAllPurchase - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
      lastId: result.length > 0 ? result[result.length - 1].id : 0,
      hasMore: result.length >= limit ? true : false,
    });
  }
};

export const getPurchaseById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const result = await prisma.purchase.findUnique({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        Purchasedetail: true,
      },
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      message: "success",
      result: result,
    });
  } catch (error) {
    logger.error(
      "controllers/purchase.controller.js:getPurchaseById - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};

export const generatePdf = async (req, res) => {
  let pathFile = "./public/pdf";
  let fileName = "purchase.pdf";
  let fullPath = pathFile + "/" + fileName;
  let html = fs.readFileSync("./src/templates/PurchaseTemplat.html", "utf-8");
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
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    if (isNaN(startDate) && isNaN(endDate)) {
      return res.status(400).json({
        message: "Invalid date format",
        result: null,
      });
    }
    const data = await prisma.purchase.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        Purchasedetail: true,
      },
    });
    let purchases = [];
    data.forEach((order, no) => {
      purchases.push({
        no: no + 1,
        code: order.code,
        date: new Date(order.date).toLocaleDateString("id-ID"),
        supplierName: order.supplierName, // <-- Tambah supplierName untuk laporan
        total: Number(order.total).toLocaleString("id-ID"),
        ppn: Number(order.ppn).toLocaleString("id-ID"),
        grandTotal: Number(order.grandTotal).toLocaleString("id-ID"),
        user: order.user.name,
        purchasedetail: order.Purchasedetail,
      });
    });
    let document = {
      html: html,
      data: {
        purchases: purchases,
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
      "controllers/purchase.controller.js:generatePdf - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};


export const purchaseYearly = async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  try {
    const result = await prisma.$queryRaw`
    SELECT 
        IFNULL(SUM(CASE WHEN MONTH(date) = 1 THEN grandTotal ELSE 0 END), 0) AS purchase_01,
        IFNULL(SUM(CASE WHEN MONTH(date) = 2 THEN grandTotal ELSE 0 END), 0) AS purchase_02,
        IFNULL(SUM(CASE WHEN MONTH(date) = 3 THEN grandTotal ELSE 0 END), 0) AS purchase_03,
        IFNULL(SUM(CASE WHEN MONTH(date) = 4 THEN grandTotal ELSE 0 END), 0) AS purchase_04,
        IFNULL(SUM(CASE WHEN MONTH(date) = 5 THEN grandTotal ELSE 0 END), 0) AS purchase_05,
        IFNULL(SUM(CASE WHEN MONTH(date) = 6 THEN grandTotal ELSE 0 END), 0) AS purchase_06,
        IFNULL(SUM(CASE WHEN MONTH(date) = 7 THEN grandTotal ELSE 0 END), 0) AS purchase_07,
        IFNULL(SUM(CASE WHEN MONTH(date) = 8 THEN grandTotal ELSE 0 END), 0) AS purchase_08,
        IFNULL(SUM(CASE WHEN MONTH(date) = 9 THEN grandTotal ELSE 0 END), 0) AS purchase_09,
        IFNULL(SUM(CASE WHEN MONTH(date) = 10 THEN grandTotal ELSE 0 END), 0) AS purchase_10,
        IFNULL(SUM(CASE WHEN MONTH(date) = 11 THEN grandTotal ELSE 0 END), 0) AS purchase_11,
        IFNULL(SUM(CASE WHEN MONTH(date) = 12 THEN grandTotal ELSE 0 END), 0) AS purchase_12
    FROM purchase
    WHERE YEAR(date) = ${year}`;
    let arry = [];
    result.map((item) => {
      arry.push(
        ...arry,
        Number(item.purchase_01),
        Number(item.purchase_02),
        Number(item.purchase_03),
        Number(item.purchase_04),
        Number(item.purchase_05),
        Number(item.purchase_06),
        Number(item.purchase_07),
        Number(item.purchase_08),
        Number(item.purchase_09),
        Number(item.purchase_10),
        Number(item.purchase_11),
        Number(item.purchase_12)
      );
    });
    return res.status(200).json({
      message: "success",
      result: arry,
    });
  } catch (error) {
    logger.error(
      "controllers/purchase.controller.js:purchaseYearly - " + error.message
    );
    return res.status(500).json({
      message: error.message,
      result: null,
    });
  }
};