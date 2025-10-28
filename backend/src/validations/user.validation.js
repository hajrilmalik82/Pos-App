// File: backend/src/validations/user.validation.js
// GANTI SEMUA ISI FILE DENGAN KODE DI BAWAH INI

import joi from "joi";

// ==========================================================
// FUNGSI 1: UNTUK TAMBAH USER BARU (Create)
// Password dan ConfirmPassword WAJIB ADA.
// ==========================================================
export const userValidation = (payload) => {
  const schema = joi.object({
    // Field data
    name: joi.string().trim().required(),
    userName: joi.string().min(4).trim().required(),
    role: joi.string().trim().required(),

    // Field password (wajib saat create)
    password: joi.string().min(4).max(15).required(),
    confirmPassword: joi
      .any()
      .equal(joi.ref("password"))
      .required()
      .label("Confirm Password")
      .messages({
        "any.only": "{{#label}} not same as password",
        "any.required": "{{#label}} is required",
      }),
      
    // Field hak akses (kita tambahkan di sini)
    canAccessMaster: joi.boolean().optional(),
    canAccessTransaksi: joi.boolean().optional(),
    canAccessReport: joi.boolean().optional(),
  });
  return schema.validate(payload);
};


// ==========================================================
// FUNGSI 2: UNTUK EDIT USER (Update)
// Password dan ConfirmPassword DIHAPUS SEPENUHNYA.
// Validasi HANYA untuk field yang ada di form Edit.
// ==========================================================
export const userUpdateValidation = (payload) => {
  const schema = joi.object({
    // Field yang boleh di-edit
    name: joi.string().trim().required(),
    userName: joi.string().min(4).trim().required(),
    role: joi.string().trim().required(),
    
    // Field hak akses yang boleh di-edit
    canAccessMaster: joi.boolean().optional(),
    canAccessTransaksi: joi.boolean().optional(),
    canAccessReport: joi.boolean().optional(),

    // 'password' dan 'confirmPassword' SENGAJA DIHAPUS dari sini
    // karena kita tidak mengizinkan update password dari form ini.
  });
  return schema.validate(payload);
};