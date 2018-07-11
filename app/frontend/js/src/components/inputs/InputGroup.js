import JSXComponent, {Config} from 'metal-jsx';

class InputGroup extends JSXComponent {
	render() {
		const {
			children,
			label
		} = this.props;

		return (
			<div class="input-group-container input-group">
				<h4 class="input-label">
					{label}
				</h4>

				{children}
			</div>
		);
	}
}

InputGroup.PROPS = {
	label: Config.string().required()
};

export default InputGroup;