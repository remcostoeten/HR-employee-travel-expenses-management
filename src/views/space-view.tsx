'use client';

import { ConnectedAccounts } from '@/modules/authenticatie/ui/connected-accounts';
import { ProfileForm } from '@/modules/authenticatie/ui/profile-form';
import { Separator } from '@/shared/components/ui/separator';

export function DashboardView() {
	return (
		<div className="space-y-8">
			<div className="space-y-6">
				<h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
				<ProfileForm />
			</div>

			<Separator />

			{/* Connected Accounts Section */}
			<div className="space-y-6">
				<ConnectedAccounts />
			</div>
		</div>
	);
}
