import { DashboardView } from '@/views/space-view';
import { ProtectedLayout } from '@/components/layouts/protected-layout';
import { Suspense } from 'react';

function DashboardLoading() {
	return (
		<div className="space-y-4">
			<div className="animate-pulse">
				<div className="h-8 bg-gray-200 rounded w-1/4"></div>
				<div className="mt-4 space-y-3">
					<div className="h-4 bg-gray-200 rounded w-3/4"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2"></div>
				</div>
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<ProtectedLayout
			title="Dashboard"
			description="Manage your account settings and connected services."
		>
			<Suspense fallback={<DashboardLoading />}>
				<DashboardView />
			</Suspense>
		</ProtectedLayout>
	);
}
