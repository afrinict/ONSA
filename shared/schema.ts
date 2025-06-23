import { pgTable, text, serial, integer, decimal, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
