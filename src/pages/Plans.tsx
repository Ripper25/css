
import { useState, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { plans } from "@/data/projectData";
import { format, parse, isSameMonth, isSameDay, addMonths, subMonths, getDate, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import {
  NotePencil,
  Megaphone,
  Chalkboard,
  Globe,
  Calendar as CalendarIcon,
  UsersThree,
  FirstAid,
  CaretLeft,
  CaretRight,
  Plus
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import PlanModal from "@/components/ui-components/PlanModal";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const Plans = () => {
  const [month, setMonth] = useState<Date>(new Date(2025, 0, 1)); // January 2025
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Icons for each plan type
  const planIcons: Record<string, JSX.Element> = {
    "WOSE": <NotePencil size={16} />,
    "EVANGELISTIC": <Megaphone size={16} />,
    "SEMINAR": <Chalkboard size={16} />,
    "DEVOTIONS": <UsersThree size={16} />,
    "SPECIAL": <CalendarIcon size={16} />,
    "DEFAULT": <Globe size={16} />
  };

  // Get icon for a plan
  const getPlanIcon = (planName: string) => {
    if (planName.includes("WOSE")) return planIcons["WOSE"];
    if (planName.includes("EVANGELISTIC")) return planIcons["EVANGELISTIC"];
    if (planName.includes("SEMINAR")) return planIcons["SEMINAR"];
    if (planName.includes("DEVOTIONS")) return planIcons["DEVOTIONS"];
    if (planName.includes("DAY") || planName.includes("MONTH") || planName.includes("AWARENESS"))
      return planIcons["SPECIAL"];
    return planIcons["DEFAULT"];
  };

  // Parse dates from plans
  const parsedPlans = useMemo(() => {
    return plans.map(plan => ({
      ...plan,
      parsedDate: plan.date ? parse(plan.date, "yyyy-MM-dd", new Date()) : null
    }));
  }, []);

  // Get days for the current month view
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    return eachDayOfInterval({ start, end });
  }, [month]);

  // Get plans for a specific day
  const getPlansForDay = (day: Date) => {
    return parsedPlans.filter(
      plan => plan.parsedDate && isSameDay(plan.parsedDate, day)
    );
  };

  // Handle plan click
  const handlePlanClick = (plan: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  // Navigate to previous month
  const prevMonth = () => {
    setMonth(subMonths(month, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setMonth(addMonths(month, 1));
  };

  return (
    <MainLayout title="Our 2025 Plans" showBackButton={true}>
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{format(month, "MMM' 'yyyy")}</h1>
            <div className="flex">
              <button onClick={prevMonth} className="p-1 text-gray-500 hover:text-gray-700">
                <CaretLeft size={16} />
              </button>
              <button onClick={nextMonth} className="p-1 text-gray-500 hover:text-gray-700">
                <CaretRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
              Here all your planned events. You will find information for each event as well you can planned new one.
            </p>
            <Button className="bg-gray-900 text-white text-xs px-3 py-1 h-auto rounded">
              <Plus size={14} className="mr-1" /> Add event
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4">
          {/* Day headers */}
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {daysInMonth.map((day, i) => {
            const dayNumber = getDate(day);
            const dayPlans = getPlansForDay(day);
            const isToday = isSameDay(day, new Date());

            // Adjust for starting day of week (Monday = 0 in our array, but 1 in getDay)
            const dayOfWeek = getDay(day) === 0 ? 6 : getDay(day) - 1;

            // Apply left margin to the first day based on the day of week
            const marginLeft = i === 0 ? `${dayOfWeek * (100 / 7)}%` : '0';

            return (
              <div
                key={day.toString()}
                className={cn(
                  "border-t pt-2 min-h-[120px] relative",
                  dayPlans.length > 0 ? "cursor-pointer" : ""
                )}
                style={i === 0 ? { gridColumnStart: dayOfWeek + 1 } : {}}
              >
                <div className={cn(
                  "text-lg font-medium mb-2",
                  isToday ? "text-red-500" : "text-gray-700"
                )}>
                  {dayNumber}
                </div>

                <div className="space-y-1">
                  {dayPlans.slice(0, 3).map((plan) => (
                    <div
                      key={plan.id}
                      onClick={(e) => handlePlanClick(plan, e)}
                      className={cn(
                        "text-xs p-1 rounded",
                        plan.name.includes("WOSE") ? "bg-blue-100 text-blue-800" :
                        plan.name.includes("EVANGELISTIC") ? "bg-green-100 text-green-800" :
                        plan.name.includes("SEMINAR") ? "bg-purple-100 text-purple-800" :
                        "bg-gray-100 text-gray-800"
                      )}
                    >
                      <div className="font-medium truncate">{plan.name}</div>
                      {plan.location && (
                        <div className="text-xs opacity-75 truncate">{plan.location}</div>
                      )}
                    </div>
                  ))}

                  {dayPlans.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayPlans.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for plan details */}
      {selectedPlan && (
        <PlanModal
          isOpen={modalOpen}
          onOpenChange={setModalOpen}
          title={selectedPlan.name}
          description={selectedPlan.description}
          icon={getPlanIcon(selectedPlan.name)}
          date={selectedPlan.parsedDate ? format(selectedPlan.parsedDate, "MMMM d, yyyy") : undefined}
          location={selectedPlan.location}
          projectId={selectedPlan.projectId}
        />
      )}
    </MainLayout>
  );
};

export default Plans;
