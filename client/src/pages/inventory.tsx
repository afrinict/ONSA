import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Package, AlertTriangle, TrendingDown, Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Sample spare parts inventory data
const sparePartsInventory = [
  {
    id: 1,
    partNumber: "HP-TNR-CF400A",
    name: "HP LaserJet Toner Cartridge",
    category: "consumables",
    manufacturer: "HP",
    unitCost: 89.99,
    currentStock: 15,
    minimumStock: 5,
    reorderPoint: 8,
    location: "Main Warehouse",
    status: "in-stock",
  },
  {
    id: 2,
    partNumber: "FORD-OIL-5W30",
    name: "Engine Oil 5W-30",
    category: "fluids",
    manufacturer: "Ford",
    unitCost: 8.50,
    currentStock: 25,
    minimumStock: 10,
    reorderPoint: 15,
    location: "Vehicle Maintenance Bay",
    status: "in-stock",
  },
  {
    id: 3,
    partNumber: "DELL-RAM-16GB",
    name: "16GB DDR4 Memory Module",
    category: "hardware",
    manufacturer: "Dell",
    unitCost: 125.00,
    currentStock: 3,
    minimumStock: 5,
    reorderPoint: 8,
    location: "IT Storage Room",
    status: "low-stock",
  },
  {
    id: 4,
    partNumber: "GEN-FLT-AIR",
    name: "Universal Air Filter",
    category: "filters",
    manufacturer: "Generic",
    unitCost: 15.75,
    currentStock: 0,
    minimumStock: 10,
    reorderPoint: 15,
    location: "HVAC Storage",
    status: "out-of-stock",
  },
  {
    id: 5,
    partNumber: "HP-DRUM-CF219A",
    name: "HP Imaging Drum Unit",
    category: "consumables",
    manufacturer: "HP",
    unitCost: 156.99,
    currentStock: 7,
    minimumStock: 3,
    reorderPoint: 5,
    location: "Main Warehouse",
    status: "needs-reorder",
  },
];

function getStockStatusColor(status: string) {
  switch (status) {
    case "in-stock":
      return "bg-green-100 text-green-800 border-green-200";
    case "low-stock":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "needs-reorder":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "out-of-stock":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStockStatus(item: any) {
  if (item.currentStock === 0) return "out-of-stock";
  if (item.currentStock <= item.minimumStock) return "low-stock";
  if (item.currentStock <= item.reorderPoint) return "needs-reorder";
  return "in-stock";
}

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredInventory = sparePartsInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.partNumber.toLowerCase().includes(search.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const actions = (
    <Button>
      <Plus className="mr-2" size={16} />
      Add Spare Part
    </Button>
  );

  const totalItems = sparePartsInventory.length;
  const lowStockItems = sparePartsInventory.filter(item => getStockStatus(item) === "low-stock").length;
  const outOfStockItems = sparePartsInventory.filter(item => getStockStatus(item) === "out-of-stock").length;
  const reorderItems = sparePartsInventory.filter(item => getStockStatus(item) === "needs-reorder").length;

  return (
    <AppLayout title="Inventory Management" actions={actions}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Total Items</p>
                <p className="text-2xl font-semibold text-primary-custom">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <TrendingDown className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Low Stock</p>
                <p className="text-2xl font-semibold text-primary-custom">{lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Out of Stock</p>
                <p className="text-2xl font-semibold text-primary-custom">{outOfStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Package className="text-orange-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Needs Reorder</p>
                <p className="text-2xl font-semibold text-primary-custom">{reorderItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="bg-surface border-border">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold text-primary-custom">Spare Parts Inventory</CardTitle>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-custom" size={16} />
                <Input
                  type="text"
                  placeholder="Search parts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
              </div>
              
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="consumables">Consumables</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="fluids">Fluids</SelectItem>
                  <SelectItem value="filters">Filters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-border-subtle transition-colors">
                      <TableCell className="text-sm font-mono text-primary-custom">
                        {item.partNumber}
                      </TableCell>
                      <TableCell className="text-sm text-primary-custom">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {item.manufacturer}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        ${item.unitCost.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className={cn(
                          "font-medium",
                          item.currentStock === 0 ? "text-red-600" :
                          item.currentStock <= item.minimumStock ? "text-yellow-600" :
                          "text-green-600"
                        )}>
                          {item.currentStock}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {item.minimumStock}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("inline-flex items-center capitalize", getStockStatusColor(status))}>
                          {status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {item.location}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}