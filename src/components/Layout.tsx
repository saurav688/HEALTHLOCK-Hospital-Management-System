import { ReactNode } from "react";
import { Activity } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex bg-background">
      <AppSidebar />
      <div className="flex flex-col flex-1 ml-64">
        <header className="h-16 sticky top-0 bg-card border-b shadow-sm flex items-center px-6 z-50">
          <Activity className="h-5 w-5 text-primary mr-3" />
          <span className="font-semibold text-lg">
            Hospital Management System
          </span>
        </header>

        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
