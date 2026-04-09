import toast from "react-hot-toast";
import { Sharebutton } from "./Sharebutton";
import { Backendurl } from "../config";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

async function fetchsharelink()
{
  const res = await axios.post(`${Backendurl}/api/v1/brain/share`,{
    status:true
  },{
    headers:{
      authorization:localStorage.getItem('Token')
    }
  })
 console.log(res)
  return res.data;
}

export function Sharecard() {

  // async function copyLink() {
  //   try {
  //     await navigator.clipboard.writeText(link);
  //     toast.success("Link copied 🔗");
  //   } catch {
  //     toast.error("Failed to copy link");
  //   }
  // }

  const shareMutation = useMutation({
    mutationFn:fetchsharelink,
    onSuccess:(data) => {
      const shareUrl = `${window.location.origin}/brain/${data.hash}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Brain link copied !");
    },
    onError:()=>{
      toast.error("Failed to share brain")
    }
  })

  return (
    <div className="absolute flex flex-col items-center right-2 top-19 w-72 h-100 bg-white rounded-2xl shadow-lg shadow-black-200/40 
  border-2
  border-dashed
  border-black-400/40
  p-5">
     <h2 className="text-purple-500 text-xl font-medium text-center  tracking-wide">Live collaboration</h2>
    <p className="mt-3 text-base text-gray-900 text-center">
  Invite people to collaborate.
</p>
<p className="mt-2 text-sm text-gray-500 text-center max-w-xl mx-auto">
  Don't worry, the session is end-to-end encrypted and fully private.
</p>
 <h2 className="text-purple-500 text-xl font-medium text-center mt-5 tracking-wide">Shareable link</h2>
 <div className="mt-5"></div>
 <Sharebutton css="text-white bg-purple-500" text="🔗 Get Link" onClose={()=>shareMutation.mutate()} />
</div>
  );
}