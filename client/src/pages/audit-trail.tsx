import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditTrail() {
  return (
    <AppLayout title="Audit Trail">
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-secondary-custom">
            Audit trail functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
