import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { AssetTable } from "@/components/tables/asset-table";
import { AddAssetModal } from "@/components/modals/add-asset-modal";
import { AssetDetailModal } from "@/components/modals/asset-detail-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Asset } from "@shared/schema";

export default function Assets() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | undefined>();

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
    <AppLayout title="Asset Management" actions={actions}>
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
