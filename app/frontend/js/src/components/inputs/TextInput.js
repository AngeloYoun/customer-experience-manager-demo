import JSXComponent, {Config} from 'metal-jsx';

class TextInput extends JSXComponent {
	render() {
		const {
			autofocus,
			initialValue,
			invalid,
			label,
			placeholder,
			value
		} = this.props;

		return (
			<div class={`text-input-container ${invalid ? 'invalid' : ''}`}>
				{label &&
					<label class="input-label">
						{label}
					</label>
				}

				<input
					autofocus={autofocus}
					class="text-input"
					onInput={this._handleOnChange}
					placeholder={placeholder}
					value={value || initialValue || ''}
					{...this.otherProps()}
				/>
			</div>
		);
	}

	_handleOnChange = ({target: {value}}) => {
		const {data, onChange} = this.props;

		onChange(value, data);
	};
}

TextInput.PROPS = {
	autofocus: Config.value(false),
	initialValue: Config.string(),
	invalid: Config.bool().value(false),
	label: Config.string(),
	onChange: Config.func().value(f => f),
	placeholder: Config.string(),
	value: Config.string()
};

export default TextInput;