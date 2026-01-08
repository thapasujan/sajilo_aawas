import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { HeaderInfoText } from "../../units";
import { UseSocketContext } from "../../hooks/context/SocketContext";
import {
  addNotification,
  removeNotification,
  clearNotifications,
} from "../../state-management/redux/notificationSlice";
import { RootState } from "../../state-management/store/store";

interface SocketNotification {
  message: string;
  type?: string;  
  bookingId?: string; // optional, used to tie to a booking
}

export const Notification = () => {
  const notifications = useSelector(
    (state: RootState) => state.notifications.messages
  );
  const dispatch = useDispatch();
  const socket = UseSocketContext();

  useEffect(() => {
    if (!socket) return;

    const handler = (data: SocketNotification) => {
      // Use bookingId as notification id if available, else uuid
      const id = data.bookingId || crypto.randomUUID();

      dispatch(
        addNotification({
          id,
          message: data.message,
           type: data.type || "info",
          createdAt: Date.now(),
        })
      );

      // auto remove after 1 hour
      setTimeout(() => {
        dispatch(removeNotification(id));
      }, 3600000);
    };

    socket.on("push-notification", handler);

    return () => {
      socket.off("push-notification", handler);
    };
  }, [socket, dispatch]);

  return (
    <div className="flex flex-col gap-5 p-8">
      <div className="flex items-center justify-between">
        <HeaderInfoText title="Notification" />
        {notifications.length > 0 && (
          <button
            onClick={() => dispatch(clearNotifications())}
            className="bg-red-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-red-600"
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        notifications.map((n) => (
          <div
            key={n.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow"
          >
            <span>{n.message}</span>
            <button
              onClick={() => dispatch(removeNotification(n.id))}
              className="text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No notifications</p>
      )}
    </div>
  );
};
