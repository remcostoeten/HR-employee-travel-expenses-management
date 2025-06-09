'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from 'utilities';

type AuthFormSkeletonProps = {
	variant?: 'login' | 'register';
	className?: string;
};

export function AuthFormSkeleton({ variant = 'login', className }: AuthFormSkeletonProps) {
	const isRegister = variant === 'register';

	return (
		<div className={cn('flex min-h-screen items-center justify-center', className)}>
			<div className="w-full max-w-[720px] px-4">
				{/* Logo for register page */}
				{isRegister && (
					<div className="flex justify-center mb-6">
						<Skeleton className="h-8 w-32" />
					</div>
				)}

				<Card className="overflow-hidden py-0">
					<CardContent className="grid p-0 md:grid-cols-2 h-full">
						{/* Form Column */}
						<div className="pt-6 flex flex-col gap-6 p-6 md:p-8">
							{/* Header */}
							<div className="flex flex-col items-center text-center">
								<Skeleton className="h-9 w-48 mb-2" />
								<Skeleton className="h-5 w-56" />
							</div>

							{/* Form Fields */}
							<div className="space-y-6">
								{/* Name field (register only) */}
								{isRegister && (
									<div className="grid gap-2">
										<Skeleton className="h-4 w-12" />
										<Skeleton className="h-10 w-full" />
									</div>
								)}

								{/* Email field */}
								<div className="grid gap-2">
									<Skeleton className="h-4 w-12" />
									<Skeleton className="h-10 w-full" />
								</div>

								{/* Password field */}
								<div className="grid gap-2">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-10 w-full" />
								</div>

								{/* Remember me checkbox (login only) */}
								{!isRegister && (
									<div className="flex items-center space-x-2">
										<Skeleton className="h-4 w-4 rounded" />
										<Skeleton className="h-4 w-24" />
									</div>
								)}
							</div>

							{/* Submit Button */}
							<Skeleton className="h-10 w-full" />

							{/* Divider */}
							<div className="pb-6 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
								<span className="relative z-10 bg-background px-2">
									<Skeleton className="h-4 w-32" />
								</span>
							</div>

							{/* OAuth Buttons */}
							<div className="grid grid-cols-3 gap-4">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
							</div>

							{/* Footer Link */}
							<div className="text-center text-sm">
								<Skeleton className="h-4 w-40 mx-auto" />
							</div>
						</div>

						{/* Right Column - Waves Background */}
						<div className="relative hidden h-full min-h-[500px] bg-muted md:block overflow-hidden">
							{/* Animated skeleton waves effect */}
							<div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted/60 animate-pulse" />
							<div className="absolute inset-0 opacity-30">
								<div className="absolute top-1/4 left-1/4 w-32 h-32 bg-muted-foreground/10 rounded-full animate-pulse" />
								<div className="absolute top-1/2 right-1/4 w-24 h-24 bg-muted-foreground/10 rounded-full animate-pulse delay-300" />
								<div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-muted-foreground/10 rounded-full animate-pulse delay-700" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Terms and Privacy Policy */}
				<div className="mt-4 text-center">
					<Skeleton className="h-3 w-80 mx-auto" />
				</div>
			</div>
		</div>
	);
}
