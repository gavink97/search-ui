import dayjs from 'dayjs';

export interface PageProps {
	expire_by: string;
	last_id: number;
	last_date: string;
	order: 'DESC' | 'ASC';
	limit: number;
	query: string;
	locations: number[];
	event_type?: string; // just for debugging
}

export function DefaultPageProps(order: 'DESC' | 'ASC' = 'DESC'): PageProps {
	const defaultExpire = dayjs().subtract(3, 'days').format();

	switch (order) {
		case 'ASC':
			return {
				expire_by: defaultExpire,
				last_id: 0,
				last_date: '',
				order: order,
				limit: 80,
				query: '',
				locations: [],
			};
		default:
			return {
				expire_by: defaultExpire,
				last_id: Infinity,
				last_date: '9999-12-31 23:59:59',
				order: order,
				limit: 80,
				query: '',
				locations: [],
			};
	}
}

export interface MetadataProps {
	total: number;
	sources: DataSourceProps[];
}

export function DefaultMetadataProps(): MetadataProps {
	return {
		total: 0,
		sources: [],
	};
}

export interface DataSourceProps {
	id: number;
	name: string;
	count: number;
	countries: DataCountryProps[];
}

export interface DataCountryProps {
	id: number;
	name: string;
	count?: number;
	territories: DataTerritoryProps[];
}

export interface DataTerritoryProps {
	id: number;
	name: string;
	count?: number;
	locals: DataLocalProps[];
}

export interface DataLocalProps {
	id: number;
	name: string;
	count?: number;
}
