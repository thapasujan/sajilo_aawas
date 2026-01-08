import type { ReactElement } from "react";

export interface IRoutesConfig {
  path: string;
  element: ReactElement;
  children?: IRoutesConfig[];
}

export interface ISidebarDashboardRoutes {
  title: string;
  routes: {
    id: number;
    path: string;
    title: string;
    icon: string;
    children?: {
      path: string;
      id: number;
      title: string;
    }[];
  }[];
}

export interface IPagination {
  totalPage: number;
  currentPage: number;
  limit: number;
  onClick: (params: { page?: number; limit?: number }) => void;
}

export interface ITableData {
  [key: string]: any;
}

export interface ITableHeader {
  columns: {
    key: string;
    title: string | React.ReactNode;
  }[];
  loading: boolean;
  color?: string;
  textcolor?: string;
}

export interface IMasterTable {
  columns: { key: string; title: string | React.ReactNode }[];
  rows: ITableData[];
  loading: boolean;
  pagination?: IPagination;
  className?: string;
  color?: string;
  textcolor?: string;
  // Checkbox functionality props
  showCheckbox?: boolean;
  selectedIds?: (string | number)[];
  onSelectAll?: (isSelected: boolean, allIds: (string | number)[]) => void;
  onSelectRow?: (id: string | number, isSelected: boolean) => void;
  primaryKey?: string;
  onBulkAction?: (selectedIds: (string | number)[]) => void;
  bulkActionLabel?: string;
  showBulkActions?: boolean;
}

export interface ITableRows {
  columns: ITableColumn[];
  rows: ITableData[];
  loading: boolean;

  index?: number;
}

export interface ITableColumn {
  key: string;
  title: string | React.ReactNode;
  render?: (data: { row: ITableData; index: number }) => React.ReactNode;
}

export interface IFormData {
  label: string;
  field: string;
  type: string;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
  }[];
  required?: boolean;
  disabled?: boolean;
}
