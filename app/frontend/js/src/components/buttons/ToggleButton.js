import JSXComponent, {Config} from 'metal-jsx';

import Button from 'components/buttons/Button';

class ToggleButton extends JSXComponent {
	render() {
		const {
			label,
			inactiveLabel = label
		} = this.props;

		const {
			active
		} = this.state;

		return (
			<Button
				elementClasses={`toggle-button-container ${active ? 'active' : ''}`}
				onClick={this._handleClick}
			>
				{active ? label : inactiveLabel}
			</Button>
		);
	}

	syncActive(active) {
		this.setState(
			{
				active
			}
		);
	}

	_handleClick = event => {
		const {
			active,
		} = this.state;

		this.setState(
			{
				active: !active
			}
		);

		this.props.onClick(event, active);
	}
}

ToggleButton.PROPS = {
	label: Config.required(),
	active: Config.value(false),
	onClick: Config.func().required(),
	inactiveLabel: {}
};

ToggleButton.STATE = {
	active: Config.value(false)
};

export default ToggleButton;