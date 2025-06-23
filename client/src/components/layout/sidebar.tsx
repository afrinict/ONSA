import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  Wrench, 
  MapPin, 
  BarChart3, 
  History, 
  User,
  ClipboardList,
  Shield,
  Archive,
  Building
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Assets", href: "/assets", icon: Package },
  { name: "Work Orders", href: "/work-orders", icon: ClipboardList },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Inventory", href: "/inventory", icon: Archive },
  { name: "Vendors", href: "/vendors", icon: Building },
  { name: "Compliance", href: "/compliance", icon: Shield },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Audit Trail", href: "/audit-trail", icon: History },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 bg-surface border-r border-border">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-border">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="text-white text-sm" size={16} />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-primary-custom">AssetPro</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || 
              (item.href !== "/" && location.startsWith(item.href));
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-white"
                      : "text-secondary-custom hover:bg-border-subtle hover:text-primary-custom"
                  )}
                >
                  <item.icon className="mr-3" size={18} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-border">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="text-white text-sm" size={18} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-primary-custom">John Smith</p>
              <p className="text-xs text-secondary-custom">Asset Manager</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
