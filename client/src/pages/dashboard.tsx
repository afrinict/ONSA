import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { MetricCard } from "@/components/cards/metric-card";
import { AssetTable } from "@/components/tables/asset-table";
import { AddAssetModal } from "@/components/modals/add-asset-modal";
import { AssetDetailModal } from "@/components/modals/asset-detail-modal";
import { Button } from "@/components/ui/button";
import { useAssetMetrics } from "@/hooks/use-assets";
import { Package, CheckCircle, Wrench, AlertTriangle, Plus } from "lucide-react";
import type { Asset } from "@shared/schema";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | undefined>();
  
  const { data: metrics, isLoading } = useAssetMetrics();

  const handleViewAsset = (asset: Asset) => {
    setSelectedAssetId(asset.id);
    setIsDetailModalOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    // TODO: Implement edit functionality
    console.log("Edit asset:", asset);
  };

  const actions = (
    <Button onClick={() => setIsAddModalOpen(true)}>
      <Plus className="mr-2" size={16} />
      Add Asset
    </Button>
  );

  return (
    <AppLayout title="Asset Management Dashboard" actions={actions}>
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Assets"
          value={metrics?.totalAssets || 0}
          icon={Package}
          iconColor="text-primary"
          iconBgColor="bg-primary bg-opacity-10"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Active Assets"
          value={metrics?.activeAssets || 0}
          icon={CheckCircle}
          iconColor="text-success"
          iconBgColor="bg-success bg-opacity-10"
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="In Maintenance"
          value={metrics?.maintenanceAssets || 0}
          icon={Wrench}
          iconColor="text-warning"
          iconBgColor="bg-warning bg-opacity-10"
          trend={{ value: 3, isPositive: false }}
        />
        <MetricCard
          title="Retired"
          value={metrics?.retiredAssets || 0}
          icon={AlertTriangle}
          iconColor="text-error"
          iconBgColor="bg-error bg-opacity-10"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Asset Table */}
      <AssetTable 
        onViewAsset={handleViewAsset}
        onEditAsset={handleEditAsset}
      />

      {/* Modals */}
      <AddAssetModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
      
      <AssetDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        assetId={selectedAssetId}
        onEdit={() => {
          setIsDetailModalOpen(false);
          // TODO: Open edit modal
        }}
      />
    </AppLayout>
  );
}
