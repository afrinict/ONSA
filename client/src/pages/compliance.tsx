import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sample compliance records data
const complianceRecords = [
  {
    id: 1,
    assetName: "Ford Transit Van",
    assetId: "AST-2025-004",
    regulationType: "DOT",
    regulationName: "Vehicle Safety Inspection",
    complianceStatus: "compliant",
    lastInspectionDate: new Date("2024-06-15"),
    nextInspectionDate: new Date("2025-06-15"),
    inspectorName: "City Motor Vehicle Department",
    certificateNumber: "DOT-2024-ABC123",
    expiryDate: new Date("2025-06-15"),
    daysUntilExpiry: 143,
  },
  {
    id: 2,
    assetName: "Dell OptiPlex 7090",
    assetId: "AST-2025-001",
    regulationType: "ISO",
    regulationName: "ISO 27001 IT Security",
    complianceStatus: "compliant",
    lastInspectionDate: new Date("2024-03-01"),
    nextInspectionDate: new Date("2025-03-01"),
    inspectorName: "IT Security Team",
    daysUntilExpiry: 66,
  },
  {
    id: 3,
    assetName: "HP LaserJet Pro",
    assetId: "AST-2025-003",
    regulationType: "OSHA",
    regulationName: "Workplace Safety Standards",
    complianceStatus: "pending",
    lastInspectionDate: new Date("2023-12-01"),
    nextInspectionDate: new Date("2024-12-01"),
    inspectorName: "Safety Inspector",
    daysUntilExpiry: -55, // Overdue
  },
  {
    id: 4,
    assetName: "Industrial Printer",
    assetId: "AST-2025-005",
    regulationType: "EPA",
    regulationName: "Environmental Compliance",
    complianceStatus: "non-compliant",
    lastInspectionDate: new Date("2023-06-01"),
    nextInspectionDate: new Date("2024-06-01"),
    inspectorName: "Environmental Agency",
    daysUntilExpiry: -207, // Very overdue
  },
];

function getComplianceStatusColor(status: string) {
  switch (status) {
    case "compliant":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "non-compliant":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getComplianceStatusIcon(status: string) {
  switch (status) {
    case "compliant":
      return CheckCircle;
    case "pending":
      return Clock;
    case "non-compliant":
      return AlertTriangle;
    default:
      return Clock;
  }
}

function getExpiryStatusColor(daysUntilExpiry: number) {
  if (daysUntilExpiry < 0) return "text-red-600 font-medium";
  if (daysUntilExpiry <= 30) return "text-yellow-600 font-medium";
  return "text-green-600";
}

export default function Compliance() {
  const actions = (
    <Button>
      <Plus className="mr-2" size={16} />
      Add Compliance Record
    </Button>
  );

  const compliantCount = complianceRecords.filter(r => r.complianceStatus === 'compliant').length;
  const pendingCount = complianceRecords.filter(r => r.complianceStatus === 'pending').length;
  const nonCompliantCount = complianceRecords.filter(r => r.complianceStatus === 'non-compliant').length;
  const expiringCount = complianceRecords.filter(r => r.daysUntilExpiry <= 30 && r.daysUntilExpiry >= 0).length;

  return (
    <AppLayout title="Compliance Management" actions={actions}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Compliant</p>
                <p className="text-2xl font-semibold text-primary-custom">{compliantCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Pending</p>
                <p className="text-2xl font-semibold text-primary-custom">{pendingCount}</p>
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
                <p className="text-sm font-medium text-secondary-custom">Non-Compliant</p>
                <p className="text-2xl font-semibold text-primary-custom">{nonCompliantCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Shield className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Expiring Soon</p>
                <p className="text-2xl font-semibold text-primary-custom">{expiringCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Records Table */}
      <Card className="bg-surface border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg font-semibold text-primary-custom">Compliance Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Regulation Type</TableHead>
                  <TableHead>Regulation Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Inspection</TableHead>
                  <TableHead>Next Inspection</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Days Until Expiry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complianceRecords.map((record) => {
                  const StatusIcon = getComplianceStatusIcon(record.complianceStatus);
                  
                  return (
                    <TableRow key={record.id} className="hover:bg-border-subtle transition-colors">
                      <TableCell>
                        <div>
                          <div className="text-sm text-primary-custom">{record.assetName}</div>
                          <div className="text-xs text-secondary-custom">{record.assetId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {record.regulationType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {record.regulationName}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("inline-flex items-center capitalize", getComplianceStatusColor(record.complianceStatus))}>
                          <StatusIcon className="mr-1" size={12} />
                          {record.complianceStatus.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {format(record.lastInspectionDate, "PP")}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {format(record.nextInspectionDate, "PP")}
                      </TableCell>
                      <TableCell className="text-sm text-secondary-custom">
                        {record.inspectorName}
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className={cn(getExpiryStatusColor(record.daysUntilExpiry))}>
                          {record.daysUntilExpiry < 0 ? 
                            `${Math.abs(record.daysUntilExpiry)} days overdue` :
                            record.daysUntilExpiry === 0 ? 
                            "Expires today" :
                            `${record.daysUntilExpiry} days`
                          }
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