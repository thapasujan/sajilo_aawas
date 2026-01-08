import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { user } from "../../state-management/local/auth";

interface SocketContextType {
  socket: Socket | null;
}

export const SocketContent = createContext<SocketContextType>({
  socket: null,
});

export const SocketContext = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const userInfo = useSelector(user);

useEffect(() => {
  if (!userInfo?.id) return; 

  const socketInstance: Socket = io("http://localhost:3333", {
    withCredentials: true,
    query: { userId: userInfo.id },
  });

  setSocket(socketInstance);

  return () => {
    socketInstance.disconnect();
  };
}, [userInfo?.id]);


  return (
    <SocketContent.Provider value={{ socket }}>
      {children}
    </SocketContent.Provider>
  );
};

export const UseSocketContext = () => {
  const socketContext = useContext(SocketContent);

  if (!socketContext) {
    throw new Error("Must be wrapped");
  }
  return socketContext.socket;
};
