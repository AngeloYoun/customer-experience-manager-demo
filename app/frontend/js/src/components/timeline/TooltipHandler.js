import {is, List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import Tooltip from 'components/timeline/Tooltip';

class TooltipHandler extends JSXComponent {
	attached() {
		this._bindTooltip();
	}

	render() {
		const {
			children,
			tooltipSize
		} = this.props;

		const {
			showTooltip,
			tooltipPos
		} = this.state;

		return (
			<div
				class="tooltip-handler-container"
				key="tooltip-handler"
			>
				{showTooltip ?
					<Tooltip
						position={tooltipPos}
						tooltipSize={tooltipSize}
					>
						{children}
					</Tooltip> :
					''
				}
			</div>
		);
	}

	syncTargetElements(newProp, oldProp) {
		if (!is(newProp, oldProp)) {
			this._bindTooltip();
		}
	}

	_bindTooltip = () => {
		this.props.bindTooltip(
			{
				hideCallback: event => {
					window.clearTimeout(this.state.hideTimeout);

					this.setState(
						{
							hideTimeout: window.setTimeout(
								() => {
									this.state.showTooltip = false;
								},
								300
							)
						}
					);
				},
				moveCallback: event => {
					this.setState(
						{
							showTooltip: true,
							tooltipPos: Object.assign(
								{},
								this.state.tooltipPos,
								this._updateTooltipPos(event.clientX, event.clientY)
							)
						}
					);

					window.clearTimeout(this.state.hideTimeout);
				},
				showCallback: (event, tooltipContent) => {
					this.setState(
						{
							showTooltip: true,
							tooltipContent,
							tooltipPos: Object.assign(
								{},
								this.state.tooltipPos,
								this._calculateTooltipPos(event.target.getBoundingClientRect())
							)
						}
					);

					window.clearTimeout(this.state.hideTimeout);
				}
			}
		);
	}

	_calculateTooltipPos = boundingRect => {
		const {
			tooltipSize,
			xPosRelativeToCursor,
			yPosRelativeToCursor
		} = this.props;

		const position = {};

		if (!xPosRelativeToCursor) {
			let xPos = boundingRect.right;

			let left = false;

			const rightEdge = this.element.getBoundingClientRect().right;

			if ((rightEdge - xPos - tooltipSize.width - tooltipSize.marginHorz) < 0) {
				xPos = boundingRect.left;

				left = true;
			}

			position.x = xPos;
			position.left = left;
		}

		if (!yPosRelativeToCursor) {
			position.y = boundingRect.top;
		}

		return position;
	}

	_updateTooltipPos = (clientX, clientY) => {
		const {
			tooltipSize,
			xPosRelativeToCursor,
			yPosRelativeToCursor
		} = this.props;

		const position = {};

		if (xPosRelativeToCursor) {
			let left = false;

			const rightEdge = this.element.getBoundingClientRect().right;

			if ((rightEdge - clientX - tooltipSize.width) < 0) {
				left = true;
			}

			position.x = clientX;
			position.left = left;
		}

		if (yPosRelativeToCursor) {
			position.y = clientY;
		}

		return position;
	}
}

TooltipHandler.PROPS = {
	bindTooltip: Config.func(),
	targetElements: Config.instanceOf(List),
	tooltipSize: Config.object(),
	xPosRelativeToCursor: Config.value(false),
	yPosRelativeToCursor: Config.value(false)
};

TooltipHandler.STATE = {
	hideTimeout: Config.number(),
	showTooltip: Config.value(false),
	tooltipContent: Config.func(),
	tooltipPos: Config.object().value({})
};

export default TooltipHandler;