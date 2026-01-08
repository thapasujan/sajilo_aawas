import React from "react";
import { Columns, MapPin, User } from "react-feather";
import {
  Button,
  Icon,
  InfoText,
  MediumInfoText,
  NavigateLink,
  ShowImg,
} from "../../../units";
import { roomdispalyCardPropTypes } from "../../../constant";
import { useSelector } from "react-redux";
import { user } from "../../../state-management/local/auth";
import { useNavigate } from "react-router-dom";

export const RoomDisplayCard = React.memo((data: roomdispalyCardPropTypes) => {
  const userInfo = useSelector(user);
  const nav = useNavigate();

  // ✅ Safely parse stringified imgUrls
  const imgArray = (() => {
    try {
      const parsed = JSON.parse(data.imgUrls);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const imgSrc = imgArray.length > 0 ? imgArray[0] : data.imgUrls || "";

  return (
    <main className="flex flex-col sm:flex-row bg-[#FBFBFB] gap-4 sm:gap-8 p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="w-full sm:w-[40%] md:w-[30%]">
        <ShowImg 
          img={imgSrc} 
          classname="w-full h-48 sm:h-44 md:h-48 object-cover rounded-lg"
        />
      </div>

      {/* Info Section */}
      <section className="flex flex-col justify-between w-full sm:w-[40%] md:w-[50%] gap-3 sm:gap-0">
        <div className="flex flex-col gap-2">
          <NavigateLink
            title={data.hostelName || "N/A"}
            path={`/room-details/${data.id}`}
            className="cursor-pointer text-lg sm:text-xl font-semibold hover:text-blue-600 transition-colors line-clamp-1"
          />
          <section className="flex items-center gap-2">
            <Icon name={MapPin} iconSize={16} />
            <InfoText 
              title={data.location || "N/A"} 
              className="text-sm line-clamp-1"
            />
          </section>
        </div>

        <InfoText 
          title={data.title || "N/A"} 
          className="text-sm line-clamp-2"
        />

        <div className="flex flex-wrap gap-4 sm:gap-6">
          <section className="flex items-center gap-2">
            <Icon name={User} iconSize={16} />
            <InfoText 
              title={`${data.peopleNumber ?? 0} people`} 
              className="text-sm"
            />
          </section>

          <section className="flex items-center gap-2">
            <Icon name={Columns} iconSize={16} />
            <InfoText 
              title={`${data.totalBed ?? 0} beds`} 
              className="text-sm"
            />
          </section>
        </div>
      </section>

      {/* Price & Button Section */}
      <section className="flex flex-row sm:flex-col justify-between sm:justify-around items-center sm:items-end w-full sm:w-auto gap-3 sm:gap-0">
        <MediumInfoText 
          title={`Rs. ${data.price ?? "N/A"}`} 
          className="text-lg font-semibold"
        />
        {userInfo?.email === data.ownerEmail ? (
          <Button
            className="w-full sm:w-32 p-2 rounded-lg text-sm"
            onClick={() => nav(`/booking-details/${data?.id}`)}
          >
            See Details
          </Button>
        ) : (
          <Button
            className="w-full sm:w-32 p-2 rounded-lg text-sm"
            onClick={() => nav(`/room-details/${data.id}`)}
          >
            Book Now
          </Button>
        )}
      </section>
    </main>
  );
});