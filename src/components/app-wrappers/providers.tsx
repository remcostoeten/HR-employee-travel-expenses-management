'use client';

import { ToastProvider } from '@/shared/components/toast';
import { UserProvider } from '@/modules/authenticatie/context/user-context';
import { useAuth } from '@/modules/authenticatie/hooks/use-auth';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { toast } from '@/shared/components/toast';

type TProviderProps = PageProps;

function AuthProvider({ children }: TProviderProps) {
	const auth = useAuth();
	const status = auth.status;
	const user = status === 'authenticated' ? auth.user : null;
	const searchParams = useSearchParams();

	// Handle URL-based messages and redirects
	useEffect(() => {
		const message = searchParams.get('message');
		const error = searchParams.get('error');
		const success = searchParams.get('success');
		const welcome = searchParams.get('welcome');

		if (message) {
			toast.info(message);
		}
		if (error) {
			toast.error(error);
		}
		if (success === 'true') {
			if (welcome === 'true') {
				toast.success('Welcome to your new account! 🎉');
			} else {
				toast.success('Authentication successful');
			}
		}

		// Clean up URL parameters after showing messages
		if (message || error || success || welcome) {
			const url = new URL(window.location.href);
			url.searchParams.delete('message');
			url.searchParams.delete('error');
			url.searchParams.delete('success');
			url.searchParams.delete('welcome');
			window.history.replaceState({}, '', url);
		}
	}, [searchParams]);

	return (
		<UserProvider user={user} isLoading={status === 'loading'}>
			{children}
		</UserProvider>
	);
}

export function Providers({ children }: TProviderProps) {
	return (
		<ToastProvider>
			<Suspense fallback={<div>Loading...</div>}>
				<AuthProvider>{children}</AuthProvider>
			</Suspense>
		</ToastProvider>
	);
}
