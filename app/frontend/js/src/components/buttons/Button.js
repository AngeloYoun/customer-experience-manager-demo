import JSXComponent, {Config} from 'metal-jsx';

class Button extends JSXComponent {
	render() {
		const {
			children,
			type = 'button'
		} = this.props;

		return (
			<button
				class="button-container"
				type={type}
				{...this.otherProps()}
			>
				{children}
			</button>
		);
	}
}

Button.PROPS = {
	children: Config.array(),
	type: Config.string()
};

export default Button;