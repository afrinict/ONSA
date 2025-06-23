import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reports() {
  return (
    <AppLayout title="Reports & Analytics">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-custom">
            Reporting and analytics functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
