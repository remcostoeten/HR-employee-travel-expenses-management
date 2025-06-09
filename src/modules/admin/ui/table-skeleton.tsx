import { Skeleton } from '@/shared/components/ui/skeleton';

interface TableSkeletonProps {
  columns: string[];
  rows?: number;
  columnWidths?: string[];
}

export function TableSkeleton({ 
  columns, 
  rows = 5, 
  columnWidths = [] 
}: TableSkeletonProps) {
  // Default widths if not provided
  const defaultWidths = columns.map((_, index) => {
    switch (index) {
      case 0: return 'w-[120px]'; // Name/Title column
      case 1: return 'w-[180px]'; // Email/Description column
      case 2: return 'w-[80px]';  // Role/Status column
      case 3: return 'w-[100px]'; // Date column
      case 4: return 'w-[80px]';  // Actions column
      default: return 'w-[100px]';
    }
  });

  const widths = columnWidths.length > 0 ? columnWidths : defaultWidths;

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`py-3 px-4 text-left font-medium ${
                  index === columns.length - 1 ? 'text-right' : ''
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {columns.map((_, colIndex) => (
                <td key={colIndex} className="py-3 px-4">
                  {colIndex === columns.length - 1 ? (
                    // Actions column - show button skeletons
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  ) : colIndex === 2 && columns[colIndex].toLowerCase().includes('role') ? (
                    // Role column - show badge skeleton
                    <Skeleton className="h-6 w-[60px] rounded-full" />
                  ) : (
                    // Regular text skeleton
                    <Skeleton className={`h-4 ${widths[colIndex] || 'w-[100px]'}`} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
