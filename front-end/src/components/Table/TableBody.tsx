import clsx from "clsx";
import DataTableWithShimmer from "./ShimmerLoader";
import type { ITableRows } from "./Interface/global.interface";
// import type { ITableRows } from "../../Interface/global.interface";

const TableBody = ({ columns, rows, loading }: ITableRows) => {
  return (
    <tbody>
      {!loading ? (
        <>
          {rows?.length > 0 ? (
            rows?.map((item, index) => {
              return (
                <tr
                  key={index}
                  className={clsx(
                    "hover:bg-gray-50",
                    rows.length - 1 === index && "rounded-sm",
                  )}
                >
                  {columns?.map((column) => {
                    return (
                      <td
                        key={column.key}
                        className={clsx(
                          "border-b text-sm py-1 px-4 border-tableBorder",
                          // If column title is "Action", center the text, otherwise align to start
                          column.title?.toString().toLowerCase() === "action"
                            ? "text-center"
                            : "text-start",
                        )}
                      >
                        {column.render
                          ? column.render({
                              row: item,
                              index: index + 1 || 1,
                            })
                          : item[column.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                className="bg-white"
                colSpan={columns?.length}
                style={{
                  fontSize: 24,
                  textAlign: "center",
                  color: "#ddd",
                  padding: 50,
                }}
              >
                <section className="flex flex-col items-center">
                  <p className="text-primary text-[12px] mt-4 font-semi-bold">
                    No Items Found
                  </p>
                  <p className="text-[12px] mt-4">
                    You do not have any items yet.
                  </p>
                </section>
              </td>
            </tr>
          )}
        </>
      ) : (
        <DataTableWithShimmer
          loading={loading}
          columnsLength={columns?.length}
        />
      )}
    </tbody>
  );
};

export default TableBody;
