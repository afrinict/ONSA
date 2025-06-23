import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Locations() {
  return (
    <AppLayout title="Location Management">
      <Card>
        <CardHeader>
          <CardTitle>Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-custom">
            Location management functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
