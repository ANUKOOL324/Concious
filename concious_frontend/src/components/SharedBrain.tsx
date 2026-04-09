import axios from "axios";
import { Backendurl } from "../config";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "./Card";

interface content {
  _id: string;
  title: string;
  link: string;
  type: "Youtube" | "Twitter" | "Other";
}

async function fetchbraincontent(hash: string) {
  const res = await axios.get(`${Backendurl}/api/v1/brain/${hash}`);
  return res.data;
}

export function Sharedbrain() {
  const { hash } = useParams<{ hash: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["shared-brain", hash],
    queryFn: () => fetchbraincontent(hash!),
    enabled: !!hash,
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error || !data) {
    return <div>Invalid Link </div>;
  }

  return (
    <div className="flex flex-wrap  ">
      <div className="text-purple-500 text-3xl mb-5">{data.username}</div>
      <div className="flex flex-wrap justify-start gap-3 pl-2">
        {data.content.map((item: content) => (
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
  );
}
