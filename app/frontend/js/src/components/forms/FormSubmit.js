import JSXComponent, {Config} from 'metal-jsx';

import ActionButton from 'components/buttons/ActionButton';

class FormSubmit extends JSXComponent {
	render() {
		const {
			label
		} = this.props;

		return (
			<ActionButton
				buttonLabel={label}
				class="form-submit-container"
				onClick={this._handleOnClick}
				type="submit"
				{...this.otherProps()}
			/>
		);
	}

	_handleOnClick = event => {
		event.preventDefault();

		this.props.onClick(event);
	}
}

FormSubmit.PROPS = {
	label: Config.required(),
	onClick: Config.func().required()
};

export default FormSubmit;