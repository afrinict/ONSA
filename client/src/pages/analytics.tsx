import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Clock, Zap, Download } from "lucide-react";

// Sample analytics data
const costTrendData = [
  { month: "Jan", maintenance: 4500, operations: 12000 },
  { month: "Feb", maintenance: 3200, operations: 11500 },
  { month: "Mar", maintenance: 5800, operations: 13200 },
  { month: "Apr", maintenance: 2900, operations: 10800 },
  { month: "May", maintenance: 4100, operations: 12500 },
  { month: "Jun", maintenance: 3700, operations: 11900 },
];

const downTimeData = [
  { month: "Jan", planned: 12, unplanned: 8 },
  { month: "Feb", planned: 10, unplanned: 5 },
  { month: "Mar", planned: 15, unplanned: 12 },
  { month: "Apr", planned: 8, unplanned: 3 },
  { month: "May", planned: 11, unplanned: 7 },
  { month: "Jun", planned: 9, unplanned: 4 },
];

const assetUtilizationData = [
  { name: "IT Equipment", value: 85, color: "#3b82f6" },
  { name: "Vehicles", value: 92, color: "#10b981" },
  { name: "Machinery", value: 76, color: "#f59e0b" },
  { name: "Furniture", value: 98, color: "#8b5cf6" },
];

const workOrderTrendData = [
  { month: "Jan", preventive: 45, corrective: 23, emergency: 8 },
  { month: "Feb", preventive: 52, corrective: 19, emergency: 5 },
  { month: "Mar", preventive: 38, corrective: 31, emergency: 12 },
  { month: "Apr", preventive: 49, corrective: 16, emergency: 4 },
  { month: "May", preventive: 43, corrective: 22, emergency: 7 },
  { month: "Jun", preventive: 47, corrective: 18, emergency: 6 },
];

export default function Analytics() {
  const actions = (
    <div className="flex space-x-2">
      <Select defaultValue="6months">
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1month">Last Month</SelectItem>
          <SelectItem value="3months">Last 3 Months</SelectItem>
          <SelectItem value="6months">Last 6 Months</SelectItem>
          <SelectItem value="1year">Last Year</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline">
        <Download className="mr-2" size={16} />
        Export Report
      </Button>
    </div>
  );

  return (
    <AppLayout title="Analytics & Reports" actions={actions}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Asset Utilization</p>
                <p className="text-2xl font-semibold text-primary-custom">87.3%</p>
                <p className="text-xs text-green-600">+2.1% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">Total Maintenance Cost</p>
                <p className="text-2xl font-semibold text-primary-custom">$23,700</p>
                <p className="text-xs text-red-600">+8.3% from last month</p>
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
                <p className="text-sm font-medium text-secondary-custom">Avg. Downtime</p>
                <p className="text-2xl font-semibold text-primary-custom">6.5h</p>
                <p className="text-xs text-green-600">-12% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface border-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Zap className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-custom">MTBF</p>
                <p className="text-2xl font-semibold text-primary-custom">180d</p>
                <p className="text-xs text-green-600">+5.2% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Cost Trend Chart */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary-custom">Cost Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                <Line type="monotone" dataKey="maintenance" stroke="#f59e0b" strokeWidth={2} name="Maintenance" />
                <Line type="monotone" dataKey="operations" stroke="#3b82f6" strokeWidth={2} name="Operations" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Downtime Analysis */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary-custom">Downtime Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={downTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} hours`, ""]} />
                <Bar dataKey="planned" fill="#10b981" name="Planned" />
                <Bar dataKey="unplanned" fill="#ef4444" name="Unplanned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Utilization */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary-custom">Asset Utilization by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetUtilizationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="text-sm text-secondary-custom">{item.name}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${item.value}%`, 
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-primary-custom w-12">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Order Distribution */}
        <Card className="bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-primary-custom">Work Order Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workOrderTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="preventive" stackId="a" fill="#10b981" name="Preventive" />
                <Bar dataKey="corrective" stackId="a" fill="#f59e0b" name="Corrective" />
                <Bar dataKey="emergency" stackId="a" fill="#ef4444" name="Emergency" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}