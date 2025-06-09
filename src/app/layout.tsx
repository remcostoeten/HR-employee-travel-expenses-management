import { Providers } from '@/components/app-wrappers/providers';
import { ThemeProvider } from '@/components/app-wrappers/theme-provider';
import { ThemeToggle } from '@/components/app-wrappers/theme-toggle';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Authentication Demo',
	description: 'A clean Next.js authentication demo with login and registration',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html className="dark" data-theme="supabase" suppressHydrationWarning>
			<body suppressHydrationWarning>
				<ThemeProvider>
					<Providers>
						<main className="min-h-screen">{children}</main>
						<div className="fixed bottom-4 right-4">
							<ThemeToggle />
						</div>
					</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
