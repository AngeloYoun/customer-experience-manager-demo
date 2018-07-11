import JSXComponent, {Config} from 'metal-jsx';

import dropdownIcon from 'resources/dropdown-icon';

class DropdownInput extends JSXComponent {
	render() {
		const {
			children,
			label
		} = this.props;

		const {
			active
		} = this.state;

		return (
			<div class="dropdown-input-container">
				<div
					class={`dropdown-toggle ${active ? 'active' : ''}`}
					onClick={this._handleDropdownToggle}
				>
					<h4 class="label">{label}</h4>

					{dropdownIcon}
				</div>

				{active && (
					<div class="dropdown">
						{children}
					</div>
				)}
			</div>
		);
	}

	_handleDropdownToggle = () => {
		this.setState(
			{
				active: !this.state.active
			}
		)
	};
}

DropdownInput.PROPS = {
	label: Config.string().required(),
};

DropdownInput.STATE = {
	active: Config.bool().value(false)
}

export default DropdownInput;