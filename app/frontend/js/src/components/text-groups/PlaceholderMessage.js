import JSXComponent, {Config} from 'metal-jsx';

class PlaceholderMessage extends JSXComponent {
	render() {
		const {
			children,
			message
		} = this.props;

		return (
			<div class="placeholder-message-container">
				{message && (
					<h2 class="placeholder-message">{message}</h2>
				)}

				{children}
			</div>
		);
	}
}

PlaceholderMessage.PROPS = {
	message: Config.string()
};

export default PlaceholderMessage;