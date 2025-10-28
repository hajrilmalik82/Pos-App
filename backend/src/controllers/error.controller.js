import { verifyAccessToken } from "../utils/jwt.js";

export const autenticate = (req, res, next) => {
  let lanjut = 1;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    lanjut = 0;
    return res.status(401).json({
      message: "Verify token field",
      result: null,
    });
  }
  const user = verifyAccessToken(token);
  if (!user) {
    lanjut = 0;
    return res.status(401).json({
      message: "Verify token field",
      result: null,
    });
  }

  if (lanjut == 1) {
    req.user = user;
    next();
  }
};

export const checkAccessMaster = (req, res, next) => {
  // 'req.user' didapat dari middleware 'autenticate'
  const user = req.user;

  // 1. Admin selalu diizinkan
  if (user.role === "admin") {
    return next();
  }

  // 2. User biasa dicek hak aksesnya
  if (user.canAccessMaster) {
    return next();
  }

  // 3. Jika tidak punya, tolak akses
  return res.status(403).json({
    message: "Forbidden: Anda tidak memiliki hak akses ke modul Master.",
    result: null,
  });
};

/**
 * Middleware untuk mengecek hak akses ke Modul Transaksi
 */
export const checkAccessTransaksi = (req, res, next) => {
  const user = req.user;

  if (user.role === "admin" || user.canAccessTransaksi) {
    return next();
  }

  return res.status(403).json({
    message: "Forbidden: Anda tidak memiliki hak akses ke modul Transaksi.",
    result: null,
  });
};

/**
 * Middleware untuk mengecek hak akses ke Modul Report
 */
export const checkAccessReport = (req, res, next) => {
  const user = req.user;

  if (user.role === "admin" || user.canAccessReport) {
    return next();
  }

  return res.status(403).json({
    message: "Forbidden: Anda tidak memiliki hak akses ke modul Laporan.",
    result: null,
  });
};