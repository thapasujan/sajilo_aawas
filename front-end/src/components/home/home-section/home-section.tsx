import { Button, HeaderInfoText, InfoText } from "../../../units";
import { hero } from "../../../assets/";
import { useAuthContext } from "../../../hooks";
import { useSelector } from "react-redux";
import { userToken } from "../../../state-management/local/auth";
import { useNavigate } from "react-router-dom";

export const HomeSection = () => {
  const bookingContext = useAuthContext();
  const nav = useNavigate();

  const token = useSelector(userToken);

  return (
    <main className="flex flex-col animate-fadeindown" id="home">
      <section className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-4 p-4 md:p-8">
        <div
          className="flex flex-col bg-bg-secondary rounded-lg w-full lg:w-[40%] p-6 md:p-8 lg:p-10 gap-4 md:gap-6 text-center lg:text-left"
          id="left-side"
        >
          <HeaderInfoText 
            title="Sajilo Aawas - Far From Home Don't worry. It feels home here!" 
            className="text-xl md:text-2xl lg:text-3xl"
          />
          <InfoText 
            title="Amazing Collection of Sajilo Aawas. Find the best collection of Sagilo Aawas Room where you would have blast of fun & learning." 
            className="text-sm md:text-base"
          />
          <Button
            className="mt-3 md:mt-5 w-full md:w-auto mx-auto lg:mx-0"
            onClick={() => {
              if (!token) {
                bookingContext?.setauthModalStatus({
                  ...bookingContext.authModalStatus,
                  loginMenu: true,
                });
              } else {
                nav("/rooms");
              }
            }}
          >
            Book Now
          </Button>
        </div>

        <div id="right-side" className="w-full lg:w-[60%] flex justify-center">
          <img 
            src={hero} 
            alt="hero" 
            className="w-full max-w-lg lg:max-w-full h-auto object-contain"
          />
        </div>
      </section>
    </main>
  );
};