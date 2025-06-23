import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sample maintenance schedule data
const maintenanceSchedule = [
  {
    id: 1,
    assetName: "Dell OptiPlex 7090",
    assetId: "AST-2025-001",
    type: "Preventive Maintenance",
    frequency: "Quarterly",
    nextDue: new Date("2025-03-15"),
    lastCompleted: new Date("2024-12-15"),
    status: "upcoming",
    estimatedCost: 150,
  },
  {
    id: 2,
    assetName: "HP LaserJet Pro",
    assetId: "AST-2025-003",
    type: "Toner Replacement",
    frequency: "As Needed",
    nextDue: new Date("2025-01-20"),
    lastCompleted: new Date("2024-10-15"),
    status: "overdue",
    estimatedCost: 125,
  },
  {
    id: 3,
    assetName: "Ford Transit Van",
    assetId: "AST-2025-004",
    type: "Oil Change & Service",
    frequency: "Every 6 months",
    nextDue: new Date("2025-06-01"),
    lastCompleted: new Date("2024-12-01"),
    status: "completed",
    estimatedCost: 250,
  },
  {
    id: 4,
    assetName: "Conference Table",
    assetId: "AST-2025-002",
    type: "Deep Cleaning",
    frequency: "Monthly",
    nextDue: new Date("2025-02-01"),
    lastCompleted: new Date("2025-01-01"),
    status: "upcoming",
    estimatedCost: 75,
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "upcoming":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "upcoming":
      return Clock;
    case "overdue":
      return AlertTriangle;
    default:
      return Clock;
  }
}

function getDaysUntilDue(date: Date): number {
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function Maintenance() {
  const actions = (
    <Button>
      <Plus className="mr-2" size={16} />
      Schedule Maintenance
    </Button>
  );

  const upcomingCount = maintenanceSchedule.filter(m => m.status === 'upcoming').length;
  const overdueCount = maintenanceSchedule.filter(m => m.status === 'overdue').length;
  const completedThisMonth = maintenanceSchedule.filter(m => 
    m.status === 'completed' && 
    new Date(m.lastCompleted).getMonth() === new Date().getMonth()
  ).length;

  return (
    <AppLayout title="Maintenance Management" actions={actions}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Upcoming</p>
                <p className="text-2xl font-semibold text-primary-custom">{upcomingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Overdue</p>
                <p className="text-2xl font-semibold text-primary-custom">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Completed This Month</p>
                <p className="text-2xl font-semibold text-primary-custom">{completedThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Total Scheduled</p>
                <p className="text-2xl font-semibold text-primary-custom">{maintenanceSchedule.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Schedule Table */}
      <Card className="bg-surface border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg font-semibold text-primary-custom">Maintenance Schedule</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Maintenance Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Due</TableHead>
                  <TableHead>Last Completed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Est. Cost</TableHead>
                  <TableHead>Days Until Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceSchedule.map((maintenance) => {
                  const StatusIcon = getStatusIcon(maintenance.status);
                  const daysUntilDue = getDaysUntilDue(maintenance.nextDue);
                  
                  return (
                    <TableRow key={maintenance.id} className="hover:bg-border-subtle transition-colors">
                      <TableCell>
                        <div>
                          <div className="text-sm text-primary-custom">{maintenance.assetName}</div>
                          <div className="text-xs text-secondary-custom">{maintenance.assetId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {maintenance.type}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {maintenance.frequency}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {format(maintenance.nextDue, "PP")}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {format(maintenance.lastCompleted, "PP")}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("inline-flex items-center capitalize", getStatusColor(maintenance.status))}>
                          <StatusIcon className="mr-1" size={12} />
                          {maintenance.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        ${maintenance.estimatedCost}
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className={cn(
                          "font-medium",
                          daysUntilDue < 0 ? "text-red-600" : 
                          daysUntilDue <= 7 ? "text-yellow-600" : 
                          "text-green-600"
                        )}>
                          {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                           daysUntilDue === 0 ? "Due today" :
                           `${daysUntilDue} days`}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
