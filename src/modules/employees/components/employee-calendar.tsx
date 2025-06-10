'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from '@/shared/components/ui';
import { toast } from '@/shared/components/toast';
import { getDailyEntriesAction } from '../api/actions/daily-entries-actions';
import { TEntryType } from '../schemas';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { EntryDetailModal } from './entry-detail-modal';
import { CreateEntryModal } from './create-entry-modal';

type TDailyEntry = {
  id: string;
  employeeId: string;
  date: string;
  entryType: TEntryType;
  startTime?: string;
  endTime?: string;
  breakMinutes?: number;
  notes?: string;
  travelCostCents: number;
  isApproved: boolean;
  employeeName: string;
  employeeTravelType: string;
};

const ENTRY_TYPE_COLORS: Record<TEntryType, string> = {
  office: 'bg-blue-100 text-blue-800 border-blue-200',
  remote: 'bg-green-100 text-green-800 border-green-200',
  sick: 'bg-red-100 text-red-800 border-red-200',
  vacation: 'bg-purple-100 text-purple-800 border-purple-200',
  holiday: 'bg-orange-100 text-orange-800 border-orange-200',
};

const ENTRY_TYPE_LABELS: Record<TEntryType, string> = {
  office: 'Office',
  remote: 'Remote',
  sick: 'Sick',
  vacation: 'Vacation',
  holiday: 'Holiday',
};

export function EmployeeCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<TDailyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<TDailyEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const firstDayOfCalendar = new Date(firstDayOfMonth);
  firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfMonth.getDay());
  
  const lastDayOfCalendar = new Date(lastDayOfMonth);
  lastDayOfCalendar.setDate(lastDayOfCalendar.getDate() + (6 - lastDayOfMonth.getDay()));

  useEffect(() => {
    fetchEntries();
  }, [currentDate]);

  async function fetchEntries() {
    setIsLoading(true);
    try {
      const startDate = formatDate(firstDayOfCalendar);
      const endDate = formatDate(lastDayOfCalendar);
      
      const result = await getDailyEntriesAction({ startDate, endDate });
      if (result.success) {
        setEntries(result.data);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      toast.error('Failed to load calendar entries');
    } finally {
      setIsLoading(false);
    }
  }

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function navigateMonth(direction: 'prev' | 'next') {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }

  function getEntriesForDate(date: Date): TDailyEntry[] {
    const dateStr = formatDate(date);
    return entries.filter(entry => entry.date === dateStr);
  }

  function handleDateClick(date: Date) {
    const dateStr = formatDate(date);
    const dayEntries = getEntriesForDate(date);
    
    if (dayEntries.length === 1) {
      setSelectedEntry(dayEntries[0]);
    } else if (dayEntries.length > 1) {
      setSelectedEntry(dayEntries[0]);
    } else {
      setSelectedDate(dateStr);
      setShowCreateModal(true);
    }
  }

  function renderCalendarDays() {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let date = new Date(firstDayOfCalendar); date <= lastDayOfCalendar; date.setDate(date.getDate() + 1)) {
      const currentDateCopy = new Date(date);
      const dayEntries = getEntriesForDate(currentDateCopy);
      const isCurrentMonth = currentDateCopy.getMonth() === currentDate.getMonth();
      const isToday = currentDateCopy.getTime() === today.getTime();
      const isPastDate = currentDateCopy < today;

      days.push(
        <div
          key={currentDateCopy.toISOString()}
          className={`
            min-h-[100px] p-2 border border-border cursor-pointer transition-colors
            ${isCurrentMonth ? 'bg-background' : 'bg-muted/30'}
            ${isToday ? 'ring-2 ring-primary' : ''}
            hover:bg-accent/50
          `}
          onClick={() => handleDateClick(currentDateCopy)}
        >
          <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
            {currentDateCopy.getDate()}
          </div>
          
          <div className="space-y-1">
            {dayEntries.slice(0, 2).map((entry) => (
              <Badge
                key={entry.id}
                variant="outline"
                className={`text-xs px-1 py-0 h-5 ${ENTRY_TYPE_COLORS[entry.entryType]}`}
              >
                {ENTRY_TYPE_LABELS[entry.entryType]}
              </Badge>
            ))}
            {dayEntries.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayEntries.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  }

  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Employee Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[200px] text-center">
                {monthYear}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading calendar...</div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-0 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden">
                {renderCalendarDays()}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(ENTRY_TYPE_LABELS).map(([type, label]) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className={`${ENTRY_TYPE_COLORS[type as TEntryType]}`}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selectedEntry && (
        <EntryDetailModal
          entry={selectedEntry}
          isOpen={!!selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={fetchEntries}
        />
      )}

      {showCreateModal && selectedDate && (
        <CreateEntryModal
          date={selectedDate}
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedDate(null);
          }}
          onCreate={fetchEntries}
        />
      )}
    </>
  );
}
