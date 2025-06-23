import { pgTable, text, serial, integer, decimal, timestamp, varchar, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  assetId: varchar("asset_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  location: varchar("location", { length: 255 }).notNull(),
  department: varchar("department", { length: 100 }),
  description: text("description"),
  purchaseDate: timestamp("purchase_date"),
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").references(() => assets.id).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  description: text("description"),
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  performedBy: varchar("performed_by", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default("scheduled"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").references(() => assets.id),
  action: varchar("action", { length: 100 }).notNull(),
  changes: text("changes"),
  performedBy: varchar("performed_by", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMaintenanceRecordSchema = createInsertSchema(maintenanceRecords).omit({
  id: true,
  createdAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceRecordSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

export const AssetStatus = {
  ACTIVE: "active",
  MAINTENANCE: "maintenance",
  RETIRED: "retired",
} as const;

export const AssetCategory = {
  IT_EQUIPMENT: "it-equipment",
  FURNITURE: "furniture",
  VEHICLES: "vehicles",
  MACHINERY: "machinery",
  OFFICE_SUPPLIES: "office-supplies",
} as const;

export const MaintenanceStatus = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// Work Orders table
export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  workOrderId: varchar("work_order_id", { length: 50 }).notNull().unique(),
  assetId: integer("asset_id").references(() => assets.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(), // preventive, corrective, emergency
  priority: varchar("priority", { length: 50 }).notNull().default("medium"), // low, medium, high, critical
  status: varchar("status", { length: 50 }).notNull().default("open"), // open, assigned, in-progress, completed, cancelled
  assignedTo: varchar("assigned_to", { length: 255 }),
  estimatedHours: decimal("estimated_hours", { precision: 5, scale: 2 }),
  actualHours: decimal("actual_hours", { precision: 5, scale: 2 }),
  scheduledDate: timestamp("scheduled_date"),
  startDate: timestamp("start_date"),
  completedDate: timestamp("completed_date"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Locations table
export const locations: any = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: varchar("type", { length: 100 }).notNull(), // building, floor, room, warehouse, etc.
  address: text("address"),
  coordinates: json("coordinates"), // { lat: number, lng: number }
  parentLocationId: integer("parent_location_id").references(() => locations.id),
  description: text("description"),
  capacity: integer("capacity"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Vendors/Contractors table
export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: varchar("type", { length: 100 }).notNull(), // vendor, contractor, supplier
  contactPerson: varchar("contact_person", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  specialties: json("specialties"), // array of specialties
  rating: decimal("rating", { precision: 3, scale: 2 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Service Contracts table
export const serviceContracts = pgTable("service_contracts", {
  id: serial("id").primaryKey(),
  contractNumber: varchar("contract_number", { length: 100 }).notNull().unique(),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  contractType: varchar("contract_type", { length: 100 }).notNull(), // maintenance, support, service
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
  terms: text("terms"),
  slaResponse: integer("sla_response"), // response time in hours
  slaResolution: integer("sla_resolution"), // resolution time in hours
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, expired, terminated
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Spare Parts Inventory
export const spareParts = pgTable("spare_parts", {
  id: serial("id").primaryKey(),
  partNumber: varchar("part_number", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  modelNumber: varchar("model_number", { length: 100 }),
  unitOfMeasure: varchar("unit_of_measure", { length: 50 }).notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  currentStock: integer("current_stock").default(0).notNull(),
  minimumStock: integer("minimum_stock").default(0).notNull(),
  maximumStock: integer("maximum_stock"),
  reorderPoint: integer("reorder_point").default(0).notNull(),
  locationId: integer("location_id").references(() => locations.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Asset-Spare Parts relationship
export const assetSpareParts = pgTable("asset_spare_parts", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").references(() => assets.id).notNull(),
  sparePartId: integer("spare_part_id").references(() => spareParts.id).notNull(),
  quantityRequired: integer("quantity_required").default(1).notNull(),
});

// Compliance Records
export const complianceRecords = pgTable("compliance_records", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").references(() => assets.id).notNull(),
  regulationType: varchar("regulation_type", { length: 100 }).notNull(), // ISO, OSHA, EPA, etc.
  regulationName: varchar("regulation_name", { length: 255 }).notNull(),
  requirementDescription: text("requirement_description"),
  complianceStatus: varchar("compliance_status", { length: 50 }).notNull().default("compliant"), // compliant, non-compliant, pending
  lastInspectionDate: timestamp("last_inspection_date"),
  nextInspectionDate: timestamp("next_inspection_date"),
  inspectorName: varchar("inspector_name", { length: 255 }),
  certificateNumber: varchar("certificate_number", { length: 100 }),
  expiryDate: timestamp("expiry_date"),
  documentPath: varchar("document_path", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Energy Consumption tracking
export const energyConsumption = pgTable("energy_consumption", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").references(() => assets.id).notNull(),
  measurementDate: timestamp("measurement_date").notNull(),
  energyType: varchar("energy_type", { length: 50 }).notNull(), // electricity, gas, fuel, etc.
  consumption: decimal("consumption", { precision: 12, scale: 4 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(), // kWh, cubic_meters, liters, etc.
  cost: decimal("cost", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
  carbonFootprint: decimal("carbon_footprint", { precision: 10, scale: 4 }), // CO2 equivalent
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const assetsRelations = relations(assets, ({ many, one }) => ({
  maintenanceRecords: many(maintenanceRecords),
  auditLogs: many(auditLogs),
  workOrders: many(workOrders),
  complianceRecords: many(complianceRecords),
  energyConsumption: many(energyConsumption),
  assetSpareParts: many(assetSpareParts),
}));

export const workOrdersRelations = relations(workOrders, ({ one }) => ({
  asset: one(assets, {
    fields: [workOrders.assetId],
    references: [assets.id],
  }),
}));

export const locationsRelations = relations(locations, ({ many, one }) => ({
  assets: many(assets),
  spareParts: many(spareParts),
  parentLocation: one(locations, {
    fields: [locations.parentLocationId],
    references: [locations.id],
  }),
  childLocations: many(locations),
}));

export const vendorsRelations = relations(vendors, ({ many }) => ({
  serviceContracts: many(serviceContracts),
}));

export const serviceContractsRelations = relations(serviceContracts, ({ one }) => ({
  vendor: one(vendors, {
    fields: [serviceContracts.vendorId],
    references: [vendors.id],
  }),
}));

export const sparePartsRelations = relations(spareParts, ({ many, one }) => ({
  location: one(locations, {
    fields: [spareParts.locationId],
    references: [locations.id],
  }),
  assetSpareParts: many(assetSpareParts),
}));

export const assetSparePartsRelations = relations(assetSpareParts, ({ one }) => ({
  asset: one(assets, {
    fields: [assetSpareParts.assetId],
    references: [assets.id],
  }),
  sparePart: one(spareParts, {
    fields: [assetSpareParts.sparePartId],
    references: [spareParts.id],
  }),
}));

// Insert schemas
export const insertWorkOrderSchema = createInsertSchema(workOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceContractSchema = createInsertSchema(serviceContracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSparePartSchema = createInsertSchema(spareParts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertComplianceRecordSchema = createInsertSchema(complianceRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnergyConsumptionSchema = createInsertSchema(energyConsumption).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type WorkOrder = typeof workOrders.$inferSelect;
export type InsertWorkOrder = z.infer<typeof insertWorkOrderSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type ServiceContract = typeof serviceContracts.$inferSelect;
export type InsertServiceContract = z.infer<typeof insertServiceContractSchema>;
export type SparePart = typeof spareParts.$inferSelect;
export type InsertSparePart = z.infer<typeof insertSparePartSchema>;
export type ComplianceRecord = typeof complianceRecords.$inferSelect;
export type InsertComplianceRecord = z.infer<typeof insertComplianceRecordSchema>;
export type EnergyConsumption = typeof energyConsumption.$inferSelect;
export type InsertEnergyConsumption = z.infer<typeof insertEnergyConsumptionSchema>;

// Status constants
export const WorkOrderStatus = {
  OPEN: "open",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const WorkOrderPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export const ComplianceStatus = {
  COMPLIANT: "compliant",
  NON_COMPLIANT: "non-compliant",
  PENDING: "pending",
} as const;
