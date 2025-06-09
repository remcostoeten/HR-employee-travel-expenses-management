'use client';

import { Flex } from '@/shared/components/flex';
import { Button, Container } from 'ui';
import Link from 'next/link';

export default function HomePage() {
	return (
		<Flex column className="w-screen min-h-screen mx-auto relative bg-background">
			<Container>
				<div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8">
					<h1 className="text-4xl font-bold tracking-tight">Authentication Demo</h1>
					<p className="text-xl text-muted-foreground max-w-2xl">
						A clean Next.js authentication system with login and registration
					</p>
					<div className="flex gap-4">
						<Button asChild>
							<Link href="/login">Login</Link>
						</Button>
						<Button variant="outline" asChild>
							<Link href="/register">Register</Link>
						</Button>
					</div>
				</div>
			</Container>
		</Flex>
	);
}
