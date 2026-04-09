import { Consume } from "../sections/Consume";
import { Collase } from "../sections/Collase";
import { BackIcon } from "../Icon/BackIcon";
import { useNavigate } from "react-router-dom";

export default function WhyConscious() {
  const navigate = useNavigate();

  return (
    <main className="relative bg-white text-black">
      <nav
        className="flex flex-col justify-center h-50 items-center ml-10 w-10 absolute z-15 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <BackIcon />
        <p className="tracking-tight text-shadow-amber-300 shadow-2xs cursor-pointer">
          Back
        </p>
      </nav>
      <Collase />
      <section
        id="testimonial"
        className="
              relative
              min-h-screen
              p-6
              md:p-10
              bg-white
            "
      >
        <div
          className="
                relative
                min-h-screen
                rounded-3xl
                overflow-hidden
                border
                border-gray-200
                shadow-xl
              "
        >
          <div
            className="
                  absolute
                  inset-0
                  z-0
                  bg-center
                  bg-cover
                  will-change-transform
                  bg-fixed
                  flex flex-col justify-center items-center
                "
            style={{
              backgroundImage: "url('c2.png')",
            }}
          />
          <Consume />
        </div>
      </section>
    </main>
  );
}
