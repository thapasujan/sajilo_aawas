import React from "react";

type Column = {
  title: string;
  key: string;
};

type Row = Record<any,any>;

interface AlternativeTableProps {
  columns: Column[];
  rows: Row[];
  loading?: boolean;
}

const AlternativeTable: React.FC<AlternativeTableProps> = ({ columns, rows, loading }) => {
  return (
    <div className="overflow-x-auto  border border-gray-300 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-tableBg bg-opacity-20 ">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left text-xs font-medium  text-tableText"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-tableText">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-4 text-center text-tableText">
                No data available.
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
            // Render loading state
              <tr key={idx} className="hover:bg-gray-50 text-xs">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-2 text-tableDataTextColor">
                    {row[col.key] ?? "-"}
                  </td>
                ))}
         
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
            // Render rows of data
  );
};

export default AlternativeTable;
