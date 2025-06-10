'use client';

import { useState } from 'react';
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
  Badge,
} from '@/shared/components/ui';
import { toast } from '@/shared/components/toast';
import { updateDailyEntryAction, deleteDailyEntryAction } from '../api/actions/daily-entries-actions';
import { TEntryType } from '../schemas';
import { Clock, MapPin, Euro, Trash2, Save, CheckCircle } from 'lucide-react';

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

type TEntryDetailModalProps = {
  entry: TDailyEntry;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

const ENTRY_TYPE_OPTIONS = [
  { value: 'office', label: 'Office' },
  { value: 'remote', label: 'Remote' },
  { value: 'sick', label: 'Sick' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'holiday', label: 'Holiday' },
];

export function EntryDetailModal({ entry, isOpen, onClose, onUpdate }: TEntryDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    entryType: entry.entryType as TEntryType,
    startTime: entry.startTime || '',
    endTime: entry.endTime || '',
    breakMinutes: entry.breakMinutes || 0,
    notes: entry.notes || '',
  });

  function handleInputChange(field: string, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      const result = await updateDailyEntryAction({
        id: entry.id,
        entryType: formData.entryType,
        startTime: formData.startTime.trim() || undefined,
        endTime: formData.endTime.trim() || undefined,
        breakMinutes: formData.breakMinutes,
        notes: formData.notes.trim() || undefined,
      });

      if (result.success) {
        toast.success('Entry updated successfully');
        setIsEditing(false);
        onUpdate();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to update entry:', error);
      toast.error('Failed to update entry');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteDailyEntryAction(entry.id);

      if (result.success) {
        toast.success('Entry deleted successfully');
        onClose();
        onUpdate();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast.error('Failed to delete entry');
    } finally {
      setIsDeleting(false);
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

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
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
            <Clock className="h-5 w-5" />
            Entry Details
          </DialogTitle>
          <DialogDescription>
            {entry.employeeName} • {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {entry.isApproved ? (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Approved
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Pending Approval
              </Badge>
            )}
          </div>

          {/* Entry Type */}
          <div>
            <Label htmlFor="entryType">Entry Type</Label>
            {isEditing ? (
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
            ) : (
              <div className="text-sm font-medium capitalize">{entry.entryType}</div>
            )}
          </div>

          {/* Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              {isEditing ? (
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              ) : (
                <div className="text-sm">{entry.startTime || 'Not set'}</div>
              )}
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              {isEditing ? (
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              ) : (
                <div className="text-sm">{entry.endTime || 'Not set'}</div>
              )}
            </div>
          </div>

          {/* Break Minutes */}
          <div>
            <Label htmlFor="breakMinutes">Break (minutes)</Label>
            {isEditing ? (
              <Input
                id="breakMinutes"
                type="number"
                min="0"
                value={formData.breakMinutes}
                onChange={(e) => handleInputChange('breakMinutes', parseInt(e.target.value) || 0)}
              />
            ) : (
              <div className="text-sm">{entry.breakMinutes || 0} minutes</div>
            )}
          </div>

          {/* Work Hours Calculation */}
          <div>
            <Label>Work Hours</Label>
            <div className="text-sm font-medium">{calculateWorkHours()}</div>
          </div>

          {/* Travel Cost */}
          {entry.entryType === 'office' && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label>Travel Cost</Label>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Euro className="h-3 w-3" />
                  {(entry.travelCostCents / 100).toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            {isEditing ? (
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any notes about this day..."
                rows={3}
              />
            ) : (
              <div className="text-sm min-h-[60px] p-2 border rounded-md bg-muted/30">
                {entry.notes || 'No notes'}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {!entry.isApproved && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                {!entry.isApproved && (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
