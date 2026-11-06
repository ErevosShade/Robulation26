import { z } from "zod";

/**
 * Validation schemas for Inventory API endpoints.
 */

export const skuRegex = /^[A-Z0-9_-]{2,64}$/;

export const createItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Item name is required and cannot be empty.")
    .max(200, "Item name cannot exceed 200 characters."),
  sku: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      skuRegex,
      "SKU must be 2-64 characters containing uppercase letters, numbers, underscores, or hyphens."
    ),
  category: z
    .string()
    .trim()
    .min(1, "Category is required.")
    .max(100, "Category cannot exceed 100 characters."),
  description: z.string().trim().max(5000).optional().nullable(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens.")
    .max(128)
    .optional(),
  tags: z
    .array(z.string().trim().min(1).max(30))
    .max(20, "Maximum of 20 tags permitted.")
    .optional(),
  locationRoom: z.string().trim().max(100).optional().nullable(),
  locationCabinet: z.string().trim().max(100).optional().nullable(),
  locationShelf: z.string().trim().max(100).optional().nullable(),
  locationBin: z.string().trim().max(100).optional().nullable(),
  unitCost: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Unit cost must be a valid non-negative decimal (e.g. 150.00).")
    .optional()
    .nullable(),
  currency: z.string().trim().max(10).default("INR"),
  totalQuantity: z
    .number()
    .int("Total quantity must be an integer.")
    .nonnegative("Total quantity cannot be negative.")
    .default(0),
  minimumStock: z
    .number()
    .int("Minimum stock must be an integer.")
    .nonnegative("Minimum stock cannot be negative.")
    .default(0),
  consumable: z.boolean().default(false),
  internalNotes: z.string().trim().max(5000).optional().nullable(),
});

export const updateItemSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    category: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(5000).optional().nullable(),
    tags: z.array(z.string().trim().min(1).max(30)).max(20).optional(),
    locationRoom: z.string().trim().max(100).optional().nullable(),
    locationCabinet: z.string().trim().max(100).optional().nullable(),
    locationShelf: z.string().trim().max(100).optional().nullable(),
    locationBin: z.string().trim().max(100).optional().nullable(),
    unitCost: z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, "Unit cost must be a valid non-negative decimal.")
      .optional()
      .nullable(),
    currency: z.string().trim().max(10).optional(),
    totalQuantity: z
      .number()
      .int("Total quantity must be an integer.")
      .nonnegative("Total quantity cannot be negative.")
      .optional(),
    minimumStock: z
      .number()
      .int("Minimum stock must be an integer.")
      .nonnegative("Minimum stock cannot be negative.")
      .optional(),
    consumable: z.boolean().optional(),
    internalNotes: z.string().trim().max(5000).optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one editable field must be provided for update.",
  });

export const catalogQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(100).optional(),
  status: z.enum(["in_stock", "low_stock", "out_of_stock", "archived"]).optional(),
});

export const itemIdParamSchema = z.object({
  id: z.string().trim().min(1, "Item ID is required.").max(128),
});

export const borrowRequestItemSchema = z.object({
  itemId: z.string().trim().min(1, "Item ID is required.").max(128),
  quantity: z
    .number()
    .int("Requested quantity must be an integer.")
    .positive("Requested quantity must be greater than zero."),
});

export const createBorrowRequestSchema = z
  .object({
    project: z
      .string()
      .trim()
      .min(3, "Project description must be at least 3 characters.")
      .max(500, "Project description cannot exceed 500 characters."),
    startDate: z.coerce.date({
      error: "Requested checkout date must be a valid date.",
    }),
    endDate: z.coerce.date({
      error: "Expected return date must be a valid date.",
    }),
    items: z
      .array(borrowRequestItemSchema)
      .min(1, "At least one inventory item must be requested.")
      .max(50, "A request cannot exceed 50 distinct items."),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Expected return date must be on or after requested checkout date.",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      const ids = data.items.map((i) => i.itemId);
      return new Set(ids).size === ids.length;
    },
    {
      message: "Duplicate items are not permitted within a single borrow request.",
      path: ["items"],
    }
  );

export const borrowRequestsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z
    .enum([
      "pending",
      "approved",
      "rejected",
      "cancelled",
      "collected",
      "partially_returned",
      "returned",
      "all",
    ])
    .optional(),
  userId: z.string().trim().max(128).optional(),
});

export const requestIdParamSchema = z.object({
  id: z.string().trim().min(1, "Request ID is required.").max(128),
});

export const reviewRequestSchema = z.object({
  adminNotes: z
    .string()
    .trim()
    .max(1000, "Review note cannot exceed 1000 characters.")
    .optional()
    .nullable(),
});

export const collectRequestSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(1000, "Collection note cannot exceed 1000 characters.")
    .optional()
    .nullable(),
});

export const returnItemSchema = z.object({
  itemId: z.string().trim().min(1, "Item ID is required.").max(128),
  quantity: z
    .number()
    .int("Returned quantity must be an integer.")
    .positive("Returned quantity must be greater than zero."),
  condition: z.enum(["good", "damaged"], {
    error: "Condition must be either 'good' or 'damaged'.",
  }),
  notes: z
    .string()
    .trim()
    .max(1000, "Item condition notes cannot exceed 1000 characters.")
    .optional()
    .nullable(),
});

export const returnRequestSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(1000, "Return note cannot exceed 1000 characters.")
    .optional()
    .nullable(),
  items: z
    .array(returnItemSchema)
    .min(1, "At least one item must be returned.")
    .max(50, "A return cannot exceed 50 items."),
});

export type ValidatedCreateItemInput = z.infer<typeof createItemSchema>;
export type ValidatedUpdateItemInput = z.infer<typeof updateItemSchema>;
export type ValidatedCatalogQuery = z.infer<typeof catalogQuerySchema>;
export type ValidatedBorrowRequestItemInput = z.infer<typeof borrowRequestItemSchema>;
export type ValidatedCreateBorrowRequestInput = z.infer<typeof createBorrowRequestSchema>;
export type ValidatedBorrowRequestsQuery = z.infer<typeof borrowRequestsQuerySchema>;
export type ValidatedReviewRequestInput = z.infer<typeof reviewRequestSchema>;
export type ValidatedCollectRequestInput = z.infer<typeof collectRequestSchema>;
export type ValidatedReturnRequestInput = z.infer<typeof returnRequestSchema>;


