import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAssets, useDeleteAsset } from "@/hooks/use-assets";
import { useToast } from "@/hooks/use-toast";
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Asset } from "@shared/schema";
import type { FilterOptions } from "@/lib/types";

interface AssetTableProps {
  onViewAsset?: (asset: Asset) => void;
  onEditAsset?: (asset: Asset) => void;
}

const ITEMS_PER_PAGE = 10;

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "retired":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "active":
      return "fas fa-circle text-green-500";
    case "maintenance":
      return "fas fa-circle text-yellow-500";
    case "retired":
      return "fas fa-circle text-red-500";
    default:
      return "fas fa-circle text-gray-500";
  }
}

export function AssetTable({ onViewAsset, onEditAsset }: AssetTableProps) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const deleteAsset = useDeleteAsset();

  const { data: assets = [], isLoading } = useAssets({ 
    query: search, 
    filters 
  });

  // Pagination
  const totalPages = Math.ceil(assets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAssets = assets.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = async (asset: Asset) => {
    if (window.confirm(`Are you sure you want to delete ${asset.name}?`)) {
      try {
        await deleteAsset.mutateAsync(asset.id);
        toast({
          title: "Success",
          description: "Asset deleted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete asset. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const resetFilters = () => {
    setSearch("");
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold text-primary-custom">Recent Assets</CardTitle>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-custom" size={16} />
              <Input
                type="text"
                placeholder="Search assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
            
            {/* Filters */}
            <Select value={filters.category || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value === "all" ? undefined : value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="it-equipment">IT Equipment</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="vehicles">Vehicles</SelectItem>
                <SelectItem value="machinery">Machinery</SelectItem>
                <SelectItem value="office-supplies">Office Supplies</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.status || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === "all" ? undefined : value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
            
            {(search || Object.values(filters).some(v => v)) && (
              <Button variant="outline" onClick={resetFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-border-subtle transition-colors">
                  Asset ID
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-border-subtle transition-colors">
                  Name
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-border-subtle transition-colors">
                  Category
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-border-subtle transition-colors">
                  Location
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-border-subtle transition-colors">
                  Status
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-border-subtle transition-colors">
                  Last Updated
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <div className="animate-pulse bg-border-subtle h-4 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedAssets.length > 0 ? (
                paginatedAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-border-subtle transition-colors">
                    <TableCell className="text-sm font-mono text-primary-custom">
                      {asset.assetId}
                    </TableCell>
                    <TableCell className="text-sm text-primary-custom">
                      {asset.name}
                    </TableCell>
                    <TableCell className="text-sm text-secondary-custom capitalize">
                      {asset.category.replace('-', ' ')}
                    </TableCell>
                    <TableCell className="text-sm text-secondary-custom">
                      {asset.location}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("inline-flex items-center", getStatusColor(asset.status))}>
                        <i className={cn("text-xs mr-1", getStatusIcon(asset.status))} />
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-secondary-custom">
                      {format(new Date(asset.updatedAt), "PP")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewAsset?.(asset)}
                          className="h-8 w-8 text-primary hover:text-primary-hover"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditAsset?.(asset)}
                          className="h-8 w-8 text-secondary-custom hover:text-primary-custom"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(asset)}
                          disabled={deleteAsset.isPending}
                          className="h-8 w-8 text-error hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-secondary-custom">
                      {search || Object.values(filters).some(v => v) 
                        ? "No assets found matching your criteria"
                        : "No assets found. Create your first asset to get started."
                      }
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-secondary-custom">
                Showing{" "}
                <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + ITEMS_PER_PAGE, assets.length)}
                </span>{" "}
                of <span className="font-medium">{assets.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
