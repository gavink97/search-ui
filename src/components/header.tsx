'use client';

import Link from 'next/link';

const Header = () => {
	return (
		<header className='flex h-24 flex-col justify-center sticky top-0'>
			<nav className='container'>
				<ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
					<li className='text-2xl text-bold text-stone-800 ml-4'>
						<Link href='/'>Search UI</Link>
					</li>

					<li className='mt-0' style={{ width: '2rem' }}></li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
