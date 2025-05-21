
import React from "react";
import { Star } from "lucide-react";
import { Worker } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkerCardProps {
  worker: Worker;
  selected: boolean;
  onSelect: (workerId: string) => void;
}

const WorkerCard = ({ worker, selected, onSelect }: WorkerCardProps) => {
  return (
    <Card 
      className={`hover:border-primary transition-colors cursor-pointer ${selected ? 'border-primary border-2' : ''}`} 
      onClick={() => onSelect(worker.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-base">{worker.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">
              {worker.languages.join(", ")}
            </p>
            
            <div className="flex items-center space-x-1 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{worker.rating.toFixed(1)}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {worker.services.map((service) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
          
          {selected && (
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkerCard;
