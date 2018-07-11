import JSXComponent, {Config} from 'metal-jsx';

class TimelineMarker extends JSXComponent {
	render() {
		const {
			children,
			height,
			xPosition
		} = this.props;

		return (
			<div
				class="timeline-marker-container"
				style={{
					height: `${height}px`,
					transform: `translateX(${xPosition}px)`,
				}}
			>
				<div class="marker-label">
					{children}
				</div>
			</div>
		)
	}
}

TimelineMarker.PROPS = {
	height: Config.number().required(),
	xPosition: Config.number().required()
}

export default TimelineMarker;