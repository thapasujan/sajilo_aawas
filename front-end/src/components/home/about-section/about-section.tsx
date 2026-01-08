import { Briefcase, MapPin, MoreHorizontal, Wifi } from "react-feather";
import {
  Button,
  HeaderInfoText,
  Icon,
  InfoText,
  ShowImg,
} from "../../../units";
import { about1 } from "../../../assets";

export const AboutUs = () => {
  return (
    <main id="about" className="flex flex-col gap-5 mt-4 bg-bg-secondary p-4 md:p-6 lg:p-8">
      <section className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-4">
        <div className="flex flex-col gap-6 lg:gap-10 m-auto w-full lg:w-[35%]">
          <header className="flex flex-col gap-3 md:gap-4">
            <HeaderInfoText title="We have everything you need" />
            <InfoText title="Finest collection of Sajilo Aawas with some of the features listed: " />
          </header>
          
          <section className="grid grid-cols-1 sm:grid-cols-2 mt-2 gap-6 md:gap-8 w-full lg:w-[80%]">
            <div className="flex items-center gap-4 md:gap-6">
              <Icon name={Wifi} iconSize={40} className="md:iconSize-50" />
              <InfoText title="Free available high speed wifi" className="text-sm md:text-base" />
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <Icon name={MapPin} iconSize={40} className="md:iconSize-50" />
              <InfoText title="Spread across the city" className="text-sm md:text-base" />
            </div>
            
            <div className="flex items-center gap-4 md:gap-6">
              <Icon name={Briefcase} iconSize={40} className="md:iconSize-50" />
              <InfoText title="Free Storage of luggage" className="text-sm md:text-base" />
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <Icon name={MoreHorizontal} iconSize={40} className="md:iconSize-50" />
              <InfoText title="Many More" className="text-sm md:text-base" />
            </div>
          </section>
          
          <Button className="w-full sm:w-auto mt-4">Explore More</Button>
        </div>
        
        <div className="w-full lg:w-[50%] mt-6 lg:mt-0">
          <ShowImg 
            img={about1} 
            height="300px"
            classname="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[450px] w-full object-cover rounded-lg"
          />
        </div>
      </section>
      <section></section>
    </main>
  );
};