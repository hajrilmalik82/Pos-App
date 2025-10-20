import Joi from "joi";

export const purchaseValidation = (payload) => {
  const schema = Joi.object({
    date: Joi.date().required(),
    note: Joi.string().allow("").optional(),
    supplierName: Joi.string().required().messages({
      "string.empty": `"Supplier Name" cannot be empty`,
      "any.required": `"Supplier Name" is a required field`,
    }),
    userId: Joi.number().required(),
    total: Joi.number().required(),
    ppn: Joi.number().required(),
    grandTotal: Joi.number().required(),
    detail: Joi.array()
      .items(
        Joi.object({
          product: Joi.object({
            productId: Joi.number().required(),
            productName: Joi.string().required(),
          }).required(),
          qty: Joi.number().required(),
          price: Joi.number().required(), // Harga sekarang wajib ada di setiap item
          totalPrice: Joi.number().required(),
        })
      )
      .min(1) // Memastikan detail tidak kosong
      .required(),
  });
  return schema.validate(payload);
};