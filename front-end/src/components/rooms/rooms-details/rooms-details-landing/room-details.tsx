import React, { useMemo, useState } from "react";
import { Columns, Mail, Map, Phone, User } from "react-feather";
import {
  BreadCrumbLayout,
  BreadCrumbs,
  Button,
  HeaderInfoText,
  IconWithText,
  LoaderSpinner,
  ShowImg,
} from "../../../../units";
import { BrandDetails, RoomBookingDetails } from "../../../";
import { useNavigate, useParams } from "react-router-dom";
import { useGetHostelByIdQuery } from "../../../../state-management/api/hostel-api";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { user } from "../../../../state-management/local/auth";
import { useGetBookingByIdQuery } from "../../../../state-management/api/booking-api";

interface bookingType {
  user: {
    userId: string;
  };
}

export const RoomDetailsLayout = React.memo(() => {
  const { id } = useParams();
  const nav = useNavigate();
  const userInfo = useSelector(user);

  const { data, isLoading } = useGetHostelByIdQuery(id);
  const { data: bookingDetails, isLoading: bookingLoading } =
    useGetBookingByIdQuery(id);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const alreadyBooked = useMemo(() => {
    if (Array.isArray(bookingDetails)) {
      return bookingDetails.filter(
        (details: bookingType) => details?.user?.userId === userInfo?.id
      );
    } else if (bookingDetails && typeof bookingDetails === "object") {
      return bookingDetails.user?.userId === userInfo?.id
        ? [bookingDetails]
        : [];
    }
    return [];
  }, [bookingDetails, userInfo?.id]);

  const nextImage = () => {
    if (!data?.imgUrls) return;
    setSelectedImageIndex((prev) => (prev + 1) % data.imgUrls.length);
  };

  const prevImage = () => {
    if (!data?.imgUrls) return;
    setSelectedImageIndex(
      (prev) => (prev - 1 + data.imgUrls.length) % data.imgUrls.length
    );
  };

  return (
    <main className="flex flex-col p-4 md:p-8 gap-4">
      <Toaster />

      <header>
        <BreadCrumbs>
          <BreadCrumbLayout path="/rooms" title="Rooms" />
          <BreadCrumbLayout path="" title="Room Details" current={true} />
        </BreadCrumbs>
      </header>

      {isLoading || bookingLoading ? (
        <LoaderSpinner />
      ) : (
        <section className="flex flex-col gap-8">
          <HeaderInfoText title={data?.hostelName} />

          <div className="flex flex-col lg:flex-row justify-around gap-8">
            {/* Left Side - Image Slider */}
            <div className="flex flex-col gap-4 items-center w-full lg:w-[65%]">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] bg-gray-100">
                {data?.imgUrls && data.imgUrls.length > 0 && (
                  <>
                    <ShowImg
                      img={data.imgUrls[selectedImageIndex]}
                      classname="w-full h-full object-cover"
                    />

                    {/* Navigation Arrows */}
                    {data.imgUrls.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                          aria-label="Previous image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M20 9v6h-8v4.84L4.16 12L12 4.16V9z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                          aria-label="Next image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M4 15V9h8V4.16L19.84 12L12 19.84V15z"
                            />
                          </svg>
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2 overflow-x-auto mt-2 w-full px-2">
                {data?.imgUrls?.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 ${
                      selectedImageIndex === idx
                        ? "border-[#10477C]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <ShowImg 
                      img={img} 
                      classname="w-full h-full object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 md:gap-10 place-items-center justify-center w-full px-2">
                <IconWithText icon={Mail} text={`${data?.email}`} />
                <IconWithText icon={Phone} text={`${data?.contact}`} />
                <IconWithText icon={Map} text={`${data?.location}`} />
                <IconWithText
                  icon={User}
                  text={`${data?.peopleNumber} people`}
                />
                <IconWithText icon={Columns} text={`${data?.totalBed} bed`} />
              </div>
            </div>

            {/* Right Side - Booking Section */}
            <div className="flex flex-col gap-8 w-full lg:w-[30%] items-center lg:items-start">
              {data?.ownerEmail === userInfo?.email ? (
                <div className="flex flex-col gap-4 w-full max-w-xs">
                  <Button
                    className="w-full"
                    onClick={() => nav(`/booking-details/${data?.id}`)}
                  >
                    Booking Details
                  </Button>

                  <Button
                    className="w-full"
                    onClick={() => nav(`/edit-room/${data?.id}`)}
                  >
                    Edit Room
                  </Button>
                </div>
              ) : alreadyBooked.length > 0 ? (
                <Button 
                  className="w-full max-w-xs"
                  onClick={() => nav("/profile/your-booking")}
                >
                  See Details
                </Button>
              ) : (
                <div className="w-full max-w-xs">
                  <RoomBookingDetails
                    frequency={data?.frequency}
                    price={data?.price}
                    id={data?.id}
                    contact={data?.contact}
                    email={data?.email}
                    hostelName={data?.hostelName}
                    imgUrl={data?.imgUrls?.[0] || ""}
                    location={data?.location}
                    peopleNumber={data?.peopleNumber}
                    title={data?.title}
                    ownerEmail={data?.ownerEmail}
                    totalBed={data?.totalBed}
                    ownerId={data?.ownerId}
                  />
                </div>
              )}
              <div className="w-full max-w-xs">
                <BrandDetails />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
});