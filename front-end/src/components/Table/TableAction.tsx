import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DeleteModal } from "./Interface/DeleteModal";

interface IProps {
  onMoreList?: {
    title: string;
    onClick: () => void;
    index: number;
  }[];
  onShow?: () => void;
  onReport?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
  onPrint?: () => void;
  onSwitch?: (value: boolean) => void;
  switchStatus?: boolean;
  onApiSwitch?: () => void;
  onLabDeptSwitch?: () => void;
  labDeptSwitchStatus?: boolean;
  onReturn?: () => void;
  onPay?: () => void;
}

export const TableAction = ({ onShow,
  onLabDeptSwitch,
  onReport,
  onEdit,
  onDelete,
  onMore,
  onSwitch,
  onPrint,
  onReturn,
  onApiSwitch,
  switchStatus,
  onPay,
  onMoreList,
  labDeptSwitchStatus
}: IProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    const newValue = !isActive;
    setIsActive(newValue);
    if (onSwitch) onSwitch(newValue);
  };  

  const handleOnMoreDropdown = (e: any) => {
    e.stopPropagation();
    setIsMoreOpen((prev) => !prev);
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsMoreOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full gap-1 min-w-fit">
      {onSwitch && (
        <div
          className="flex-shrink-0 p-1 border border-gray-200 rounded-sm cursor-pointer"
          onClick={handleToggle}
        >
          <div
            className={`w-12 h-4 flex items-center bg-${isActive ? "primary" : "[#808080]"
              } rounded-full p-1 cursor-pointer transition-all duration-300`}
            onClick={handleToggle}
          >
            <div
              className={`bg-white size-4 rounded-full shadow-md transform ${isActive ? "translate-x-6" : "translate-x-0"
                } transition-transform duration-300`}
            />
          </div>
        </div>
      )}
      {onApiSwitch && (
        <div
          className="flex-shrink-0 p-1 rounded-sm cursor-pointer"
          onClick={onApiSwitch}
        >
          <div
            className={`w-12 h-5 flex items-center bg-${switchStatus ? "primary" : "gray-400"
              } rounded-full p-1 cursor-pointer transition-all duration-300 `}
          >
            <div
              className={`bg-white size-4 rounded-full shadow-md transform ${switchStatus ? "translate-x-6 " : "translate-x-0"
                } transition-transform duration-300 border border-white`}
            />
          </div>
        </div>
      )}
      {onLabDeptSwitch && (
        <div
          className="flex-shrink-0 p-1 rounded-sm cursor-pointer"
          onClick={onLabDeptSwitch}
        >
          <div
            className={`w-11 h-5 flex items-center bg-${!!labDeptSwitchStatus ? "primary" : "gray-400"
              } rounded-full p-1 cursor-pointer transition-all duration-300`}
          >


            <div
              className={`w-11 h-5 flex items-center bg-gray-500 rounded-full p-1 cursor-pointer transition-all duration-300`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform translate-x-4 transition-transform duration-300`}
              />
            </div>
          </div>
        </div>
      )}
      {onShow && (
        <div
          className="cursor-pointer flex-shrink-0 rounded-sm inline-flex items-center justify-center min-w-[32px] min-h-[16px]"
          onClick={onShow}
        >
          <Icon icon="mdi:eye" className="size-4 text-[#02437B] min-w-5 min-h-5" />
        </div>
      )}
      {onPrint && (
        <div
          className="cursor-pointer flex-shrink-0 border border-gray-200 rounded-sm p-1 inline-flex items-center justify-center min-w-[32px] min-h-[16px]"
          onClick={onPrint}
        >
          <Icon
            icon="material-symbols:print-outline"
            className="size-4 min-w-4 min-h-4"
          />
        </div>
      )}

      {onEdit && (
        <div
          className="cursor-pointer flex-shrink-0 inline-flex items-center justify-center min-w-[32px] min-h-[16px]"
          onClick={onEdit}
        >
          <Icon icon="fluent:edit-28-filled" className="size-4 font-thin min-w-5 min-h-5 text-[#636060]"
          />
        </div>
      )}
      {onReport && (
        <div
          className="cursor-pointer flex-shrink-0 border border-gray-200 rounded-sm p-1 inline-flex items-center justify-center min-w-[32px] min-h-[16px]"
          onClick={onReport}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 20 20"
            fill="none"
            className="min-w-[14px] min-h-[14px]"
          >
            <path
              d="M3 2.89496C3 2.40069 3.40069 2 3.89496 2H16.5949C17.0892 2 17.4898 2.40069 17.4898 2.89496V18.0018C17.4898 18.4922 17.0952 18.8913 16.6048 18.8967L3.90484 19.0369C3.40673 19.0424 3 18.6401 3 18.142V2.89496Z"
              stroke="#2B2B2B"
              strokeWidth="0.894961"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.26172 4.55469V8.81641"
              stroke="#2B2B2B"
              strokeWidth="0.894961"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.55859 7.11328H8.96797"
              stroke="#2B2B2B"
              strokeWidth="0.894961"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.5234 5.41016H14.9328"
              stroke="#2B2B2B"
              strokeWidth="0.894961"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.6719 8.81641H14.9336"
              stroke="#2B2B2B"
              strokeWidth="0.894961"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.70508 12.2305H14.9332"
              stroke="#2B2B2B"
              strokeWidth="0.894961"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.70508 14.7852H14.9332"
              stroke="#2B2B2B"
              strokeWidth="0.894961"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.26172 2H13.2281"
              stroke="#2B2B2B"
              strokeWidth="1.78992"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
      {onDelete && (
        <div
          className="cursor-pointer flex-shrink-0 inline-flex items-center justify-center min-w-[32px] min-h-[16px]"
          onClick={() => setShowDelete(true)}
        >
          <Icon
            icon="fluent:delete-16-regular" className="size-4 text-[red] min-w-5 min-h-5"
          />
        </div>
      )}
      {onReturn && (
        <div
          className="cursor-pointer flex-shrink-0 border border-gray-200 rounded-sm p-1 inline-flex items-center justify-center min-w-[32px] min-h-[16px]"
          onClick={onReturn}
        >
          <Icon
            icon="streamline:return-2"
            width="14"
            height="14"
            className="min-w-[14px] min-h-[14px]"
          />
        </div>
      )}
      {onPay && (
        <div
          className="cursor-pointer flex-shrink-0 border border-gray-200 rounded-sm p-1 inline-flex items-center justify-center min-w-[32px] min-h-[16px] hover:bg-green transition-colors duration-300"
          onClick={onPay}
        >
          <Icon
            icon="mdi:credit-card-outline"
            className="size-4 text-darkishGreen min-w-4 min-h-4"
          />
        </div>
      )}

      {onMore && (
        <div
          className="cursor-pointer  flex-shrink-0 border border-gray-200 rounded-sm p-1 inline-flex items-center justify-center min-w-[32px] min-h-[16px]"
          ref={dropdownRef}
          onClick={handleOnMoreDropdown}
        >
          <Icon
            icon="pepicons-pencil:dots-y"
            className="size-4 min-w-4 min-h-4"
          />
          {isMoreOpen && onMoreList && (
            <div className="absolute z-50 flex flex-col w-40 bg-white border border-gray-300 rounded shadow-md right-10">
              {onMoreList.map((item) => (
                <>
                  <div
                    key={item.index}
                    className="px-3 py-1 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 "
                    onClick={() => {
                      setIsMoreOpen(false);
                      item.onClick();
                    }}
                  >
                    {item.title}
                  </div>
                  <hr />
                </>
              ))}
            </div>
          )}
        </div>
      )}
      <DeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => {
          onDelete?.();
          setShowDelete(false);
        }}
      />
    </div>

  );
}
