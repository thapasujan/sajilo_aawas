import clsx from "clsx";

export function Status({
  status,
  className,
}: {
  status: any;
  className?: string;
}) {
  const statusColors: { [key: string]: string } = {
    DISPATCHED: "bordder-[#34C759] bg-[#34C759]/10 text-[#34C759]",
    ONQUE: "border-purple-500 text-purple-500 bg-purple-500/10",
    REPORTED: "border-primary text-primary bg-primary/10",
    COLLECTED: "border-blue text-blue bg-blue/10",
    PAID: "border-[#34C759] bg-[#34C759]/10 text-[#34C759]",
    VERIFIED: "border-green bg-green/10 text-green",
    Available: "border-[#34C759]  bg-[#34C759]/10 text-[#34C759]",
    Busy: "border-gray-500 bg-gray-500/10 text-gray-500",
    "In Surgery": "border-red bg-red/10 text-red",
    "On Leave": "border-[#FFCC00]  bg-[#FFCC00]/10 text-[#FFCC00]",
    PARTIALLY_PAID: "border-blue bg-blue/10 text-blue",
    HIGH: "border-red text-red bg-red/10",
    MEDIUM: "border-yellow text-yellow bg-yellow/10",
    LOW: "border-blue text-blue bg-blue/10",
    PENDING: "border-yellow text-yellow bg-yellow/10",
    SUBMITTED: "border-yellow text-yellow bg-yellow/10",
    // COMPLETED: "border-[#34C759] bg-[#34C759]/10 text-[#34C759]",
    COMPLETED: "border-blue text-blue bg-blue/10",
    Completed: "border-blue text-blue bg-blue/10",
    PUBLISHED: "border-blue text-blue bg-blue/10",
    ACTIVE: "border-green-400 text-green bg-green-500/15",
    CANCELLED: "border-red text-red bg-red/10",
    Cancelled: "border-red text-red bg-red/10",
    ONSTOCK: "border-[#34CDCD] text-black bg-[#34CDCD]/10",
    OUTOFSTOCK: "border-[#FF3B30] text-red bg-[#FF3B30]/10",
    INACTIVE: "border-[#FF3B30] text-red bg-[#FF3B30]/10",
    DISCHARGE: "border-[#FF3B30] text-red bg-[#FF3B30]/10",
    Critical: "border-[#FF3B30] text-red bg-[#FF3B30]/10",
    Stable: "border-[#34CDCD] text-black bg-[#34CDCD]/10",
    UnderReview: "border-[#FFCC00] bg-[#FFCC00]/5 text-[#FFCC00]",
    // AVAILABLE: "border-[#34CDCD]  bg-[#34CDCD]/10 text-[#34CDCD]",
    Unavailable: "border-[#FF3B30]  text-red bg-[#FF3B30]/10",
    Paid: "border-[#34C759] bg-[#34C759]/10 text-[#34C759]",
    Unpaid: "border-[#FF3B30] text-red bg-[#FF3B30]/10",
    Pending: "border-[#FFCC00] bg-[#FFCC00]/5 text-[#FFCC00]",
    Progress: "border-[#34CDCD]  bg-[#34CDCD]/10 text-[#34CDCD]",
    PartiallyPaid: "border-[#3A86FF] bg-[#3A86FF]/5 text-[#3A86FF]",
    Reserved: "border-[#FF3B30] text-red bg-[#FF3B30]/10",
    Occuiped: "border-[#FF3B30] text-red bg-[#FF3B30]/10",
    "Not Admitted": "border-[#FF3B30] text-red py-2 bg-[#FF3B30]/10",
    "IN-PROGRESS": "border-[#FF3B30] text-red py-2 bg-[#FF3B30]/10",
    Admitted: "border-[#34C759] bg-[#34C759]/10 py-2 text-[#34C759]",
    Active: "border-[#34C759] bg-[#34C759]/10 text-[#34C759]",
    "On leave": "border-[#FF3B30] text-red bg-[#FF3B30]/10",
    "In Patient": "border-[#34C759] bg-[#34C759]/10 text-[#34C759]",
    Confirmed: "border-green text-green bg-green/15",
    CONFIRMED: "border-green text-green bg-green/15",
    // PAID: "bg-[#f3fdf5] border-[#33c55c] text-[#34c75d] ",
    UNPAID: "border-[#ff3a2e] bg-[#fff3f3] text-[#f43536]",
    // PENDING: "bg-[#fffdf0] border-[#ffcc00] text-[#fdce00]",

    "PARTIALLY-PAID": "border-[#3a85ff] bg-[#f3f8fe] text-[#3788fd]",
    "RE-SCHEDULED": "border-[#3a85ff] bg-[#f3f8fe] text-[#3788fd]",
    // AVAILABLE: "text-[#17878e] border-[#2dc2c3] bg-[#f2fcfb]",
    Inactive: "bg-[#fff3f3] border-[#fd3b31] text-[#f53529]",
    // added colors
    "IN-STOCK": "border-[#54c5d6] bg-[#f3fdfb] text-[#17878e]",
    "OUT-STOCK": "bg-[#fff3f3] text-[#ff3a2f] border-[#ff3b2f]",
    "LOW-STOCK": "bg-[#fffdf4] border-[#fdcd00] text-[#ffcc00] ",
    "On Stock": "bg-[#f2fcfb] border-[#33cdcd] text-[#33cdcd]",
    "Low Stock": "bg-[#fffdf4] border-[#fecc00] text-[#fecc00]",
    "Out of Stock": "bg-[#fff3f3]   border-[#ff3b2f] text-[#ff3b2f] ",
    MAINTENANCE: "bg-[#fff3f3]   border-[#ff3b2f] text-[#ff3b2f] ",
    "ON-DUTY": "bg-[#fbfaf0] text-[#9da704] border-[#9da704]",
    ASSIGNED: "bg-[#f3fdf5] text-[#2bbc51] border-[#2bbc51]",
    CREDIT: "border-[#34C759] bg-[#34C759]/10 text-[#34C759]",
    DEBIT: "border-[#FF3B30] text-red bg-[#FF3B30]/10",

    "IN USE": "border-[#34C759] bg-[#34C759]/10 text-[#34C759]",
    IDLE: "border-[#f07427] text-[#f07427] bg-[#f07427]/10",
    OFFLINE: "border-[#FF3B30] text-red bg-[#FF3B30]/10",
    "IN MAINTENANCE": "border-[#3a85ff] bg-[#f3f8fe] text-[#3788fd]",

    NEW: "border-[#34C759] bg-[#34C759]/10 text-[#34C759]",
    New: "border-[#34C759] bg-[#34C759]/10 text-[#34C759]",
  };

  return (
    <div
      className={clsx(
        "px-2 py-1 flex justify-start  w-fit rounded text-xs font-medium border",
        statusColors[status] || "bg-gray-100 text-gray-700",
        className
      )}
    >
      {status}
    </div>
  );
}
