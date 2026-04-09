import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import Dashboard from "./Pages/dashboard";
import { Signin } from "./Pages/Signin";
import { Signup } from "./Pages/Signup";
import { Sharedbrain } from "./components/SharedBrain";
import Main from "./Pages/Main";
import WhyConscious from "./components/Whyconcious";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
    style: {
      background: "white",
      color: "black",
    },
  }}/>
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/brain/:hash" element={<Sharedbrain/>} />
          <Route path="/why" element={<WhyConscious/>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;


