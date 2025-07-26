import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 pointer-events-auto animate-fade-in", className)}
      captionLayout="dropdown-buttons"
      fromYear={1900}
      toYear={new Date().getFullYear()}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-2 pb-4 relative items-center",
        caption_label: "text-base font-semibold text-foreground",
        caption_dropdowns: "flex justify-center gap-2 animate-slide-down",
        dropdown_month: "relative inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm",
        dropdown_year: "relative inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-background/80 backdrop-blur-sm border-input hover:bg-primary hover:text-primary-foreground hover:border-primary p-0 opacity-70 hover:opacity-100 transition-all duration-200 shadow-sm hover:shadow-md rounded-lg"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 mt-4",
        head_row: "flex mb-2",
        head_cell:
          "text-muted-foreground rounded-md w-10 font-medium text-sm text-center py-2",
        row: "flex w-full mt-1",
        cell: "relative h-10 w-10 text-center text-sm p-0 focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-end)]:rounded-r-lg [&:has([aria-selected].day-outside)]:bg-primary/10 [&:has([aria-selected])]:bg-primary/10 first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 hover:text-foreground transition-all duration-200 rounded-lg border border-transparent hover:border-primary/20 hover:shadow-sm"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md border-primary font-semibold rounded-lg transform hover:scale-105 transition-all duration-200",
        day_today: "bg-primary/15 text-primary font-bold border border-primary/30 rounded-lg shadow-sm",
        day_outside:
          "day-outside text-muted-foreground/50 opacity-50 aria-selected:bg-primary/5 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground/30 opacity-30 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-primary/10 aria-selected:text-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => (
          <ChevronLeft className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
        ),
        IconRight: ({ ..._props }) => (
          <ChevronRight className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };