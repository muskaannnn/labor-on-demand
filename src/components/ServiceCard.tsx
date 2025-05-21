
import { Link } from "react-router-dom";
import { Service } from "@/types";
import { Hammer, Box } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Helper function to get the appropriate icon
  const getServiceIcon = () => {
    switch (service.id) {
      case "construction":
        return <Hammer className="h-8 w-8 text-blue-500" />;
      case "loading":
        return <Box className="h-8 w-8 text-blue-500" />;
      case "sorting":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        );
      case "gas-cutting":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="6" x2="12" y2="2" />
            <line x1="12" y1="22" x2="12" y2="18" />
            <line x1="17" y1="7" x2="20" y2="4" />
            <line x1="7" y1="17" x2="4" y2="20" />
            <line x1="17" y1="17" x2="20" y2="20" />
            <line x1="7" y1="7" x2="4" y2="4" />
          </svg>
        );
      default:
        return <Box className="h-8 w-8 text-blue-500" />;
    }
  };

  // Helper function to get Hindi translation for service name
  const getHindiName = () => {
    switch (service.id) {
      case "construction":
        return "निर्माण कार्यकर्ता";
      case "loading":
        return "लोडिंग/अनलोडिंग";
      case "sorting":
        return "सामग्री छँटाई";
      case "gas-cutting":
        return "गैस कटिंग";
      default:
        return "";
    }
  };

  return (
    <Link 
      to={`/services/${service.id}`}
      className="flex flex-col items-center p-6 border rounded-xl bg-white hover:shadow-md transition-all"
    >
      <div className="flex justify-center items-center mb-4">
        {getServiceIcon()}
      </div>
      <h3 className="text-base font-medium text-center">{service.name}</h3>
      <p className="text-sm text-gray-500 text-center mt-1">{getHindiName()}</p>
    </Link>
  );
};

export default ServiceCard;
