import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Asset, InsertAsset } from "@shared/schema";
import type { AssetMetrics, SearchOptions } from "@/lib/types";

export function useAssets(options?: SearchOptions) {
  const queryParams = new URLSearchParams();
  
  if (options?.query) {
    queryParams.append("search", options.query);
  }
  
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
  }
  
  const queryString = queryParams.toString();
  const url = `/api/assets${queryString ? `?${queryString}` : ""}`;
  
  return useQuery<Asset[]>({
    queryKey: [url],
  });
}

export function useAsset(id: number | undefined) {
  return useQuery<Asset>({
    queryKey: [`/api/assets/${id}`],
    enabled: !!id,
  });
}

export function useAssetMetrics() {
  return useQuery<AssetMetrics>({
    queryKey: ["/api/metrics"],
  });
}

export function useGenerateAssetId() {
  return useQuery<{ assetId: string }>({
    queryKey: ["/api/assets/generate-id"],
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (asset: InsertAsset) => {
      const response = await apiRequest("POST", "/api/assets", asset);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, asset }: { id: number; asset: Partial<InsertAsset> }) => {
      const response = await apiRequest("PUT", `/api/assets/${id}`, asset);
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      queryClient.invalidateQueries({ queryKey: [`/api/assets/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/assets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/metrics"] });
    },
  });
}
