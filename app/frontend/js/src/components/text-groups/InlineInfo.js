import JSXComponent, {Config} from 'metal-jsx';

class InlineInfo extends JSXComponent {
	render() {
		const {
			label,
			value
		} = this.props;

		return (
			<h4 class="inline-info-container">
				<span class="inline-label">{`${label}: `}</span>

				{value}
			</h4>
		);
	}
}

InlineInfo.PROPS = {
	label: Config.string(),
	value: Config.string()
};

export default InlineInfo;