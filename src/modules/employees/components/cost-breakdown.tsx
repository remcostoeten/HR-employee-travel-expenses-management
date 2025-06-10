'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';
import { Calculator, MapPin, Calendar, Euro, Info } from 'lucide-react';

type TCostBreakdownProps = {
  employee: {
    name: string;
    distanceKm: number;
    euroPerKm: number;
    customEuroPerKm?: number;
    customAgreementNotes?: string;
    officeDays: string[];
    travelType: 'car' | 'public' | 'bike';
  };
};

export function CostBreakdown({ employee }: TCostBreakdownProps) {
  const effectiveRate = employee.customEuroPerKm || employee.euroPerKm;
  const dailyCost = employee.distanceKm * effectiveRate;
  const weeklyCost = dailyCost * employee.officeDays.length;
  const monthlyCost = weeklyCost * 4.33; // Average weeks per month
  
  const isCustomRate = !!employee.customEuroPerKm;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Cost Breakdown - {employee.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Distance</p>
              <p className="text-lg">{employee.distanceKm} km</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Rate per km</p>
              <p className="text-lg">
                €{(effectiveRate / 100).toFixed(2)}
                {isCustomRate && (
                  <span className="text-xs text-orange-600 ml-1">(Custom)</span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Office Days</p>
              <p className="text-lg">{employee.officeDays.length} days/week</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Calculation Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Daily cost ({employee.distanceKm} km × €{(effectiveRate / 100).toFixed(2)}):</span>
              <span>€{(dailyCost / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Weekly cost (€{(dailyCost / 100).toFixed(2)} × {employee.officeDays.length} days):</span>
              <span>€{(weeklyCost / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Monthly cost (€{(weeklyCost / 100).toFixed(2)} × 4.33 weeks):</span>
              <span>€{(monthlyCost / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {employee.customAgreementNotes && (
          <div className="border-t pt-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-600">Custom Agreement</p>
                <p className="text-sm text-muted-foreground">{employee.customAgreementNotes}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Office days: {employee.officeDays.join(', ')}</p>
          <p>Travel type: {employee.travelType.charAt(0).toUpperCase() + employee.travelType.slice(1)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
