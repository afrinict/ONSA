import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Maintenance() {
  return (
    <AppLayout title="Maintenance Management">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-custom">
            Maintenance management functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
