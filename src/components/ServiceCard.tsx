
import { Link } from "react-router-dom";
import { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link 
      to={`/services/${service.id}`}
      className="flex flex-col items-center p-4 border rounded-lg hover:border-primary transition-colors"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted mb-3">
        <img 
          src={service.icon} 
          alt={service.name} 
          className="w-8 h-8"
        />
      </div>
      <h3 className="text-sm font-medium text-center">{service.name}</h3>
    </Link>
  );
};

export default ServiceCard;
