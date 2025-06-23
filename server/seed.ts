import { db } from "./db";
import { assets, maintenanceRecords, workOrders, locations, vendors, spareParts, complianceRecords } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingAssets = await db.select().from(assets).limit(1);
    if (existingAssets.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database with sample data...");

    // Seed Locations
    const sampleLocations = await db.insert(locations).values([
      {
        name: "Main Building",
        code: "MB",
        type: "building",
        address: "123 Main Street, Business District",
        description: "Primary office building",
        capacity: 500,
      },
      {
        name: "IT Department - Floor 3",
        code: "IT-F3",
        type: "department",
        description: "Information Technology department on 3rd floor",
        capacity: 50,
      },
      {
        name: "Warehouse A",
        code: "WH-A",
        type: "warehouse",
        address: "456 Industrial Drive",
        description: "Main storage warehouse",
        capacity: 1000,
      },
    ]).returning();

    // Seed Vendors
    const sampleVendors = await db.insert(vendors).values([
      {
        name: "TechSupport Pro",
        code: "TSP",
        type: "contractor",
        contactPerson: "John Smith",
        email: "john@techsupport.com",
        phone: "+1-555-0123",
        specialties: ["IT Equipment", "Network Maintenance"],
        rating: "4.5",
      },
      {
        name: "Office Solutions Inc",
        code: "OSI",
        type: "vendor",
        contactPerson: "Sarah Johnson",
        email: "sarah@officesolutions.com",
        phone: "+1-555-0456",
        specialties: ["Furniture", "Office Supplies"],
        rating: "4.2",
      },
    ]).returning();

    // Seed Assets
    const sampleAssets = await db.insert(assets).values([
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
      },
    ]).returning();

    // Seed Work Orders
    await db.insert(workOrders).values([
      {
        workOrderId: "WO-2025-001",
        assetId: sampleAssets[2].id, // HP LaserJet Pro
        title: "Preventive Maintenance - Printer",
        description: "Replace toner cartridge and clean paper feed mechanism",
        type: "preventive",
        priority: "high",
        status: "in-progress",
        assignedTo: "John Smith",
        estimatedHours: "2.0",
        scheduledDate: new Date("2025-01-15"),
        cost: "125.50",
      },
      {
        workOrderId: "WO-2025-002",
        assetId: sampleAssets[3].id, // Ford Transit Van
        title: "Routine Vehicle Service",
        description: "Oil change and tire rotation",
        type: "preventive",
        priority: "medium",
        status: "completed",
        assignedTo: "Mike Johnson",
        estimatedHours: "1.5",
        actualHours: "1.25",
        scheduledDate: new Date("2024-12-01"),
        completedDate: new Date("2024-12-01"),
        cost: "89.99",
      },
    ]);

    // Seed Maintenance Records
    await db.insert(maintenanceRecords).values([
      {
        assetId: sampleAssets[2].id, // HP LaserJet Pro
        type: "Preventive Maintenance",
        description: "Replace toner cartridge and clean paper feed mechanism",
        scheduledDate: new Date("2025-01-15"),
        status: "in-progress",
        cost: "125.50",
        performedBy: "IT Support Team",
      },
      {
        assetId: sampleAssets[3].id, // Ford Transit Van
        type: "Routine Service",
        description: "Oil change and tire rotation",
        scheduledDate: new Date("2024-12-01"),
        completedDate: new Date("2024-12-01"),
        status: "completed",
        cost: "89.99",
        performedBy: "Fleet Services",
      },
    ]);

    // Seed Spare Parts
    await db.insert(spareParts).values([
      {
        partNumber: "HP-TNR-CF400A",
        name: "HP LaserJet Toner Cartridge",
        description: "Black toner cartridge for HP LaserJet Pro series",
        category: "consumables",
        manufacturer: "HP",
        modelNumber: "CF400A",
        unitOfMeasure: "piece",
        unitCost: "89.99",
        currentStock: 15,
        minimumStock: 5,
        reorderPoint: 8,
        locationId: sampleLocations[0].id,
      },
      {
        partNumber: "FORD-OIL-5W30",
        name: "Engine Oil 5W-30",
        description: "Synthetic engine oil for Ford Transit",
        category: "fluids",
        manufacturer: "Ford",
        unitOfMeasure: "liter",
        unitCost: "8.50",
        currentStock: 25,
        minimumStock: 10,
        reorderPoint: 15,
        locationId: sampleLocations[2].id,
      },
    ]);

    // Seed Compliance Records
    await db.insert(complianceRecords).values([
      {
        assetId: sampleAssets[3].id, // Ford Transit Van
        regulationType: "DOT",
        regulationName: "Vehicle Safety Inspection",
        requirementDescription: "Annual safety inspection for commercial vehicles",
        complianceStatus: "compliant",
        lastInspectionDate: new Date("2024-06-15"),
        nextInspectionDate: new Date("2025-06-15"),
        inspectorName: "City Motor Vehicle Department",
        certificateNumber: "DOT-2024-ABC123",
        expiryDate: new Date("2025-06-15"),
      },
      {
        assetId: sampleAssets[0].id, // Dell OptiPlex
        regulationType: "ISO",
        regulationName: "ISO 27001 IT Security",
        requirementDescription: "Information security management compliance",
        complianceStatus: "compliant",
        lastInspectionDate: new Date("2024-03-01"),
        nextInspectionDate: new Date("2025-03-01"),
        inspectorName: "IT Security Team",
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}