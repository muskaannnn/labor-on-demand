
import { Badge } from "@/components/ui/badge";

interface BookingStatusBadgeProps {
  status: "pending" | "confirmed" | "onTheWay" | "arrived" | "inProgress" | "completed";
}

const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return { label: "Pending", variant: "outline" as const };
      case "confirmed":
        return { label: "Confirmed", variant: "secondary" as const };
      case "onTheWay":
        return { label: "On The Way", variant: "default" as const };
      case "arrived":
        return { label: "Arrived", variant: "default" as const };
      case "inProgress":
        return { label: "In Progress", variant: "default" as const };
      case "completed":
        return { label: "Completed", variant: "outline" as const, className: "bg-green-500 text-white" };
      default:
        return { label: "Unknown", variant: "outline" as const };
    }
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className={status === "completed" ? "bg-green-500 text-white" : ""}>
      {config.label}
    </Badge>
  );
};

export default BookingStatusBadge;
