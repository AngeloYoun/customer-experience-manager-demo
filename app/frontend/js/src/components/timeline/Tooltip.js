import JSXComponent, {Config} from 'metal-jsx';

class Tooltip extends JSXComponent {
	render() {
		const {
			children,
			position,
			tooltipSize
		} = this.props;

		let posClassName = '';

		let posX = +position.x;

		if (position.left) {
			posClassName = 'left';

			posX -= tooltipSize.marginHorz;
			posX -= tooltipSize.width;
		}
		else {
			posX += tooltipSize.marginHorz;
		}

		return (
			<div
				class={`tooltip-container ${posClassName}`}
				key="tooltip"
				style={{
					transform: `translate(${posX}px, ${position.y - tooltipSize.marginVert}px)`
				}}
			>
				{children}
			</div>
		);
	}
}

Tooltip.PROPS = {
	children: Config.array(),
	position: Config.object(),
	tooltipSize: Config.object()
};

Tooltip.STATE = {
	content: Config.value(Liferay.Language.get('no-data'))
};

Tooltip.SYNC_UPDATES = true;

export default Tooltip;