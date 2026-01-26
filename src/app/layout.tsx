import type { Metadata } from 'next';
import '@/app/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Record player Search Tool',
	description: 'created by Gavin K',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' className={`${inter.className} h-full scroll-smooth antialiased`}>
			<link rel='icon' href='/favicon.png' sizes='any' />
			<body className={inter.className}>
				<Header />
				<main className='flex min-h-screen flex-col items-center justify-between'>{children}</main>
			</body>
		</html>
	);
}
