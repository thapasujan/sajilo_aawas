const DataTableWithShimmer: React.FC<{
  loading: boolean;
  columnsLength: number;
}> = ({ loading, columnsLength }) => {
  const LoadingRow = (props: React.HTMLAttributes<HTMLElement>) => (
    <tr {...props} className="animate-pulse bg-white">
      {Array.from({ length: columnsLength }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <>{loading && Array.from({ length: 3 }).map((_, i) => <LoadingRow key={i} />)}</>
  );
};

export default DataTableWithShimmer;

