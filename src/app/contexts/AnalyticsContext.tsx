import { createContext, useContext, useState, useCallback, useMemo } from "react";

interface PageView {
  page: string;
  timestamp: Date;
}

interface AnalyticsContextType {
  trackPageView: (page: string) => void;
  trackEvent: (category: string, action: string, label?: string) => void;
  pageViews: PageView[];
  mostVisitedPages: { page: string; count: number }[];
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [pageViews, setPageViews] = useState<PageView[]>([]);

  const trackPageView = useCallback((page: string) => {
    setPageViews((prev) => [...prev, { page, timestamp: new Date() }]);
  }, []);

  const trackEvent = useCallback((category: string, action: string, label?: string) => {
    // In production, this would send to analytics service
    console.log("Analytics Event:", { category, action, label, timestamp: new Date() });
  }, []);

  const mostVisitedPages = useMemo(() => {
    return pageViews
      .reduce((acc, view) => {
        const existing = acc.find((item) => item.page === view.page);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ page: view.page, count: 1 });
        }
        return acc;
      }, [] as { page: string; count: number }[])
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [pageViews]);

  return (
    <AnalyticsContext.Provider
      value={{ trackPageView, trackEvent, pageViews, mostVisitedPages }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider");
  }
  return context;
}