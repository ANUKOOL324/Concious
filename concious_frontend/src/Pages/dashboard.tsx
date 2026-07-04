import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchContentList } from "../api/contentApi";
import { logged, logout } from "../HelperFunction/authcheck";
import { CreateContentModal } from "../components/CreateContentModal";
import { AshqnorChat } from "../components/dashboard/Ashqnor/AshqnorChat";
import { SemanticSearch } from "../components/dashboard/SemanticSearch/SemanticSearch";
import { ContentGrid } from "../components/dashboard/ContentGrid";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { MobileSidebarDrawer } from "../components/dashboard/MobileSidebarDrawer";
import type { Content, FilterType } from "../types/content";

const DESKTOP_BREAKPOINT = 1024;

function isDesktopScreen() {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

function Dashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<FilterType>("ALL");
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return isDesktopScreen();
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("dashboard-theme") === "dark";
  });
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return isDesktopScreen();
  });
  const [shareOpen, setShareOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { data, isLoading, error } = useQuery<Content[]>({
    queryKey: ["content"],
    queryFn: fetchContentList,
  });

  const filteredData = data?.filter((item) => {
    if (filter === "ALL") {
      return true;
    }
    return item.type === filter;
  });

  // Send user to sign in page if token is missing
  useEffect(() => {
    if (!logged()) {
      navigate("/signin");
      return;
    }

    const interval = setInterval(() => {
      if (!logged()) {
        navigate("/signin");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  // Save dark mode choice in localStorage
  useEffect(() => {
    localStorage.setItem("dashboard-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Update layout when screen size changes
  useEffect(() => {
    function handleResize() {
      const desktop = isDesktopScreen();
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate("/");
  }

  function toggleTheme() {
    setDarkMode((currentTheme) => !currentTheme);
  }

  const isLoggedIn = logged();

  return (
    <DashboardLayout darkMode={darkMode}>
      <CreateContentModal
        open={contentModalOpen}
        darkMode={darkMode}
        onClose={() => setContentModalOpen(false)}
      />

      <SemanticSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        darkMode={darkMode}
      />

      <AshqnorChat darkMode={darkMode} />

      {!isDesktop && sidebarOpen && (
        <MobileSidebarDrawer
          darkMode={darkMode}
          isLoggedIn={isLoggedIn}
          onClose={() => setSidebarOpen(false)}
          onGoHome={() => navigate("/")}
          onFilterSelect={setFilter}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
        />
      )}

      <div className="flex h-full min-h-0 flex-col lg:flex-row">
        <DashboardSidebar
          darkMode={darkMode}
          sidebarOpen={sidebarOpen}
          onGoHome={() => navigate("/")}
          onToggleSidebar={() => setSidebarOpen((isOpen) => !isOpen)}
          onFilterSelect={setFilter}
        />

        <div className="flex min-h-0 flex-1 flex-col px-4 py-3 lg:px-5 lg:py-4">
          <DashboardHeader
            darkMode={darkMode}
            isLoggedIn={isLoggedIn}
            shareOpen={shareOpen}
            onToggleTheme={toggleTheme}
            onOpenSearch={() => setSearchOpen(true)}
            onOpenAddContent={() => setContentModalOpen(true)}
            onToggleShare={() => setShareOpen((isOpen) => !isOpen)}
            onLogout={handleLogout}
          />

          <ContentGrid
            items={filteredData}
            isLoading={isLoading}
            hasError={!!error}
            darkMode={darkMode}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
