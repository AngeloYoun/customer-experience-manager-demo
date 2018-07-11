import JSXComponent, {Config} from 'metal-jsx';

export const ITEM_WIDTH = 32;
export const ITEM_HEIGHT = 24;

export const activityStatuses = {
	POSITIVE: 'positive',
	NEGATIVE: 'negative',
	NEUTRAL: 'neutral'
}

class ActivityPoint extends JSXComponent {
	render() {
		const {
			activityCount,
			children,
			status,
			x,
			y
		} = this.props;

		return (
			<div
				class="activity-point-container"
				style={x && y ? (
					{
						position: 'absolute',
						transform: `translate(${x}px, ${y}px)`
					}
				) : false}
				{...this.otherProps()}
			>
				<div class="hover-box">
					{children}

					{activityCount > 0 && (
						<div class="count">{activityCount}</div>
					)}

					<div class={`status ${status ? status : 'no-status'}`} />
				</div>
			</div>
		);
	}
}

ActivityPoint.PROPS = {
	activityCount: Config.number().value(0),
	status: Config.string(),
	x: Config.number(),
	y: Config.number()
};

ActivityPoint.SYNC_UPDATES = true;

export default ActivityPoint;