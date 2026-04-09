import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { PlusIcon } from "../Icon/PlusIcon";
import { Sidebar } from "../components/Sidebar";
import axios from "axios";
import { Backendurl } from "../config";
import { useQuery } from "@tanstack/react-query";
import { SidebarIcon } from "../Icon/SidebarIcon";
import { Sbutton } from "../components/Sbutton";

import { Sharecard } from "../components/Sharecard";
import { Briansvg } from "../Icon/Brainsvg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logged, logout } from "../HelperFunction/authcheck";
import { Dragspotify } from "../components/Dragspotify";
interface Content {
  _id: string;
  title: string;
  link: string;
  type: "Youtube" | "Twitter" | "Other";
}

type FilterType = "ALL" | "Twitter" | "Youtube" | "Spotify"; //for filtering sidebar button all youtube twitter

async function fetchData() {
  const res = await axios.get(`${Backendurl}/api/v1/content`, {
    headers: {
      authorization: localStorage.getItem("Token"),
    },
  });
  //console.log(res.data.content)
  return res.data.content;
}

function Dashboard() {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const { data, isLoading, error } = useQuery<Content[]>({
    queryKey: ["content"],
    queryFn: fetchData,
  });

  const navigate = useNavigate();

  const filteredData = data?.filter((item) => {
    if (filter === "ALL") return true;
    return item.type === filter;
  });

  // const containerRef = useRef(null);
  //console.log(data);

  const [mopen, setmOpen] = useState(false);
  const [sopen, setsOpen] = useState(true);
  const [scopen, scopenSet] = useState(false);
  const [login, setlogin] = useState(logged());

  function handllogout() {
    logout();
    setlogin(false);
    navigate("/");
  }
  <div className="flex items-center ml-5 gap-2 cursor-pointer">
    <Briansvg />
    <div className="flex text-3xl">
      <span className="text-black">Conc</span>
      <span style={{ color: "#8d80bc" }}>ious</span>
    </div>
  </div>;

  return (
    <div className="flex min-h-screen select-none">
      <div className="w-72 flex flex-col gap-6 h-225 sticky top-0">
        <div
          onClick={() => navigate("/")}
          className="flex select-none items-center pt-4 ml-5 gap-2 cursor-pointer"
        >
          <Briansvg />
          <div className="flex text-3xl">
            <span className="text-black">Conc</span>
            <span style={{ color: "#8d80bc" }}>ious</span>
          </div>
        </div>
        <div className="flex-1 gap-2 ml-3 mt-3">
          <Sbutton
            onClose={() => {
              setsOpen((c) => !c);
            }}
            soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
            css="left-5 top-26 h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 border border-gray-200 shadow-md hover:shadow-lg hover:bg-gray-50 active:scale-95 transition-all duration-200"
            StartIcon={<SidebarIcon />}
          />
          {sopen && <Sidebar onSelect={setFilter} />}
        </div>
        <div className="flex mt-2 items-center justify-center cursor-pointer">
          <Dragspotify />
        </div>
      </div>
      <div className=" flex-1 p-4 overflow-y-auto bg-gray-100 h-full">
        <CreateContentModal
          open={mopen}
          onClose={() => {
            setmOpen(false);
          }}
        />
        <div className="flex justify-end gap-4">
          {" "}
          <Button
            variety="Primary"
            text="Add Content"
            StartIcon={<PlusIcon />}
            onClose={() => {
              setmOpen(true);
            }}
            soundSrc="src/assets/mixkit-retro-game-notification-212.wav"
          ></Button>{" "}
          <Button
            variety="Secondary"
            text="Share Brain"
            onClose={() => {
              scopenSet((c) => !c);
            }}
          />
          {login && (
            <Button
              variety="Primary"
              text="Logout"
              onClose={() => {
                handllogout();
              }}
            />
          )}
          {scopen && <Sharecard />}
        </div>
        <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-8">
          {isLoading && <p>Loading...</p>}
          {error && <p>Something went wrong</p>}
          {filteredData?.map((item) => (
            <Card
              key={item._id}
              _id={item._id}
              title={item.title}
              link={item.link}
              type={item.type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
