import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Wrench, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sample work orders data
const workOrders = [
  {
    id: "WO-2025-001",
    assetName: "HP LaserJet Pro",
    assetId: "AST-2025-003",
    type: "Preventive Maintenance",
    priority: "high",
    status: "in-progress",
    assignedTo: "John Smith",
    scheduledDate: new Date("2025-01-15"),
    description: "Replace toner cartridge and clean paper feed mechanism",
    estimatedHours: 2,
  },
  {
    id: "WO-2025-002",
    assetName: "Ford Transit Van",
    assetId: "AST-2025-004",
    type: "Routine Service",
    priority: "medium",
    status: "completed",
    assignedTo: "Mike Johnson",
    scheduledDate: new Date("2024-12-01"),
    completedDate: new Date("2024-12-01"),
    description: "Oil change and tire rotation",
    estimatedHours: 1.5,
    actualHours: 1.25,
  },
  {
    id: "WO-2025-003",
    assetName: "Conference Table",
    assetId: "AST-2025-002",
    type: "Corrective Maintenance",
    priority: "low",
    status: "open",
    assignedTo: "Sarah Wilson",
    scheduledDate: new Date("2025-01-20"),
    description: "Fix wobbly leg and replace power outlet cover",
    estimatedHours: 1,
  },
];

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "open":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "in-progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "open":
      return Clock;
    case "in-progress":
      return Wrench;
    case "completed":
      return CheckCircle;
    case "cancelled":
      return AlertTriangle;
    default:
      return Clock;
  }
}

export default function WorkOrders() {
  const actions = (
    <Button>
      <Plus className="mr-2" size={16} />
      Create Work Order
    </Button>
  );

  return (
    <AppLayout title="Work Order Management" actions={actions}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Open</p>
                <p className="text-2xl font-semibold text-primary-custom">
                  {workOrders.filter(wo => wo.status === 'open').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Wrench className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">In Progress</p>
                <p className="text-2xl font-semibold text-primary-custom">
                  {workOrders.filter(wo => wo.status === 'in-progress').length}
                </p>
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
                <p className="text-sm font-medium text-secondary-custom">Completed</p>
                <p className="text-2xl font-semibold text-primary-custom">
                  {workOrders.filter(wo => wo.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <AlertTriangle className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Overdue</p>
                <p className="text-2xl font-semibold text-primary-custom">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Orders Table */}
      <Card className="bg-surface border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg font-semibold text-primary-custom">Work Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Work Order ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Est. Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((workOrder) => {
                  const StatusIcon = getStatusIcon(workOrder.status);
                  return (
                    <TableRow key={workOrder.id} className="hover:bg-border-subtle transition-colors">
                      <TableCell className="text-sm font-mono text-primary-custom">
                        {workOrder.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm text-primary-custom">{workOrder.assetName}</div>
                          <div className="text-xs text-secondary-custom">{workOrder.assetId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {workOrder.type}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("inline-flex items-center capitalize", getPriorityColor(workOrder.priority))}>
                          {workOrder.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("inline-flex items-center capitalize", getStatusColor(workOrder.status))}>
                          <StatusIcon className="mr-1" size={12} />
                          {workOrder.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {workOrder.assignedTo}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {format(workOrder.scheduledDate, "PP")}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {workOrder.estimatedHours}h
                        {workOrder.actualHours && (
                          <div className="text-xs text-green-600">
                            Actual: {workOrder.actualHours}h
                          </div>
                        )}
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