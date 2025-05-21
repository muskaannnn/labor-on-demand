
export type UserRole = "worker" | "employer";

export interface User {
  id?: string;
  phoneNumber: string;
  name: string;
  city: string;
  role: UserRole;
  profileCompleted?: boolean;
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Booking {
  id?: string;
  serviceId: string;
  serviceName: string;
  userId: string;
  date: string;
  timeSlot: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  numberOfWorkers: number;
  status: "pending" | "confirmed" | "onTheWay" | "arrived" | "inProgress" | "completed";
  workers?: Worker[];
  liftAvailable: boolean;
  estimatedCost?: number;
}

export interface Worker {
  id: string;
  phoneNumber: string;
  name: string;
  languages: string[];
  services: string[];
  rating: number;
  city: string;
}

export interface Review {
  id?: string;
  bookingId: string;
  userId: string;
  workerId: string;
  rating: number;
  comment: string;
  date: string;
}
