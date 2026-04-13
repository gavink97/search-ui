'use client';

type Locations = Countries[];

interface Countries {
	id: number;
	country: string;
	territories: Territories[];
}

interface Territories {
	id: number;
	territory: string;
	locals: Locals[];
}

interface Locals {
	id: number;
	local: string;
}

export function SideBar() {
	// const res: Locations = await queryLocations();

	return <div id='side-bar'></div>;
}

function _NestedCheckbox(data: Locations) {
	const handleBoxChecked = (_e, _ancestors) => {};

	return <NestedCheckboxHelper nodes={data} ancestors={[]} onBoxChecked={handleBoxChecked} />;
}

function NestedCheckboxHelper({ nodes, ancestors, onBoxChecked }) {
	const prefix = ancestors.join('.');
	return (
		<ul>
			{nodes.map(({ label, checked, childrenNodes }) => {
				const id = `${prefix}.${label}`;
				let children = null;
				if (childrenNodes.length > 0) {
					children = (
						<NestedCheckboxHelper
							nodes={childrenNodes}
							ancestors={[...ancestors, label]}
							onBoxChecked={onBoxChecked}
						/>
					);
				}

				return (
					<li key={id}>
						<input
							type='checkbox'
							name={id}
							value={label}
							checked={checked}
							onChange={(e) => onBoxChecked(e, ancestors)}
						/>
						<label htmlFor={id}>{label}</label>
						{children}
					</li>
				);
			})}
		</ul>
	);
}
