import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Assets from "@/pages/assets";
import WorkOrders from "@/pages/work-orders";
import Maintenance from "@/pages/maintenance"; 
import Inventory from "@/pages/inventory";
import Vendors from "@/pages/vendors";
import Compliance from "@/pages/compliance";
import Analytics from "@/pages/analytics";
import Locations from "@/pages/locations";
import AuditTrail from "@/pages/audit-trail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/assets" component={Assets} />
      <Route path="/work-orders" component={WorkOrders} />
      <Route path="/maintenance" component={Maintenance} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/compliance" component={Compliance} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/locations" component={Locations} />
      <Route path="/audit-trail" component={AuditTrail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
