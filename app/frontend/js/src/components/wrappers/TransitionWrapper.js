import JSXComponent, {Config} from 'metal-jsx';

class TransitionWrapper extends JSXComponent {
	attached() {
		const {
			duration
		} = this.props;

		this.setState(
			{
				timeout: window.setTimeout(
					() => this.setState(
						{
							addClass: false
						}
					),
					duration
				)
			}
		);
	}

	detached() {
		window.clearTimeout(this.state.timeout);
	}

	render() {
		const {
			children
		} = this.props;

		const {
			addClass
		} = this.state;

		return (
			<div class={`transition-wrapper-container ${addClass ? 'transition-in' : ''}`}>
				{children}
			</div>
		);
	}
}

TransitionWrapper.PROPS = {
	children: Config.array().required(),
	duration: Config.number().required()
};

TransitionWrapper.STATE = {
	addClass: Config.bool().value(true),
	timeout: Config.number()
};

TransitionWrapper.SYNC_UPDATES = true;

export default TransitionWrapper;