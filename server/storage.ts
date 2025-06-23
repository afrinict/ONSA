import { assets, maintenanceRecords, auditLogs, type Asset, type InsertAsset, type MaintenanceRecord, type InsertMaintenanceRecord, type AuditLog, type InsertAuditLog } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private assets: Map<number, Asset>;
  private maintenanceRecords: Map<number, MaintenanceRecord>;
  private auditLogs: Map<number, AuditLog>;
  private currentAssetId: number;
  private currentMaintenanceId: number;
  private currentAuditId: number;

  constructor() {
    this.assets = new Map();
    this.maintenanceRecords = new Map();
    this.auditLogs = new Map();
    this.currentAssetId = 1;
    this.currentMaintenanceId = 1;
    this.currentAuditId = 1;
    this.seedInitialData();
  }

  private seedInitialData() {
    // Add some initial sample assets for testing
    const sampleAssets = [
      {
        name: "Dell OptiPlex 7090",
        assetId: "AST-2025-001",
        category: "it-equipment",
        status: "active",
        location: "IT Department - Floor 3",
        department: "Information Technology",
        description: "Desktop computer for software development",
        purchaseDate: new Date("2024-01-15"),
        purchasePrice: "1299.99",
      },
      {
        name: "Conference Table",
        assetId: "AST-2025-002", 
        category: "furniture",
        status: "active",
        location: "Meeting Room A",
        department: "Administration",
        description: "8-person conference table with built-in power outlets",
        purchaseDate: new Date("2024-02-20"),
        purchasePrice: "2499.00",
      },
      {
        name: "HP LaserJet Pro",
        assetId: "AST-2025-003",
        category: "it-equipment", 
        status: "maintenance",
        location: "Print Center",
        department: "Operations",
        description: "High-volume laser printer for office documents",
        purchaseDate: new Date("2023-11-10"),
        purchasePrice: "899.99",
      },
      {
        name: "Ford Transit Van",
        assetId: "AST-2025-004",
        category: "vehicles",
        status: "active", 
        location: "Parking Garage Level 1",
        department: "Logistics",
        description: "Delivery van for equipment transport",
        purchaseDate: new Date("2023-08-05"),
        purchasePrice: "45000.00",
      },
      {
        name: "Industrial Printer",
        assetId: "AST-2025-005",
        category: "machinery",
        status: "retired",
        location: "Warehouse Storage",
        department: "Manufacturing",
        description: "Legacy printing equipment - end of life",
        purchaseDate: new Date("2020-03-15"),
        purchasePrice: "15000.00",
      }
    ];

    sampleAssets.forEach((assetData) => {
      const id = this.currentAssetId++;
      const now = new Date();
      const asset: Asset = {
        ...assetData,
        id,
        createdAt: now,
        updatedAt: now,
      };
      this.assets.set(id, asset);

      // Create audit log for initial asset
      this.createAuditLog({
        assetId: id,
        action: "created",
        changes: JSON.stringify(assetData),
        performedBy: "System",
      });
    });

    // Add some maintenance records
    this.createMaintenanceRecord({
      assetId: 3, // HP LaserJet Pro
      type: "Preventive Maintenance",
      description: "Replace toner cartridge and clean paper feed mechanism",
      scheduledDate: new Date("2025-01-15"),
      status: "in-progress",
      cost: "125.50",
      performedBy: "IT Support Team",
    });

    this.createMaintenanceRecord({
      assetId: 4, // Ford Transit Van
      type: "Routine Service",
      description: "Oil change and tire rotation",
      scheduledDate: new Date("2024-12-01"),
      completedDate: new Date("2024-12-01"),
      status: "completed",
      cost: "89.99",
      performedBy: "Fleet Services",
    });
  }

  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getAsset(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetByAssetId(assetId: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(asset => asset.assetId === assetId);
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
    const records = Array.from(this.maintenanceRecords.values());
    if (assetId) {
      return records.filter(record => record.assetId === assetId);
    }
    return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getMaintenanceRecord(id: number): Promise<MaintenanceRecord | undefined> {
    return this.maintenanceRecords.get(id);
  }

  async createMaintenanceRecord(insertRecord: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const id = this.currentMaintenanceId++;
    const record: MaintenanceRecord = {
      ...insertRecord,
      id,
      status: insertRecord.status || "scheduled",
      description: insertRecord.description || null,
      scheduledDate: insertRecord.scheduledDate || null,
      completedDate: insertRecord.completedDate || null,
      cost: insertRecord.cost?.toString() || null,
      performedBy: insertRecord.performedBy || null,
      createdAt: new Date(),
    };
    this.maintenanceRecords.set(id, record);
    return record;
  }

  async updateMaintenanceRecord(id: number, updateData: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord | undefined> {
    const existing = this.maintenanceRecords.get(id);
    if (!existing) return undefined;

    const updated: MaintenanceRecord = {
      ...existing,
      ...updateData,
    };
    this.maintenanceRecords.set(id, updated);
    return updated;
  }

  async getAuditLogs(assetId?: number): Promise<AuditLog[]> {
    const logs = Array.from(this.auditLogs.values());
    if (assetId) {
      return logs.filter(log => log.assetId === assetId);
    }
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = this.currentAuditId++;
    const log: AuditLog = {
      ...insertLog,
      id,
      assetId: insertLog.assetId || null,
      changes: insertLog.changes || null,
      timestamp: new Date(),
    };
    this.auditLogs.set(id, log);
    return log;
  }

  async getAssetMetrics(): Promise<{
    totalAssets: number;
    activeAssets: number;
    maintenanceAssets: number;
    retiredAssets: number;
  }> {
    const allAssets = Array.from(this.assets.values());
    return {
      totalAssets: allAssets.length,
      activeAssets: allAssets.filter(a => a.status === "active").length,
      maintenanceAssets: allAssets.filter(a => a.status === "maintenance").length,
      retiredAssets: allAssets.filter(a => a.status === "retired").length,
    };
  }
}

export const storage = new MemStorage();
