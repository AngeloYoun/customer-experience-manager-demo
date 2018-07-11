import TextInput from 'components/inputs/TextInput';

function ListHeader({showController, onChange, title}) {
	let controller;

	if (showController) {
		controller = (
			<div class="controller">
				<TextInput
					elementClasses="filter"
					label="Filter"
					onChange={onChange}
				/>
			</div>
		);
	}

	return (
		<div class="list-header-container">
			<h3 class="list-header-title">{title}</h3>

			{controller}
		</div>
	);
}

export default ListHeader;