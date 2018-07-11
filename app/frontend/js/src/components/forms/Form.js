import JSXComponent from 'metal-jsx';

class Form extends JSXComponent {
	render() {
		const {
			children
		} = this.props;

		return (
			<form
				class="form-container"
				{...this.otherProps()}
			>
				{children}
			</form>
		);
	}
}

export default Form;