import clsx from "clsx";
import type { ITableHeader } from "./Interface/global.interface";

const TableHead = ({ columns, loading, color, textcolor }: ITableHeader) => {
  return (
    <thead className="rounded-t-md">
      {loading ? (
        <span className="w-full h-4 bg-gray-300 rounded-sm animate-pulse" />
      ) : (
        <tr className="rounded-t">
          {columns?.map((item, index: number) => (
            <th
              key={item?.key}
              className={clsx(
                "w-auto text-sm border-y border-tableBorder  font-medium text-tableHeadText py-1  px-4 text-nowrap",
                item?.title?.toString().toLowerCase() === "action"
                  ? "text-center"
                  : "text-start",
                color && color,
                !color && "bg-tableColor/30 text-tableText",
                textcolor && textcolor,
                index === 0 && "rounded-tl-sm",
                index === columns.length - 1 && "rounded-tr-sm",
              )}
            >
              {item?.title &&
                typeof item?.title === "string" &&
                item.title
                  .split(" ")
                  .map((word: any, idx: number) =>
                    idx === 0
                      ? word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      : word.toLowerCase(),
                  )
                  .join(" ")}
            </th>
          ))}
        </tr>
      )}
    </thead>
  );
};

export default TableHead;
