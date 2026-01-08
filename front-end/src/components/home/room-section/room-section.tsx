import { Columns, Heart, User } from "react-feather";
import {
  Button,
  HeaderInfoText,
  Icon,
  IconWithText,
  InfoText,
  MediumInfoText,
  RoomCard,
  ShowImg,
} from "../../../units";
import { roomLeft, roomMiddle1, roomMiddle2, roomRight } from "../../../assets";
import { useNavigate } from "react-router-dom";
import { useGetAllHostelQuery } from "../../../state-management/api/hostel-api";
import { useRecommendLocationMutation } from "../../../state-management/api/fastApi";
import { useSelector } from "react-redux";
import { user, userToken } from "../../../state-management/local/auth";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks";

export const RoomSection = () => {
  const nav = useNavigate();
  const bookingContext = useAuthContext();
  
  const token = useSelector(userToken);
  const { data } = useGetAllHostelQuery({ page: 1, limit: 100 });
  const hostelData = data?.data ?? [];
  const getUser = useSelector(user);

  const [recommendedPlaces, setRecommendedPlaces] = useState<string[]>([]);
  const [recommendLocation] = useRecommendLocationMutation();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 2;

  // Fetch recommended locations from FastAPI
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!getUser?.address) return;

      const payload = {
        query: getUser.address,
        k: 2,
        candidate_source: "desc",
      };

      try {
        const result = await recommendLocation(payload).unwrap();
        console.log("FastAPI recommendation:", result.data);

        const places: string[] = result.data
          .slice(0, 2)
          .map((item: any) => item.Resolved_Location_Names);
        setRecommendedPlaces(places);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommendations();
  }, [getUser?.address, recommendLocation]);

  // Filter hostels by recommended places (substring match)
  const recommendedHostels = recommendedPlaces.length
    ? hostelData.filter((room: any) =>
        recommendedPlaces.some(
          (place) =>
            room.location.toLowerCase().includes(place.toLowerCase()) ||
            place.toLowerCase().includes(room.location.toLowerCase())
        )
      )
    : [];

  const remainingHostels = hostelData.filter(
    (room: any) => !recommendedHostels.includes(room)
  );

  const displayedHostels = [...recommendedHostels, ...remainingHostels];

  // Pagination logic
  const totalPages = Math.ceil(displayedHostels.length / roomsPerPage);
  const startIndex = (currentPage - 1) * roomsPerPage;
  const paginatedHostels = displayedHostels.slice(
    startIndex,
    startIndex + roomsPerPage
  );
  

  return (
    <main id="rooms" className="flex flex-col gap-6 md:gap-10 mt-4 md:mt-8 p-4 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <HeaderInfoText title="Sajilo Aawas Rooms" />
       
        <Button
          className="mt-0 sm:mt-2 w-full sm:w-auto"
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
          View All Rooms
        </Button>
      </header>

      <div className="flex flex-col lg:flex-row place-items-center justify-center gap-6">
        <section className="bg-bg-secondary w-full lg:w-[65%] flex flex-col sm:flex-row gap-4 justify-center sm:justify-around flex-wrap">
          {paginatedHostels.map((room: any) => {
            const images: string[] = JSON.parse(room.imgUrls);
            const firstImg = images[0];

            return (
              <RoomCard key={room.id} className="bg-bg-brand w-full sm:w-[calc(50%-1rem)] lg:w-[380px]">
                <div className="relative group/love w-full">
                  <img
                    src={firstImg}
                    alt={room.title}
                    className="hover:animate-pulsing h-48 sm:h-64 md:h-72 lg:h-80 w-full object-cover"
                  />
                  <Icon
                    name={Heart}
                    iconSize={40}
                    textColor="white"
                    className="invisible group-hover/love:visible active:animate-glow absolute top-4 right-4"
                  />
                </div>
                <MediumInfoText title={room.title} />
                <div className="flex justify-between mt-2">
                  <section className="flex place-items-center gap-2 md:gap-4">
                    <IconWithText icon={User} text={`${room.peopleNumber} sleeps`} />
                  </section>
                  <section className="flex place-items-center gap-2 md:gap-4">
                    <IconWithText icon={Columns} text={`${room.totalBed} beds`} />
                  </section>
                </div>
                <Button
                  className="mt-4 w-full"
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
                  See full Details
                </Button>
              </RoomCard>
            );
          })}
        </section>

        <div className="flex flex-col gap-6 md:gap-8 bg-brand rounded-xl p-4 md:p-6 w-full lg:max-w-[30%]">
          <HeaderInfoText
            title="Stay Longer, Save More"
            className="text-other-white-200 w-full md:w-[60%]"
          />
          <MediumInfoText
            title="It's Simple: search, explore & contact!"
            className="text-other-white-100"
          />
          <div className="flex flex-col gap-3 md:gap-4 border-l-2 border-other-white-100 p-3 md:p-4">
            <InfoText
              title="Find the best room that fits your budget & personality"
              className="text-other-white-100 animate-fadeindown text-sm md:text-base"
            />
            <InfoText
              title="Save upto 30%. Connect with the best in the game"
              className="text-other-white-100 animate-fadeindown text-sm md:text-base"
            />
          </div>
          <Button
            className="mt-3 md:mt-5 w-full"
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
            Choose Room
          </Button>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="bg-bg-secondary px-3 py-1 md:px-4 md:py-2 rounded disabled:opacity-50 text-sm md:text-base"
        >
          Prev
        </Button>
        <span className="font-semibold text-sm md:text-base">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="bg-bg-secondary px-3 py-1 md:px-4 md:py-2 rounded disabled:opacity-50 text-sm md:text-base"
        >
          Next
        </Button>
      </div>

      <div className="flex flex-col gap-2 mt-6 md:mt-8 place-items-center">
        <HeaderInfoText title="Photos of our collection" />
        <section className="grid grid-cols-1 md:grid-cols-3 w-full lg:w-[85%] gap-4 md:gap-6 lg:gap-8 m-auto p-4 md:p-8">
          <ShowImg img={roomLeft} classname="h-48 md:h-64 lg:h-80 xl:h-96" />
          <div className="flex flex-col justify-around gap-4 md:gap-6">
            <ShowImg img={roomMiddle1} classname="h-40 md:h-48 lg:h-56 xl:h-64" />
            <ShowImg img={roomMiddle2} classname="h-40 md:h-48 lg:h-56 xl:h-64" />
          </div>
          <ShowImg img={roomRight} classname="h-48 md:h-64 lg:h-80 xl:h-96" />
        </section>
      </div>
    </main>
  );
};