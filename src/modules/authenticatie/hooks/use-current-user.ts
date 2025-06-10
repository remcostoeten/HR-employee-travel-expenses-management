'use client';

import { useCallback, useEffect, useState } from 'react';
import { TAuthUser } from '../types';
import { getCurrentUserAction } from '../server/actions/get-current-user-action';

export function useCurrentUser() {
	const [user, setUser] = useState<Partial<TAuthUser> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = useCallback(async () => {
		try {
			setIsLoading(true);
			const result = await getCurrentUserAction();

			if (result.success && result.user) {
				setUser(result.user);
				setError(null);
			} else {
				setError(result.error || 'Failed to fetch user data');
				setUser(null);
			}
		} catch (err) {
			setError('An unexpected error occurred');
			setUser(null);
			console.error('Error in useCurrentUser:', err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	return {
		user,
		isLoading,
		error,
		refetch: fetchUser,
	};
}
