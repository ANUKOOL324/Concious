import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchContentList } from "../api/contentApi";
import { logged, logout, getUsername } from "../HelperFunction/authcheck";
import { CreateContentModal } from "../components/content/CreateContentModal";
import {
  AshqnorChat,
  ContentGrid,
  ContentSortBar,
  DashboardHeader,
  DashboardLayout,
  DashboardSidebar,
  MobileSidebarDrawer,
  SpotifyFloatingButton,
} from "../components/dashboard";
import { Dragspotify } from "../components/spotify/Dragspotify";
import type { Content, ContentSortOrder, FilterType } from "../types/content";
import { sortContentItems } from "../types/content";

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
    const saved = localStorage.getItem("dashboard-sidebar-open");
    if (saved === "false") return false;
    if (saved === "true") return true;
    return isDesktopScreen();
  });
  const [shareOpen, setShareOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<ContentSortOrder>("latest");

  const { data, isLoading, error } = useQuery<Content[]>({
    queryKey: ["content"],
    queryFn: fetchContentList,
  });

  const filteredData = sortContentItems(
    (data ?? []).filter((item) => filter === "ALL" || item.type === filter),
    sortOrder
  );

  const hasContent = (data?.length ?? 0) > 0;

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

  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem("dashboard-sidebar-open", String(sidebarOpen));
    }
  }, [sidebarOpen, isDesktop]);

  // Update layout when screen size changes
  useEffect(() => {
    function handleResize() {
      const desktop = isDesktopScreen();
      setIsDesktop(desktop);
      if (desktop) {
        const saved = localStorage.getItem("dashboard-sidebar-open");
        setSidebarOpen(saved !== "false");
      } else {
        setSidebarOpen(false);
      }
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
  const username = getUsername();

  return (
    <DashboardLayout darkMode={darkMode}>
      <CreateContentModal
        open={contentModalOpen}
        darkMode={darkMode}
        onClose={() => setContentModalOpen(false)}
      />

      <AshqnorChat darkMode={darkMode} />

      <SpotifyFloatingButton
        darkMode={darkMode}
        active={spotifyOpen}
        onToggle={() => setSpotifyOpen((isOpen) => !isOpen)}
      />

      <Dragspotify darkMode={darkMode} open={spotifyOpen} />

      {!isDesktop && sidebarOpen && (
        <MobileSidebarDrawer
          darkMode={darkMode}
          isLoggedIn={isLoggedIn}
          username={username}
          activeFilter={filter}
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
          activeFilter={filter}
          isLoggedIn={isLoggedIn}
          username={username}
          onGoHome={() => navigate("/")}
          onToggleSidebar={() => setSidebarOpen((isOpen) => !isOpen)}
          onFilterSelect={setFilter}
          onLogout={handleLogout}
        />

        <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col px-3 py-3 sm:px-4 lg:px-5 lg:py-4">
          <DashboardHeader
            darkMode={darkMode}
            shareOpen={shareOpen}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onToggleTheme={toggleTheme}
            onOpenAddContent={() => setContentModalOpen(true)}
            onToggleShare={() => setShareOpen((isOpen) => !isOpen)}
          />

          {!isLoading && hasContent && (
            <ContentSortBar
              darkMode={darkMode}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
          )}

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
