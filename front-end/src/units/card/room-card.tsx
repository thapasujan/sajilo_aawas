interface roomCardPropTypes {
  bgcolor?: string;
  children: React.ReactNode;
  className?: string;
}

export const RoomCard = ({ children, className }: roomCardPropTypes) => {
  return (
    <main
      className={`flex flex-col rounded-2xl gap-6 bg-bg-secondary  ${className}`}
    >
      {children}
    </main>
  );
};
