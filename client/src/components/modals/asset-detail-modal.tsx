import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAsset } from "@/hooks/use-assets";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { MaintenanceRecord } from "@shared/schema";

interface AssetDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assetId: number | undefined;
  onEdit?: () => void;
}

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

export function AssetDetailModal({ open, onOpenChange, assetId, onEdit }: AssetDetailModalProps) {
  const { data: asset, isLoading } = useAsset(assetId);
  
  const { data: maintenanceRecords } = useQuery<MaintenanceRecord[]>({
    queryKey: [`/api/maintenance?assetId=${assetId}`],
    enabled: !!assetId && open,
  });

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary-custom">Asset Details</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : asset ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-custom mb-1">Asset ID</label>
                <p className="text-sm font-mono text-primary-custom">{asset.assetId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-custom mb-1">Asset Name</label>
                <p className="text-sm text-primary-custom">{asset.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-custom mb-1">Category</label>
                <p className="text-sm text-primary-custom capitalize">{asset.category.replace('-', ' ')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-custom mb-1">Status</label>
                <Badge className={cn("inline-flex items-center", getStatusColor(asset.status))}>
                  <i className={cn("text-xs mr-1", getStatusIcon(asset.status))} />
                  {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-custom mb-1">Location</label>
                <p className="text-sm text-primary-custom">{asset.location}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-custom mb-1">Department</label>
                <p className="text-sm text-primary-custom">{asset.department || "Not specified"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-custom mb-1">Purchase Date</label>
                <p className="text-sm text-primary-custom">
                  {asset.purchaseDate ? format(new Date(asset.purchaseDate), "PPP") : "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-custom mb-1">Purchase Price</label>
                <p className="text-sm text-primary-custom">
                  {asset.purchasePrice ? `$${parseFloat(asset.purchasePrice).toLocaleString()}` : "Not specified"}
                </p>
              </div>
            </div>

            {asset.description && (
              <div>
                <label className="block text-sm font-medium text-secondary-custom mb-1">Description</label>
                <p className="text-sm text-primary-custom">{asset.description}</p>
              </div>
            )}

            {/* Maintenance History */}
            <div>
              <label className="block text-sm font-medium text-secondary-custom mb-3">Recent Maintenance</label>
              <div className="bg-border-subtle rounded-lg p-4">
                {maintenanceRecords && maintenanceRecords.length > 0 ? (
                  <div className="space-y-3">
                    {maintenanceRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center justify-between text-sm">
                        <span className="text-primary-custom">{record.type}</span>
                        <span className="text-secondary-custom">
                          {record.completedDate 
                            ? format(new Date(record.completedDate), "PP")
                            : record.scheduledDate 
                            ? format(new Date(record.scheduledDate), "PP")
                            : "No date"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-secondary-custom">No maintenance records found</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={onEdit}
                >
                  <i className="fas fa-edit mr-2" />
                  Edit Asset
                </Button>
              )}
              <Button
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-secondary-custom">Asset not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
