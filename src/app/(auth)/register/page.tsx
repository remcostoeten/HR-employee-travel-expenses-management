import { Suspense } from 'react';
import { AuthFormSkeleton } from '@/modules/authenticatie/ui/auth-form-skeleton';
import { RegisterForm } from '../../../modules/authenticatie/ui/register-form';

export default function RegisterPage() {
	return (
		<Suspense fallback={<AuthFormSkeleton variant="register" />}>
			<RegisterForm />
		</Suspense>
	);
}
