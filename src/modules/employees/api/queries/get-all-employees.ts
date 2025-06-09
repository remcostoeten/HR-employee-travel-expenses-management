'use server';
import { db } from '@/api/db/connection';
import { employees } from '../../schemas';
import { desc } from 'drizzle-orm';

export async function getAllEmployees() {
  const allEmployees = await db
    .select({
      id: employees.id,
      name: employees.name,
      homeAddress: employees.homeAddress,
      travelType: employees.travelType,
      officeDays: employees.officeDays,
      distanceKm: employees.distanceKm,
      euroPerKm: employees.euroPerKm,
      createdAt: employees.createdAt,
      updatedAt: employees.updatedAt,
    })
    .from(employees)
    .orderBy(desc(employees.createdAt));

  return allEmployees.map(employee => ({
    ...employee,
    officeDays: JSON.parse(employee.officeDays) as string[],
    monthlyCostCents: employee.distanceKm * employee.euroPerKm * JSON.parse(employee.officeDays).length,
  }));
}
