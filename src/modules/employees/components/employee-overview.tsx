'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui';
import { toast } from '@/shared/components/toast';
import { getAllEmployees } from '../api/queries/get-all-employees';
import { deleteEmployee } from '../api/mutations/delete-employee';
import { Search, Users, MapPin, Car, Bike, Bus, Trash2, Edit } from 'lucide-react';
import { TableSkeleton } from '@/modules/admin/ui/table-skeleton';

type TEmployee = {
  id: string;
  name: string;
  homeAddress: string;
  travelType: 'car' | 'public' | 'bike';
  officeDays: string[];
  distanceKm: number;
  euroPerKm: number;
  monthlyCostCents: number;
  createdAt: Date;
  updatedAt: Date;
};

const travelIcons = {
  car: Car,
  public: Bus,
  bike: Bike,
};

const travelColors = {
  car: 'bg-blue-100 text-blue-800',
  public: 'bg-green-100 text-green-800',
  bike: 'bg-orange-100 text-orange-800',
};

export function EmployeeOverview() {
  const [employees, setEmployees] = useState<TEmployee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<TEmployee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<TEmployee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const data = await getAllEmployees();
        setEmployees(data);
        setFilteredEmployees(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        toast.error('Failed to load employees');
        setIsLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = employees.filter(
        employee =>
          employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.homeAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.travelType.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchQuery, employees]);

  const totalMonthlyCost = filteredEmployees.reduce((sum, emp) => sum + emp.monthlyCostCents, 0);

  function handleDeleteClick(employee: TEmployee) {
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!employeeToDelete) return;

    setIsDeleting(true);
    try {
      await deleteEmployee(employeeToDelete.id);
      toast.success(`Employee ${employeeToDelete.name} deleted successfully`);

      // Refresh the employee list
      const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete.id);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees.filter(emp =>
        searchQuery === '' ||
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.homeAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.travelType.toLowerCase().includes(searchQuery.toLowerCase())
      ));

      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error('Failed to delete employee:', error);
      toast.error('Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5" /> Employee Overview
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredEmployees.length} employees • Total monthly cost: €{(totalMonthlyCost / 100).toFixed(2)}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees by name, address, or travel type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <TableSkeleton
            columns={['Name', 'Address', 'Travel', 'Office Days', 'Distance', 'Monthly Cost', 'Actions']}
            rows={5}
            columnWidths={['w-[120px]', 'w-[200px]', 'w-[80px]', 'w-[120px]', 'w-[80px]', 'w-[100px]', 'w-[80px]']}
          />
        ) : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium">Home Address</th>
                  <th className="py-3 px-4 text-left font-medium">Travel Type</th>
                  <th className="py-3 px-4 text-left font-medium">Office Days</th>
                  <th className="py-3 px-4 text-left font-medium">Distance</th>
                  <th className="py-3 px-4 text-right font-medium">Monthly Cost</th>
                  <th className="py-3 px-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-muted-foreground">
                      {searchQuery ? 'No employees found matching your search' : 'No employees found'}
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => {
                    const TravelIcon = travelIcons[employee.travelType];
                    return (
                      <tr key={employee.id} className="border-b hover:bg-muted/25">
                        <td className="py-3 px-4 font-medium">{employee.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate max-w-[200px]" title={employee.homeAddress}>
                              {employee.homeAddress}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${travelColors[employee.travelType]}`}>
                            <TravelIcon className="h-3 w-3" />
                            {employee.travelType.charAt(0).toUpperCase() + employee.travelType.slice(1)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {employee.officeDays.map((day) => (
                              <span key={day} className="inline-block px-1.5 py-0.5 bg-muted text-xs rounded">
                                {day.slice(0, 3)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">{employee.distanceKm} km</td>
                        <td className="py-3 px-4 text-right font-medium">
                          €{(employee.monthlyCostCents / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                // TODO: Implement edit functionality
                                toast.info('Edit functionality coming soon');
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive/80"
                              onClick={() => handleDeleteClick(employee)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Employee</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {employeeToDelete?.name}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
