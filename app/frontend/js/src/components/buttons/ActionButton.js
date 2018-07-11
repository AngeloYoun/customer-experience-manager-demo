import JSXComponent, {Config} from 'metal-jsx';

import Button from 'components/buttons/Button';

class ActionButton extends JSXComponent {
	render() {
		const {
			buttonLabel,
			disabled,
			elementClasses
		} = this.props;

		return (
			<Button
				elementClasses={`action-button-container ${elementClasses} ${disabled ? 'disabled' : ''}`}
				disabled={disabled}
				{...this.otherProps()}
			>
				<h3 class="label">{buttonLabel}</h3>
			</Button>
		);
	}
}

ActionButton.PROPS = {
	buttonLabel: Config.required(),
	disabled: Config.bool().value(false)
};

export default ActionButton;