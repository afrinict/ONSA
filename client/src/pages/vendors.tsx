import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Plus, Search, Building, Users, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Sample vendors data
const vendorsData = [
  {
    id: 1,
    name: "TechSupport Pro",
    code: "TSP",
    type: "contractor",
    contactPerson: "John Smith",
    email: "john@techsupport.com",
    phone: "+1-555-0123",
    specialties: ["IT Equipment", "Network Maintenance"],
    rating: 4.5,
    activeContracts: 3,
    isActive: true,
  },
  {
    id: 2,
    name: "Office Solutions Inc",
    code: "OSI",
    type: "vendor",
    contactPerson: "Sarah Johnson",
    email: "sarah@officesolutions.com",
    phone: "+1-555-0456",
    specialties: ["Furniture", "Office Supplies"],
    rating: 4.2,
    activeContracts: 2,
    isActive: true,
  },
  {
    id: 3,
    name: "Fleet Services Corp",
    code: "FSC",
    type: "contractor",
    contactPerson: "Mike Wilson",
    email: "mike@fleetservices.com",
    phone: "+1-555-0789",
    specialties: ["Vehicle Maintenance", "Fleet Management"],
    rating: 4.8,
    activeContracts: 1,
    isActive: true,
  },
  {
    id: 4,
    name: "Industrial Parts Supply",
    code: "IPS",
    type: "supplier",
    contactPerson: "Lisa Chen",
    email: "lisa@industrialparts.com",
    phone: "+1-555-0321",
    specialties: ["Machinery Parts", "Industrial Equipment"],
    rating: 4.1,
    activeContracts: 0,
    isActive: false,
  },
];

function getVendorTypeColor(type: string) {
  switch (type) {
    case "vendor":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "contractor":
      return "bg-green-100 text-green-800 border-green-200";
    case "supplier":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getRatingStars(rating: number) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={cn(
            i < fullStars ? "text-yellow-400 fill-current" :
            i === fullStars && hasHalfStar ? "text-yellow-400 fill-current" :
            "text-gray-300"
          )}
        />
      ))}
      <span className="ml-1 text-sm text-secondary-custom">{rating}</span>
    </div>
  );
}

export default function Vendors() {
  const [search, setSearch] = useState("");

  const filteredVendors = vendorsData.filter(vendor =>
    vendor.name.toLowerCase().includes(search.toLowerCase()) ||
    vendor.code.toLowerCase().includes(search.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    vendor.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const actions = (
    <Button>
      <Plus className="mr-2" size={16} />
      Add Vendor
    </Button>
  );

  const totalVendors = vendorsData.length;
  const activeVendors = vendorsData.filter(v => v.isActive).length;
  const totalContracts = vendorsData.reduce((sum, v) => sum + v.activeContracts, 0);
  const avgRating = (vendorsData.reduce((sum, v) => sum + v.rating, 0) / vendorsData.length).toFixed(1);

  return (
    <AppLayout title="Vendor Management" actions={actions}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Total Vendors</p>
                <p className="text-2xl font-semibold text-primary-custom">{totalVendors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Active Vendors</p>
                <p className="text-2xl font-semibold text-primary-custom">{activeVendors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Building className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Active Contracts</p>
                <p className="text-2xl font-semibold text-primary-custom">{totalContracts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Star className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Avg Rating</p>
                <p className="text-2xl font-semibold text-primary-custom">{avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card className="bg-surface border-border">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold text-primary-custom">Vendors & Contractors</CardTitle>
            <div className="mt-4 sm:mt-0">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-custom" size={16} />
                <Input
                  type="text"
                  placeholder="Search vendors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Specialties</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Active Contracts</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-border-subtle transition-colors">
                    <TableCell className="text-sm text-primary-custom font-medium">
                      {vendor.name}
                    </TableCell>
                    <TableCell className="text-sm font-mono text-secondary-custom">
                      {vendor.code}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("inline-flex items-center capitalize", getVendorTypeColor(vendor.type))}>
                        {vendor.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-secondary-custom">
                      {vendor.contactPerson}
                    </TableCell>
                    <TableCell className="text-sm text-secondary-custom">
                      <a href={`mailto:${vendor.email}`} className="text-blue-600 hover:underline">
                        {vendor.email}
                      </a>
                    </TableCell>
                    <TableCell className="text-sm text-secondary-custom">
                      <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:underline">
                        {vendor.phone}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {vendor.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {vendor.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{vendor.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRatingStars(vendor.rating)}
                    </TableCell>
                    <TableCell className="text-sm text-center">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        vendor.activeContracts > 0 ? 
                        "bg-green-100 text-green-800" : 
                        "bg-gray-100 text-gray-600"
                      )}>
                        {vendor.activeContracts}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "inline-flex items-center",
                        vendor.isActive ? 
                        "bg-green-100 text-green-800 border-green-200" : 
                        "bg-gray-100 text-gray-800 border-gray-200"
                      )}>
                        {vendor.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}