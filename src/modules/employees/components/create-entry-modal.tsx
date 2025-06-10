'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/shared/components/ui';
import { toast } from '@/shared/components/toast';
import { createDailyEntryAction } from '../api/actions/daily-entries-actions';
import { getEmployeesAction } from '../api/actions/get-employees-action';
import { TEntryType } from '../schemas';
import { Plus, Clock } from 'lucide-react';

type TCreateEntryModalProps = {
  date: string; // YYYY-MM-DD
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
};

type TEmployee = {
  id: string;
  name: string;
  travelType: string;
};

const ENTRY_TYPE_OPTIONS = [
  { value: 'office', label: 'Office' },
  { value: 'remote', label: 'Remote' },
  { value: 'sick', label: 'Sick' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'holiday', label: 'Holiday' },
];

export function CreateEntryModal({ date, isOpen, onClose, onCreate }: TCreateEntryModalProps) {
  const [employees, setEmployees] = useState<TEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    employeeId: '',
    entryType: 'office' as TEntryType,
    startTime: '09:00',
    endTime: '17:00',
    breakMinutes: 30,
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  async function fetchEmployees() {
    setIsLoading(true);
    try {
      const result = await getEmployeesAction();
      if (result.success && result.data) {
        setEmployees(result.data.map(emp => ({
          id: emp.id,
          name: emp.name,
          travelType: emp.travelType,
        })));

        // Auto-select first employee if only one
        if (result.data.length === 1) {
          setFormData(prev => ({ ...prev, employeeId: result.data![0].id }));
        }
      } else {
        toast.error(result.error || 'Failed to load employees');
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(field: string, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }

    setIsSaving(true);
    try {
      const result = await createDailyEntryAction({
        employeeId: formData.employeeId,
        date,
        entryType: formData.entryType,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        breakMinutes: formData.breakMinutes,
        notes: formData.notes || undefined,
      });

      if (result.success) {
        toast.success('Entry created successfully');
        onClose();
        onCreate();
        // Reset form
        setFormData({
          employeeId: '',
          entryType: 'office' as TEntryType,
          startTime: '09:00',
          endTime: '17:00',
          breakMinutes: 30,
          notes: '',
        });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to create entry:', error);
      toast.error('Failed to create entry');
    } finally {
      setIsSaving(false);
    }
  }

  function calculateWorkHours(): string {
    if (!formData.startTime || !formData.endTime) return 'N/A';
    
    const start = new Date(`2000-01-01T${formData.startTime}:00`);
    const end = new Date(`2000-01-01T${formData.endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const workHours = diffHours - (formData.breakMinutes / 60);
    
    return workHours > 0 ? `${workHours.toFixed(1)}h` : 'N/A';
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Entry
          </DialogTitle>
          <DialogDescription>
            Add a new entry for {formattedDate}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading employees...</div>
        ) : (
          <div className="space-y-4">
            {/* Employee Selection */}
            <div>
              <Label htmlFor="employeeId">Employee</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => handleInputChange('employeeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.travelType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Entry Type */}
            <div>
              <Label htmlFor="entryType">Entry Type</Label>
              <Select
                value={formData.entryType}
                onValueChange={(value) => handleInputChange('entryType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENTRY_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>

            {/* Break Minutes */}
            <div>
              <Label htmlFor="breakMinutes">Break (minutes)</Label>
              <Input
                id="breakMinutes"
                type="number"
                min="0"
                value={formData.breakMinutes}
                onChange={(e) => handleInputChange('breakMinutes', parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Work Hours Calculation */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Work Hours: {calculateWorkHours()}</span>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any notes about this day..."
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSaving || isLoading || !formData.employeeId}
          >
            {isSaving ? 'Creating...' : 'Create Entry'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
