'use client';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui';
import { CustomCheckbox } from '@/shared/components/ui/custom-checkbox';
import { useReducer, useTransition } from 'react';
import { createEmployee } from '../api/mutations/create-employee';
import { createEmployeeFormReducer, initialState } from '../hooks/use-create-employee-form';
import { toast } from '@/shared/components/toast';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export function CreateEmployeeForm() {
  const [s, d] = useReducer(createEmployeeFormReducer, initialState);
  const [pending, startTransition] = useTransition();

  const total =
    s.overrideKm != null
      ? s.overrideKm * 21 * s.officeDays.length
      : undefined;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    d({ type: 'SUBMIT' });
    startTransition(async () => {
      try {
        const result = await createEmployee({
          name: s.name,
          homeAddress: s.address,
          travelType: s.travelType as any,
          officeDays: s.officeDays,
        });
        d({ type: 'SUCCESS', payload: result });
        toast.success(`Employee ${s.name} created successfully! Distance: ${result.distanceKm}km, Monthly cost: €${(result.costCents/100).toFixed(2)}`);
        d({ type: 'RESET' });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create employee';
        d({ type: 'ERROR', payload: errorMessage });
        toast.error(errorMessage);
      }
    });
  }

  return (
    <form className="max-w-lg space-y-4" onSubmit={onSubmit}>
      <div>
        <Label>Name</Label>
        <Input
          value={s.name}
          onChange={(e) => d({ type: 'SET', field: 'name', payload: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Home Address</Label>
        <Input
          value={s.address}
          onChange={(e) => d({ type: 'SET', field: 'address', payload: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Office Days</Label>
        <div className="grid grid-cols-2">
          {days.map((day) => (
            <label key={day} className="flex items-center gap-2">
              <CustomCheckbox
                checked={s.officeDays.includes(day)}
                onChange={() => {}}
                onCheckedChange={(c) => {
                  const updated = c
                    ? [...s.officeDays, day]
                    : s.officeDays.filter((d) => d !== day);
                  d({ type: 'SET', field: 'officeDays', payload: updated });
                }}
              />
              {day}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Travel Type</Label>
        <Select
          value={s.travelType}
          onValueChange={(v) => d({ type: 'SET', field: 'travelType', payload: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="car">Car</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="bike">Bike</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Override distance (km)</Label>
        <Input
          type="number"
          min="0"
          value={s.overrideKm ?? ''}
          onChange={(e) =>
            d({
              type: 'SET',
              field: 'overrideKm',
              payload: e.target.value === '' ? undefined : Number(e.target.value),
            })
          }
        />
        <p className="text-sm text-muted-foreground">
          Leave blank to auto-calc.
        </p>
      </div>

      {total != null && (
        <p>
          Monthly cost: €{(total / 100).toFixed(2)}
        </p>
      )}

      <Button type="submit" disabled={s.isSubmitting || pending}>
        {s.isSubmitting || pending ? 'Creating...' : 'Create'}
      </Button>

      {s.error && <p className="text-red-500">{s.error}</p>}
      {s.result && (
        <p className="text-green-600">
          Saved. Distance: {s.result.distanceKm} km, Cost: €{(s.result.costCents/100).toFixed(2)}
        </p>
      )}
    </form>
  );
}
