import { ReactNode, useState } from "react";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
}

export function AppLayout({ children, title, actions }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-surface border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden p-2 text-secondary-custom hover:text-primary-custom"
                  >
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="lg:hidden">
                    <Sidebar />
                  </div>
                </SheetContent>
              </Sheet>
              <h2 className="ml-4 lg:ml-0 text-2xl font-semibold text-primary-custom">{title}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="p-2 text-secondary-custom hover:text-primary-custom"
              >
                <Bell size={20} />
              </Button>
              {actions}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-app-background">
          {children}
        </main>
      </div>
    </div>
  );
}
