import JSXComponent, {Config} from 'metal-jsx';

class TextArea extends JSXComponent {
	render() {
		const {
			initialValue,
			invalid,
			placeholder,
			value
		} = this.props;

		return (
			<textarea
				class={`text-area-container ${invalid ? 'invalid' : ''}`}
				onInput={this._handleOnChange}
				placeholder={placeholder}
				value={value || initialValue || ''}
				{...this.otherProps()}
			/>
		);
	}

	_handleOnChange = ({target: {value}}) => {
		const {data, onChange} = this.props;

		onChange(value, data);
	};
}

TextArea.PROPS = {
	initialValue: Config.string(),
	invalid: Config.bool().value(false),
	onChange: Config.func().value(f => f),
	placeholder: Config.string(),
	value: Config.string()
};

export default TextArea;