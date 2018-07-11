import {fromJS, List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import dropdownIcon from 'resources/dropdown-icon';

class SelectInput extends JSXComponent {
	render() {
		const {
			data,
			renderer,
			selectedIndex
		} = this.props;

		const {
			active,
		} = this.state;

		return (
			<div class="select-input-container">
				<div
					class="select-input"
					onClick={this._handleSelectInputToggle}
				>
					<div class="option">
						{renderer(data.get(selectedIndex))}
					</div>

					{dropdownIcon}
				</div>

				{active && (
					<div class="options">
						{data.map(
							(entry, index) => (
								<div
									class={`option ${index === selectedIndex ? 'selected' : ''}`}
									onClick={this._handleOptionSelect(entry, index)}
								>
									{renderer(entry, index === selectedIndex ? true : false)}
								</div>
							)
						).toJS()}
					</div>
				)}
			</div>
		);
	}

	_handleSelectInputToggle = () => {
		const active = !this.state.active;

		this.setState(
			{
				active
			}
		)

		if (active) {
			document.addEventListener('click', this._handleSelectInputToggle);
		}
		else {
			document.removeEventListener('click', this._handleSelectInputToggle);
		}
	};

	_handleOptionSelect = (entry, index) => event => {
		const {
			onChange
		} = this.props;

		onChange(entry, index, event);
	}
}

SelectInput.PROPS = {
	data: Config.instanceOf(List).required(),
	onChange: Config.func().required(),
	renderer: Config.func().required(),
	selectedIndex: Config.number().value(0)
};

SelectInput.STATE = {
	active: Config.bool().value(false)
}

export default SelectInput;