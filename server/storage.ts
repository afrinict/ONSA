import { 
  assets, 
  maintenanceRecords, 
  auditLogs, 
  workOrders,
  locations,
  vendors,
  serviceContracts,
  spareParts,
  complianceRecords,
  energyConsumption,
  type Asset, 
  type InsertAsset, 
  type MaintenanceRecord, 
  type InsertMaintenanceRecord, 
  type AuditLog, 
  type InsertAuditLog,
  type WorkOrder,
  type InsertWorkOrder,
  type Location,
  type InsertLocation,
  type Vendor,
  type InsertVendor,
  type ServiceContract,
  type InsertServiceContract,
  type SparePart,
  type InsertSparePart,
  type ComplianceRecord,
  type InsertComplianceRecord,
  type EnergyConsumption,
  type InsertEnergyConsumption
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // Assets
  getAssets(): Promise<Asset[]>;
  getAsset(id: number): Promise<Asset | undefined>;
  getAssetByAssetId(assetId: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: Partial<InsertAsset>): Promise<Asset | undefined>;
  deleteAsset(id: number): Promise<boolean>;
  searchAssets(query: string): Promise<Asset[]>;
  filterAssets(filters: { category?: string; status?: string; location?: string; department?: string }): Promise<Asset[]>;
  
  // Maintenance Records
  getMaintenanceRecords(assetId?: number): Promise<MaintenanceRecord[]>;
  getMaintenanceRecord(id: number): Promise<MaintenanceRecord | undefined>;
  createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord>;
  updateMaintenanceRecord(id: number, record: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined>;
  
  // Work Orders
  getWorkOrders(): Promise<WorkOrder[]>;
  getWorkOrder(id: number): Promise<WorkOrder | undefined>;
  createWorkOrder(workOrder: InsertWorkOrder): Promise<WorkOrder>;
  updateWorkOrder(id: number, workOrder: Partial<InsertWorkOrder>): Promise<WorkOrder | undefined>;
  deleteWorkOrder(id: number): Promise<boolean>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  getLocation(id: number): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: number): Promise<boolean>;
  
  // Vendors
  getVendors(): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor | undefined>;
  deleteVendor(id: number): Promise<boolean>;
  
  // Service Contracts
  getServiceContracts(): Promise<ServiceContract[]>;
  getServiceContract(id: number): Promise<ServiceContract | undefined>;
  createServiceContract(contract: InsertServiceContract): Promise<ServiceContract>;
  updateServiceContract(id: number, contract: Partial<InsertServiceContract>): Promise<ServiceContract | undefined>;
  deleteServiceContract(id: number): Promise<boolean>;
  
  // Spare Parts
  getSpareParts(): Promise<SparePart[]>;
  getSparePart(id: number): Promise<SparePart | undefined>;
  createSparePart(sparePart: InsertSparePart): Promise<SparePart>;
  updateSparePart(id: number, sparePart: Partial<InsertSparePart>): Promise<SparePart | undefined>;
  deleteSparePart(id: number): Promise<boolean>;
  
  // Compliance Records
  getComplianceRecords(assetId?: number): Promise<ComplianceRecord[]>;
  getComplianceRecord(id: number): Promise<ComplianceRecord | undefined>;
  createComplianceRecord(record: InsertComplianceRecord): Promise<ComplianceRecord>;
  updateComplianceRecord(id: number, record: Partial<InsertComplianceRecord>): Promise<ComplianceRecord | undefined>;
  deleteComplianceRecord(id: number): Promise<boolean>;
  
  // Energy Consumption
  getEnergyConsumption(assetId?: number): Promise<EnergyConsumption[]>;
  createEnergyConsumption(consumption: InsertEnergyConsumption): Promise<EnergyConsumption>;
  
  // Audit Logs
  getAuditLogs(assetId?: number): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  
  // Analytics
  getAssetMetrics(): Promise<{
    totalAssets: number;
    activeAssets: number;
    maintenanceAssets: number;
    retiredAssets: number;
  }>;
  
  getWorkOrderMetrics(): Promise<{
    totalWorkOrders: number;
    openWorkOrders: number;
    inProgressWorkOrders: number;
    completedWorkOrders: number;
    overdueWorkOrders: number;
  }>;
  
  getMaintenanceMetrics(): Promise<{
    totalScheduled: number;
    upcoming: number;
    overdue: number;
    completedThisMonth: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Database storage - no need for in-memory maps
  }

  async getAssets(): Promise<Asset[]> {
    const result = await db.select().from(assets).orderBy(desc(assets.createdAt));
    return result;
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset || undefined;
  }

  async getAssetByAssetId(assetId: string): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.assetId, assetId));
    return asset || undefined;
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const [asset] = await db.insert(assets).values(insertAsset).returning();
    
    // Create audit log
    await this.createAuditLog({
      assetId: asset.id,
      action: "created",
      changes: JSON.stringify(insertAsset),
      performedBy: "System",
    });
    
    return asset;
  }

  async updateAsset(id: number, updateData: Partial<InsertAsset>): Promise<Asset | undefined> {
    const [updated] = await db.update(assets)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(assets.id, id))
      .returning();

    if (updated) {
      // Create audit log
      await this.createAuditLog({
        assetId: id,
        action: "updated",
        changes: JSON.stringify(updateData),
        performedBy: "System",
      });
    }

    return updated || undefined;
  }

  async deleteAsset(id: number): Promise<boolean> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    if (!asset) return false;

    await db.delete(assets).where(eq(assets.id, id));
    
    // Create audit log
    await this.createAuditLog({
      assetId: id,
      action: "deleted",
      changes: JSON.stringify(asset),
      performedBy: "System",
    });

    return true;
  }

  async searchAssets(query: string): Promise<Asset[]> {
    const result = await db.select().from(assets).where(
      or(
        like(assets.name, `%${query}%`),
        like(assets.assetId, `%${query}%`),
        like(assets.category, `%${query}%`),
        like(assets.location, `%${query}%`),
        like(assets.department, `%${query}%`),
        like(assets.description, `%${query}%`)
      )
    ).orderBy(desc(assets.createdAt));
    return result;
  }

  async filterAssets(filters: { category?: string; status?: string; location?: string; department?: string }): Promise<Asset[]> {
    const conditions = [];
    
    if (filters.category) conditions.push(eq(assets.category, filters.category));
    if (filters.status) conditions.push(eq(assets.status, filters.status));
    if (filters.location) conditions.push(eq(assets.location, filters.location));
    if (filters.department) conditions.push(eq(assets.department, filters.department));

    const result = await db.select().from(assets)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(assets.createdAt));
    return result;
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.currentAssetId++;
    const now = new Date();
    const asset: Asset = {
      ...insertAsset,
      id,
      status: insertAsset.status || "active",
      department: insertAsset.department || null,
      description: insertAsset.description || null,
      purchaseDate: insertAsset.purchaseDate || null,
      purchasePrice: insertAsset.purchasePrice?.toString() || null,
      createdAt: now,
      updatedAt: now,
    };
    this.assets.set(id, asset);
    
    // Create audit log
    await this.createAuditLog({
      assetId: id,
      action: "created",
      changes: JSON.stringify(insertAsset),
      performedBy: "System",
    });
    
    return asset;
  }

  async updateAsset(id: number, updateData: Partial<InsertAsset>): Promise<Asset | undefined> {
    const existing = this.assets.get(id);
    if (!existing) return undefined;

    const updated: Asset = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.assets.set(id, updated);

    // Create audit log
    await this.createAuditLog({
      assetId: id,
      action: "updated",
      changes: JSON.stringify(updateData),
      performedBy: "System",
    });

    return updated;
  }

  async deleteAsset(id: number): Promise<boolean> {
    const asset = this.assets.get(id);
    if (!asset) return false;

    this.assets.delete(id);
    
    // Create audit log
    await this.createAuditLog({
      assetId: id,
      action: "deleted",
      changes: JSON.stringify(asset),
      performedBy: "System",
    });

    return true;
  }

  async searchAssets(query: string): Promise<Asset[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.assets.values()).filter(asset =>
      asset.name.toLowerCase().includes(lowerQuery) ||
      asset.assetId.toLowerCase().includes(lowerQuery) ||
      asset.category.toLowerCase().includes(lowerQuery) ||
      asset.location.toLowerCase().includes(lowerQuery) ||
      (asset.department && asset.department.toLowerCase().includes(lowerQuery)) ||
      (asset.description && asset.description.toLowerCase().includes(lowerQuery))
    );
  }

  async filterAssets(filters: { category?: string; status?: string; location?: string; department?: string }): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(asset => {
      if (filters.category && asset.category !== filters.category) return false;
      if (filters.status && asset.status !== filters.status) return false;
      if (filters.location && asset.location !== filters.location) return false;
      if (filters.department && asset.department !== filters.department) return false;
      return true;
    });
  }

  async getMaintenanceRecords(assetId?: number): Promise<MaintenanceRecord[]> {
    if (assetId) {
      const result = await db.select().from(maintenanceRecords)
        .where(eq(maintenanceRecords.assetId, assetId))
        .orderBy(desc(maintenanceRecords.createdAt));
      return result;
    }
    const result = await db.select().from(maintenanceRecords)
      .orderBy(desc(maintenanceRecords.createdAt));
    return result;
  }

  async getMaintenanceRecord(id: number): Promise<MaintenanceRecord | undefined> {
    const [record] = await db.select().from(maintenanceRecords).where(eq(maintenanceRecords.id, id));
    return record || undefined;
  }

  async createMaintenanceRecord(insertRecord: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const [record] = await db.insert(maintenanceRecords).values(insertRecord).returning();
    return record;
  }

  async updateMaintenanceRecord(id: number, updateData: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined> {
    const [updated] = await db.update(maintenanceRecords)
      .set(updateData)
      .where(eq(maintenanceRecords.id, id))
      .returning();
    return updated || undefined;
  }

  async getAuditLogs(assetId?: number): Promise<AuditLog[]> {
    if (assetId) {
      const result = await db.select().from(auditLogs)
        .where(eq(auditLogs.assetId, assetId))
        .orderBy(desc(auditLogs.timestamp));
      return result;
    }
    const result = await db.select().from(auditLogs)
      .orderBy(desc(auditLogs.timestamp));
    return result;
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db.insert(auditLogs).values(insertLog).returning();
    return log;
  }

  async getAssetMetrics(): Promise<{
    totalAssets: number;
    activeAssets: number;
    maintenanceAssets: number;
    retiredAssets: number;
  }> {
    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(assets);
    const [activeResult] = await db.select({ count: sql<number>`count(*)` }).from(assets).where(eq(assets.status, "active"));
    const [maintenanceResult] = await db.select({ count: sql<number>`count(*)` }).from(assets).where(eq(assets.status, "maintenance"));
    const [retiredResult] = await db.select({ count: sql<number>`count(*)` }).from(assets).where(eq(assets.status, "retired"));

    return {
      totalAssets: totalResult.count,
      activeAssets: activeResult.count,
      maintenanceAssets: maintenanceResult.count,
      retiredAssets: retiredResult.count,
    };
  }

  // Work Orders implementation
  async getWorkOrders(): Promise<WorkOrder[]> {
    const result = await db.select().from(workOrders).orderBy(desc(workOrders.createdAt));
    return result;
  }

  async getWorkOrder(id: number): Promise<WorkOrder | undefined> {
    const [workOrder] = await db.select().from(workOrders).where(eq(workOrders.id, id));
    return workOrder || undefined;
  }

  async createWorkOrder(insertWorkOrder: InsertWorkOrder): Promise<WorkOrder> {
    const [workOrder] = await db.insert(workOrders).values(insertWorkOrder).returning();
    return workOrder;
  }

  async updateWorkOrder(id: number, updateData: Partial<InsertWorkOrder>): Promise<WorkOrder | undefined> {
    const [updated] = await db.update(workOrders)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(workOrders.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteWorkOrder(id: number): Promise<boolean> {
    const result = await db.delete(workOrders).where(eq(workOrders.id, id));
    return true;
  }

  // Locations implementation
  async getLocations(): Promise<Location[]> {
    const result = await db.select().from(locations).orderBy(desc(locations.createdAt));
    return result;
  }

  async getLocation(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location || undefined;
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const [location] = await db.insert(locations).values(insertLocation).returning();
    return location;
  }

  async updateLocation(id: number, updateData: Partial<InsertLocation>): Promise<Location | undefined> {
    const [updated] = await db.update(locations)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(locations.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteLocation(id: number): Promise<boolean> {
    await db.delete(locations).where(eq(locations.id, id));
    return true;
  }

  // Vendors implementation
  async getVendors(): Promise<Vendor[]> {
    const result = await db.select().from(vendors).orderBy(desc(vendors.createdAt));
    return result;
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const [vendor] = await db.insert(vendors).values(insertVendor).returning();
    return vendor;
  }

  async updateVendor(id: number, updateData: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const [updated] = await db.update(vendors)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(vendors.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteVendor(id: number): Promise<boolean> {
    await db.delete(vendors).where(eq(vendors.id, id));
    return true;
  }

  // Service Contracts implementation
  async getServiceContracts(): Promise<ServiceContract[]> {
    const result = await db.select().from(serviceContracts).orderBy(desc(serviceContracts.createdAt));
    return result;
  }

  async getServiceContract(id: number): Promise<ServiceContract | undefined> {
    const [contract] = await db.select().from(serviceContracts).where(eq(serviceContracts.id, id));
    return contract || undefined;
  }

  async createServiceContract(insertContract: InsertServiceContract): Promise<ServiceContract> {
    const [contract] = await db.insert(serviceContracts).values(insertContract).returning();
    return contract;
  }

  async updateServiceContract(id: number, updateData: Partial<InsertServiceContract>): Promise<ServiceContract | undefined> {
    const [updated] = await db.update(serviceContracts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(serviceContracts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteServiceContract(id: number): Promise<boolean> {
    await db.delete(serviceContracts).where(eq(serviceContracts.id, id));
    return true;
  }

  // Spare Parts implementation
  async getSpareParts(): Promise<SparePart[]> {
    const result = await db.select().from(spareParts).orderBy(desc(spareParts.createdAt));
    return result;
  }

  async getSparePart(id: number): Promise<SparePart | undefined> {
    const [sparePart] = await db.select().from(spareParts).where(eq(spareParts.id, id));
    return sparePart || undefined;
  }

  async createSparePart(insertSparePart: InsertSparePart): Promise<SparePart> {
    const [sparePart] = await db.insert(spareParts).values(insertSparePart).returning();
    return sparePart;
  }

  async updateSparePart(id: number, updateData: Partial<InsertSparePart>): Promise<SparePart | undefined> {
    const [updated] = await db.update(spareParts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(spareParts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteSparePart(id: number): Promise<boolean> {
    await db.delete(spareParts).where(eq(spareParts.id, id));
    return true;
  }

  // Compliance Records implementation
  async getComplianceRecords(assetId?: number): Promise<ComplianceRecord[]> {
    if (assetId) {
      const result = await db.select().from(complianceRecords)
        .where(eq(complianceRecords.assetId, assetId))
        .orderBy(desc(complianceRecords.createdAt));
      return result;
    }
    const result = await db.select().from(complianceRecords)
      .orderBy(desc(complianceRecords.createdAt));
    return result;
  }

  async getComplianceRecord(id: number): Promise<ComplianceRecord | undefined> {
    const [record] = await db.select().from(complianceRecords).where(eq(complianceRecords.id, id));
    return record || undefined;
  }

  async createComplianceRecord(insertRecord: InsertComplianceRecord): Promise<ComplianceRecord> {
    const [record] = await db.insert(complianceRecords).values(insertRecord).returning();
    return record;
  }

  async updateComplianceRecord(id: number, updateData: Partial<InsertComplianceRecord>): Promise<ComplianceRecord | undefined> {
    const [updated] = await db.update(complianceRecords)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(complianceRecords.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteComplianceRecord(id: number): Promise<boolean> {
    await db.delete(complianceRecords).where(eq(complianceRecords.id, id));
    return true;
  }

  // Energy Consumption implementation
  async getEnergyConsumption(assetId?: number): Promise<EnergyConsumption[]> {
    if (assetId) {
      const result = await db.select().from(energyConsumption)
        .where(eq(energyConsumption.assetId, assetId))
        .orderBy(desc(energyConsumption.measurementDate));
      return result;
    }
    const result = await db.select().from(energyConsumption)
      .orderBy(desc(energyConsumption.measurementDate));
    return result;
  }

  async createEnergyConsumption(insertConsumption: InsertEnergyConsumption): Promise<EnergyConsumption> {
    const [consumption] = await db.insert(energyConsumption).values(insertConsumption).returning();
    return consumption;
  }

  // Additional metrics
  async getWorkOrderMetrics(): Promise<{
    totalWorkOrders: number;
    openWorkOrders: number;
    inProgressWorkOrders: number;
    completedWorkOrders: number;
    overdueWorkOrders: number;
  }> {
    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(workOrders);
    const [openResult] = await db.select({ count: sql<number>`count(*)` }).from(workOrders).where(eq(workOrders.status, "open"));
    const [inProgressResult] = await db.select({ count: sql<number>`count(*)` }).from(workOrders).where(eq(workOrders.status, "in-progress"));
    const [completedResult] = await db.select({ count: sql<number>`count(*)` }).from(workOrders).where(eq(workOrders.status, "completed"));
    
    // For overdue, we need to check scheduled date vs current date
    const [overdueResult] = await db.select({ count: sql<number>`count(*)` }).from(workOrders)
      .where(and(
        sql`${workOrders.scheduledDate} < NOW()`,
        sql`${workOrders.status} != 'completed'`
      ));

    return {
      totalWorkOrders: totalResult.count,
      openWorkOrders: openResult.count,
      inProgressWorkOrders: inProgressResult.count,
      completedWorkOrders: completedResult.count,
      overdueWorkOrders: overdueResult.count,
    };
  }

  async getMaintenanceMetrics(): Promise<{
    totalScheduled: number;
    upcoming: number;
    overdue: number;
    completedThisMonth: number;
  }> {
    const [totalResult] = await db.select({ count: sql<number>`count(*)` }).from(maintenanceRecords);
    const [upcomingResult] = await db.select({ count: sql<number>`count(*)` }).from(maintenanceRecords)
      .where(and(
        sql`${maintenanceRecords.scheduledDate} > NOW()`,
        eq(maintenanceRecords.status, "scheduled")
      ));
    const [overdueResult] = await db.select({ count: sql<number>`count(*)` }).from(maintenanceRecords)
      .where(and(
        sql`${maintenanceRecords.scheduledDate} < NOW()`,
        sql`${maintenanceRecords.status} != 'completed'`
      ));
    const [completedThisMonthResult] = await db.select({ count: sql<number>`count(*)` }).from(maintenanceRecords)
      .where(and(
        eq(maintenanceRecords.status, "completed"),
        sql`EXTRACT(MONTH FROM ${maintenanceRecords.completedDate}) = EXTRACT(MONTH FROM NOW())`,
        sql`EXTRACT(YEAR FROM ${maintenanceRecords.completedDate}) = EXTRACT(YEAR FROM NOW())`
      ));

    return {
      totalScheduled: totalResult.count,
      upcoming: upcomingResult.count,
      overdue: overdueResult.count,
      completedThisMonth: completedThisMonthResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
