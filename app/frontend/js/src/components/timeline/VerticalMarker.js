import JSXComponent, {Config} from 'metal-jsx';

class VerticalMarker extends JSXComponent {
	render() {
		const {
			height,
			id,
			label,
			offsetHeight,
			timelineHeight,
			value
		} = this.props;

		return (
			<div
				class="vertical-marker-container"
				key={id}
			>
				<div
					class="hit-box"
					style={{height: `${timelineHeight}px`}}
				>
					<div
						class="marker-container"
						style={{height: `${height}px`}}
					>
						<div
							class="marker"
							style={{height: `${height - offsetHeight}px`}}
						>
							<div class="vertical-guide" />

							<h3 class="value">
								{value}
							</h3>

							<h4 class="label">
								{label}
							</h4>

							<div class="selected-marker" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

VerticalMarker.PROPS = {
	id: Config.string().required(),
	label: Config.string().value(''),
	offsetHeight: Config.number().required(),
	value: Config.string().required()
};

export default VerticalMarker;