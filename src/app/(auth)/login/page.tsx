import { Suspense } from 'react';
import { AuthFormSkeleton } from '@/modules/authenticatie/ui/auth-form-skeleton';
import { LoginForm } from '../../../modules/authenticatie/ui/login-form';

export default function LoginPage() {
	return (
		<Suspense fallback={<AuthFormSkeleton variant="login" />}>
			<LoginForm />
		</Suspense>
	);
}
