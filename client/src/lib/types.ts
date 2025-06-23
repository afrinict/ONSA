export interface AssetMetrics {
  totalAssets: number;
  activeAssets: number;
  maintenanceAssets: number;
  retiredAssets: number;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface FilterOptions {
  category?: string;
  status?: string;
  location?: string;
  department?: string;
}

export interface SearchOptions {
  query?: string;
  filters?: FilterOptions;
}
