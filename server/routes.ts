import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssetSchema, insertMaintenanceRecordSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate Asset ID (must be before the parameterized route)
  app.get("/api/assets/generate-id", async (req, res) => {
    try {
      const year = new Date().getFullYear();
      const allAssets = await storage.getAssets();
      const yearAssets = allAssets.filter(a => a.assetId.startsWith(`AST-${year}-`));
      const nextNumber = yearAssets.length + 1;
      const assetId = `AST-${year}-${String(nextNumber).padStart(3, '0')}`;
      res.json({ assetId });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate asset ID" });
    }
  });

  // Asset Routes
  app.get("/api/assets", async (req, res) => {
    try {
      const { search, category, status, location, department } = req.query;
      
      let assets;
      if (search) {
        assets = await storage.searchAssets(search as string);
      } else if (category || status || location || department) {
        assets = await storage.filterAssets({
          category: category as string,
          status: status as string,
          location: location as string,
          department: department as string,
        });
      } else {
        assets = await storage.getAssets();
      }
      
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assets" });
    }
  });

  app.get("/api/assets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid asset ID" });
      }
      
      const asset = await storage.getAsset(id);
      
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.json(asset);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch asset" });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const validatedData = insertAssetSchema.parse(req.body);
      
      // Check if asset ID already exists
      const existing = await storage.getAssetByAssetId(validatedData.assetId);
      if (existing) {
        return res.status(400).json({ message: "Asset ID already exists" });
      }
      
      const asset = await storage.createAsset(validatedData);
      res.status(201).json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid asset data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create asset" });
    }
  });

  app.put("/api/assets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAssetSchema.partial().parse(req.body);
      
      const asset = await storage.updateAsset(id, validatedData);
      
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.json(asset);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid asset data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update asset" });
    }
  });

  app.delete("/api/assets/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAsset(id);
      
      if (!success) {
        return res.status(404).json({ message: "Asset not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete asset" });
    }
  });

  // Maintenance Routes
  app.get("/api/maintenance", async (req, res) => {
    try {
      const { assetId } = req.query;
      const records = await storage.getMaintenanceRecords(
        assetId ? parseInt(assetId as string) : undefined
      );
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch maintenance records" });
    }
  });

  app.post("/api/maintenance", async (req, res) => {
    try {
      const validatedData = insertMaintenanceRecordSchema.parse(req.body);
      const record = await storage.createMaintenanceRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid maintenance record data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create maintenance record" });
    }
  });

  // Audit Trail Routes
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const { assetId } = req.query;
      const logs = await storage.getAuditLogs(
        assetId ? parseInt(assetId as string) : undefined
      );
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Analytics Routes
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await storage.getAssetMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
