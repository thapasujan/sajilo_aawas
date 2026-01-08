import React, { useMemo, useRef, useEffect, useState, forwardRef } from "react";
import Pagination from "./Pagination";
import TableBody from "./TableBody";
import TableHead from "./TableHead";
import type { IMasterTable } from "./Interface/global.interface";
import Checkbox from "./Interface/CheckBox";
import { twMerge } from "tailwind-merge";
import Button from "./Interface/Button";

const MasterTable = forwardRef<HTMLTableElement | HTMLDivElement | null, IMasterTable>(
  (
    {
      columns,
      loading,
      pagination,
      rows,
      color = "bg-gray-50",
      textcolor = "text-gray-700",
      className,
      showCheckbox = false,
      selectedIds = [],
      onSelectAll,
      onSelectRow,
      primaryKey = "_id",
      onBulkAction,
      bulkActionLabel = "Delete Selected",
      showBulkActions = true,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [maxWidth, setMaxWidth] = useState<number>(0);

    useEffect(() => {
      const calculateMaxWidth = () => {
        if (containerRef.current) {
          const padding = 48; // p-6 both sides
          setMaxWidth(containerRef.current.offsetWidth - padding);
        }
      };
      calculateMaxWidth();
      window.addEventListener("resize", calculateMaxWidth);
      return () => window.removeEventListener("resize", calculateMaxWidth);
    }, []);

    const allIds = useMemo(() => rows?.map((row) => row[primaryKey]).filter(Boolean), [rows, primaryKey]);
    const isAllSelected = useMemo(() => allIds?.length > 0 && allIds.every((id) => selectedIds.includes(id)), [allIds, selectedIds]);
    const isSomeSelected = useMemo(() => selectedIds.length > 0 && selectedIds.length < allIds.length, [selectedIds, allIds]);

    const handleSelectAll = () => onSelectAll?.(!isAllSelected, allIds);
    const handleRowSelect = (id: string | number) => onSelectRow?.(id, !selectedIds.includes(id));

    const enhancedColumns = useMemo(() => {
      if (!showCheckbox) return columns;
      return [
        {
          key: "checkbox",
          title: "",
          render: ({ row }: { row: any }) => (
            <Checkbox checked={selectedIds.includes(row[primaryKey])} onChange={() => handleRowSelect(row[primaryKey])} className="h-4 w-4" />
          ),
        },
        ...columns,
      ];
    }, [showCheckbox, columns, selectedIds, primaryKey]);

    const headerColumns = useMemo(() => {
      if (!showCheckbox) return columns;
      return [
        {
          key: "checkbox",
          title: (
            <Checkbox
              checked={isAllSelected}
              onChange={handleSelectAll}
              className="h-4 w-4"
              ref={(input) => input && (input.indeterminate = isSomeSelected)}
            />
          ),
        },
        ...columns,
      ];
    }, [showCheckbox, columns, isAllSelected, handleSelectAll]);

    return (
      <div ref={containerRef} className={twMerge("w-full max-w-full bg-white  overflow-hidden shadow-md", className)}>
        {/* Bulk Actions */}
        {showCheckbox && showBulkActions && selectedIds.length > 0 && (
          <div className="mb-4 flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
            <span className="text-blue-700 font-medium">{selectedIds.length} item(s) selected</span>
            {onBulkAction && (
              <Button
                variant="primary"
                size="sm"
                title={bulkActionLabel}
                onClick={() => onBulkAction(selectedIds)}
                className="bg-red-600 hover:bg-red-700"
              />
            )}
          </div>
        )}

        <div
          className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
          style={{ maxWidth: maxWidth > 1184 ? `${maxWidth}px` : "100%" }}
        >
          <table
            ref={ref as React.Ref<HTMLTableElement>}
            className="min-w-full divide-y divide-gray-200 border-separate border-spacing-0 text-sm"
          >
            <TableHead columns={headerColumns} loading={loading} color={color} textcolor={textcolor} />
            <TableBody columns={enhancedColumns} rows={rows} loading={loading} />
          </table>
        </div>

        {/* Pagination */}
        {pagination && <Pagination {...pagination} />}
      </div>
    );
  }
);

MasterTable.displayName = "MasterTable";
export default MasterTable;
