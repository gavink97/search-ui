'use client';

const Header = () => {
	return (
		<header className='flex h-24 flex-col justify-center sticky top-0 bg-zinc-50 z-10'>
			<nav className='container'>
				<ul className='flex items-center justify-between gap-8 font-medium tracking-wider text-stone-500'>
					<li className='text-2xl text-bold text-zinc-700 ml-4'>
						<a href='/'>Search UI</a>
					</li>

					<li className='mt-0' style={{ width: '2rem' }}></li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
