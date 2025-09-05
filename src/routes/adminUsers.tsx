import { createFileRoute } from '@tanstack/react-router'
import AdminUsers from '../components/ui/pages/adminUsers';
export const Route = createFileRoute('/adminUsers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdminUsers />;
}
