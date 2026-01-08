import React from "react";
import {
  AboutUs,
  Footer,
  HomeSection,
  RoomSection,
  AuthLayout,
} from "../../components";
import classNames from "classnames";
import { Icon, Modal } from "../../units";
import { X } from "react-feather";
import { useOutsideClick } from "../../hooks";
import { useAuthContext } from "../../hooks";

export const Home = React.memo(() => {
  const bookingContext = useAuthContext();
  const bookingRef = useOutsideClick(() =>
    bookingContext?.setauthModalStatus({
      ...bookingContext.authModalStatus,
      loginMenu: false,
    })
  );

  return (
    <div className="relative w-full">
      <main
        className={classNames("flex flex-col min-h-screen", {
          "blur-sm pointer-events-none select-none":
            bookingContext?.authModalStatus.loginMenu,
        })}
      >
        <HomeSection />
        <RoomSection />
        <AboutUs />
        <Footer />
      </main>

      {bookingContext?.authModalStatus.loginMenu && (
        <Modal
          classname="bg-other-white-100 w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl 
                     max-h-[90vh] overflow-y-auto p-4 sm:p-6 
                     shadow-xl rounded-xl z-50"
          ref={bookingRef}
        >
          {/* Close Button */}
          <Icon
            name={X}
            className="absolute top-3 right-3 cursor-pointer"
            textColor="#ADADAD"
            onClick={() =>
              bookingContext?.setauthModalStatus({
                ...bookingContext.authModalStatus,
                loginMenu: false,
              })
            }
          />

          {/* Auth form */}
          <div className="flex flex-col items-center justify-center w-full">
            <AuthLayout />
          </div>
        </Modal>
      )}
    </div>
  );
});
