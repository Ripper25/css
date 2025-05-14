import React from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ArrowRight, PresentationChart } from "@phosphor-icons/react";

interface PlanModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon: React.ReactNode;
  date?: string;
  location?: string;
  projectId?: number; // Associated project ID
}

const PlanModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  icon,
  date,
  location,
  projectId,
}: PlanModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 text-primary-500 rounded-xl flex items-center justify-center">
              {icon}
            </div>
            <DialogTitle className="text-xl">{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {date && (
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-gray-500">{date}</p>
              </div>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-gray-500">{location}</p>
              </div>
            </div>
          )}

          {projectId && (
            <div className="flex items-center gap-3">
              <PresentationChart className="h-5 w-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium">Associated Project</p>
                <p className="text-sm text-primary-500">View project details</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          {projectId && (
            <DialogClose asChild>
              <Button asChild>
                <Link to={`/project/${projectId}`}>
                  Manage Project
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanModal;
