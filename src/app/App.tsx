import { RouterProvider } from "react-router";
import { router } from "@/app/routes";
import { Toaster } from "@/app/components/ui/sonner";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { SearchProvider } from "@/app/contexts/SearchContext";
import { OnboardingProvider } from "@/app/contexts/OnboardingContext";
import { NotificationProvider } from "@/app/contexts/NotificationContext";
import { AnalyticsProvider } from "@/app/contexts/AnalyticsContext";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AnalyticsProvider>
          <NotificationProvider>
            <SearchProvider>
              <OnboardingProvider>
                <RouterProvider router={router} />
                <Toaster />
              </OnboardingProvider>
            </SearchProvider>
          </NotificationProvider>
        </AnalyticsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}