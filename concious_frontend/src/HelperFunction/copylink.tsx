import toast from "react-hot-toast";

export async function copyLink({link}:{link:string}) {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied 🔗");
    } catch {
      toast.error("Failed to copy link");
    }
  }