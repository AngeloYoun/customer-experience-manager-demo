import {is, List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';
import {area, curveStepAfter, interpolate, scaleTime, scaleLinear, timer, timeYear, timeDay, timeFormat, timeMonth} from 'd3';

import Axis from 'components/axis/Axis';

const MAX_ZOOM_LEVEL = 80;
const MOUSE_LEFT_CLICK_KEY = 1;
const TIMELINE_BOTTOM_MARGIN = 88;
const ZOOM_TRANSITION_TIME = 1000;

const easeInOutTiming = (t, b, c, d) => {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
}

const scaleConfig = {
	fourYears: List(
		[
			{
				className: 'major-tick',
				key: 'year',
				labelFormat: timeFormat('%Y'),
				scalePosition: timeYear.every(1),
				tickLength: [32, -16],
				textOffset:[8, 32]
			}
		]
	),
	twoYears: List(
		[
			{
				className: 'major-tick',
				key: 'year',
				labelFormat: timeFormat('%Y'),
				scalePosition: timeYear.every(1),
				tickLength: [32, -16],
				textOffset:[8, 32]
			},
			{
				className: 'minor-tick',
				key: 'quarter',
				labelFormat: date => Moment(date).format('[Q]Q'),
				scalePosition: timeMonth.every(3),
				textOffset:[8, 16],
				tickLength: [0, -16]
			}
		]
	),
	oneYear: List(
		[
			{
				className: 'major-tick',
				key: 'year-quarter',
				labelFormat: date => Moment(date).format('YYYY [Q]Q'),
				scalePosition: timeMonth.every(3),
				tickLength: [32, -16],
				textOffset:[8, 32]
			},
			{
				className: 'minor-tick',
				key: 'month',
				labelFormat: timeFormat('%b'),
				scalePosition: timeMonth.every(1),
				textOffset:[8, 16],
				tickLength: [0, -16]
			}
		]
	),
	twoMonths: List(
		[
			{
				className: 'major-tick',
				key: 'year-quarter',
				labelFormat: date => Moment(date).format('YYYY [Q]Q'),
				scalePosition: timeMonth.every(3),
				tickLength: [32, -16],
				textOffset:[8, 32]
			},
			{
				className: 'date-tick',
				key: 'date',
				scalePosition: timeDay.every(1),
				tickLength: [0, -8]
			},
			{
				className: 'minor-tick',
				key: 'month',
				labelFormat: timeFormat('%b'),
				scalePosition: timeMonth.every(1),
				textOffset:[8, 16],
				tickLength: [0, -16]
			}
		]
	),
	oneMonth: List(
		[
			{
				className: 'date-tick',
				key: 'date',
				labelFormat: date => Moment(date).format('D'),
				scalePosition: timeDay.every(1),
				textOffset:[8, 16],
				tickLength: [0, -8]
			},
			{
				className: 'major-tick',
				key: 'year-month',
				labelFormat: date => Moment(date).format('MMM YYYY'),
				scalePosition: timeMonth.every(1),
				tickLength: [32, -16],
				textOffset:[8, 32]
			}
		]
	)
}

class Timeline extends JSXComponent {
	render() {
		const {
			endDate,
			itemRenderers,
			items,
			startDate,
			itemHeight,
			itemWidth
		} = this.props;

		const {
			panPosition,
			translatePosition,
			zoomLevel
		} = this.state;

		const element = this.element;

		const height = element ? element.clientHeight - TIMELINE_BOTTOM_MARGIN : 0;
		const width = element ? element.clientWidth * zoomLevel : 0;

		const horzScale = scaleTime().range(
			[0, width]
		).domain(
			[Moment(startDate).valueOf(), Moment(endDate).valueOf()]
		);

		const currentViewStartDate = horzScale.invert(translatePosition);
		const currentViewEndDate = horzScale.invert(translatePosition + (element ? element.clientWidth : 0));

		const absoluteHorzScale = scaleTime().range(
			[0,  element ? element.clientWidth : 0]
		).domain(
			[Moment(currentViewStartDate).valueOf(), Moment(currentViewEndDate).valueOf()]
		);

		this._horzScale = horzScale;

		this._lastFrameWidth = element ? element.clientWidth : 0;

		const tickConfigs = this._getScaleByDuration(
			Moment.duration(
				Moment(currentViewEndDate).diff(currentViewStartDate)
			)
		);

		return (
			<div
				class={`timeline-container ${zoomLevel > 1 ? 'pan-enabled' : ''}`}
				onWheel={this._handleScroll}
				onClick={this._handleOnClick}
				onMousemove={this._handlePan}
			>
				{element && (
					<div
						class="items"
						key="items"
						style={{
							height: `${height}px`,
							width: `${element.clientWidth}px`,
							position: 'absolute',
							top: '0'
						}}
					>
						{items.map(
							(data, key) => itemRenderers.get(key)(
								{
									height,
									horzScale: absoluteHorzScale,
									clientWidth: element.clientWidth,
									width,
									centerTimelineTo: this._centerTimelineTo,
									setViewTo: this._setViewTo,
									...data.toObject()
								}
							)
						)}
					</div>
				) && (
					<svg
						class="timeline-svg"
						key="timeline-svg"
						style={{transform: `translate(0, ${height}px)`}}
						width={`${element.clientWidth}px`}
					>
						<Axis
							axisLength={element.clientWidth}
							key="axis"
							elementClasses='axis'
							scale={absoluteHorzScale}
							tickConfigs={tickConfigs}
						/>
					</svg>
				) && (
					<div
						class="today-marker"
						key="today-marker"
						style={{
							height: `${height}px`,
							position: 'absolute',
							transform: `translate(${absoluteHorzScale(Moment())}px, 0px)`
						}}
					>
						<h4 class="today-label">
							{Liferay.Language.get('today')}
						</h4>
					</div>
				)}
			</div>
		);
	}

	rendered(first) {
		if (first) {
			this.state.first = true;
			this.panPosition = 0;
		}
		else if (this._lastFrameWidth !== this.element.clientWidth) {
			this.state.first = !this.state.first;
		}
	}

	syncResetTimelineView(value) {
		if (value) {
			this._resetTimelineView();
		}
	}

	_centerTimelineTo = date => {
		this.setState(
			{
				translatePosition: this._getTranslatePositionTo(
					this._horzScale(Moment(date).valueOf()) - 0.5 * this.element.clientWidth
				)
			}
		)
	};

	_setViewTo = (viewStartDate, viewEndDate) => {
		const {
			startDate,
			endDate
		} = this.props;

		const {
			translatePosition: prevTranslatePosition,
			zoomLevel: prevZoomLevel
		} = this.state;

		if (viewStartDate && viewEndDate) {
			const totalDuration = Moment.duration(
				Moment(endDate).diff(startDate)
			);

			let viewDuration = Moment.duration(
				Moment(viewEndDate).diff(viewStartDate)
			);

			const viewDurationMilliseconds = viewDuration.asMilliseconds();

			viewDuration = viewDurationMilliseconds < 1 ? Moment.duration(Math.abs(viewDurationMilliseconds)) : viewDuration;

			const zoomLevelBase = Math.min(
				MAX_ZOOM_LEVEL,
				totalDuration.asMilliseconds() / viewDuration.asMilliseconds()
			)

			const zoomLevel = zoomLevelBase - zoomLevelBase * 0.25;

			const clientWidth = this.element.clientWidth;

			const horzScale = scaleTime().range(
				[0, clientWidth * zoomLevel]
			).domain(
				[Moment(startDate).valueOf(), Moment(endDate).valueOf()]
			);

			this._prevTranslatePosition = prevTranslatePosition;
			this._prevZoomLevel = prevZoomLevel

			this.setState(
				{
					translatePosition: this._getTranslatePositionTo(
						horzScale(
							Moment(viewStartDate).valueOf() + viewDuration.asMilliseconds() / 2
						) - 0.5 * clientWidth,
						zoomLevel
					),
					zoomLevel
				}
			);
		}
		else {
			this._resetTimelineView();
		}
	}

	_resetTimelineView = () => {
		this.setState(
			{
				translatePosition: this._prevTranslatePosition || 0,
				zoomLevel: this._prevZoomLevel || 1
			}
		);
	}

	_getAbsoluteTimelineWidth = zoomLevel => zoomLevel * this.element.clientWidth;

	_getScaleByDuration = duration => {
		let scale = 'fourYears';

		if (duration.asYears() <= 2) {
			scale = 'twoYears';
		}
		if (duration.asYears() <= 1) {
			scale = 'oneYear';
		}
		if (duration.asYears() <= 2 / 12) {
			scale = 'twoMonths';
		}
		if (duration.asYears() <= 1.5 / 12) {
			scale = 'oneMonth';
		}

		return scaleConfig[scale]
	};

	_handlePan = event => {
		if (event.buttons === MOUSE_LEFT_CLICK_KEY) {
			event.preventDefault();

			const offsetX =  event.clientX - this.element.getBoundingClientRect().left;

			if (!this.panStartPosition) {
				this.panStartPosition = offsetX;
				this.lastPanOffset = 0;
			}

			const currentPanOffset = this.panStartPosition - offsetX;

			const translatePosition = this._getTranslatePositionBy(currentPanOffset - this.lastPanOffset);

			this.lastPanOffset = currentPanOffset;

			this.setState(
				{
					translatePosition
				}
			);

			clearTimeout(this.panTimeout);

			this._panning = true;
			this.element.classList.add('panning');

			this.panTimeout = setTimeout(
				() => {
					this.element.classList.remove('panning');
					this._panning = false;
				},
				250
			)
		}
		else if (!!this.panStartPosition) {
			this.panStartPosition = null;
		}
	}

	_handleOnClick = event => {
		if (!this._panning) {
			this.setState(
				{
					translatePosition: this._getCenterTranslatePosition(event.clientX - this.element.getBoundingClientRect().left)
				}
			);
		}
	}

	_getCenterTranslatePosition = translatePosition => this._getTranslatePositionTo(this.state.translatePosition + translatePosition - 0.5 * this.element.clientWidth);

	_getTranslatePositionBy = value => this._getTranslatePositionTo(this.state.translatePosition + value);

	_getTranslatePositionTo = (translatePosition, zoomLevel) => {
		const {
			zoomLevel: internalZoomLevel
		} = this.state;

		zoomLevel = zoomLevel || internalZoomLevel;

		const visibleWidth = this.element.clientWidth;

		return Math.max(
			0,
			Math.min(
				(zoomLevel * visibleWidth) - visibleWidth,
				translatePosition
			)
		);
	}

	_handleScroll = event => {
		event.preventDefault();

		const {
			translatePosition,
			zoomLevel
		} = this.state;

		const newZoomLevel = Math.max(
			1,
			Math.min(
				MAX_ZOOM_LEVEL,
				zoomLevel + event.wheelDelta / 1000
			)
		);

		let newTranslatePosition = translatePosition;

		if (newZoomLevel !== zoomLevel) {
			const cursorXOffsetAbsolute = translatePosition + window.event.clientX;

			const cursorRelativePosition = cursorXOffsetAbsolute / this._getAbsoluteTimelineWidth(zoomLevel);

			newTranslatePosition = this._getTranslatePositionTo(cursorRelativePosition * this._getAbsoluteTimelineWidth(newZoomLevel) - window.event.clientX, newZoomLevel);
		}

		clearTimeout(this.zoomTimeout);

		this.setState(
			{
				translatePosition: newTranslatePosition,
				zoomLevel: newZoomLevel
			}
		);

		this.element.classList.add('zooming');

		this._zooming = true;

		this.zoomTimeout = setTimeout(
			() => {
				this.element.classList.remove('zooming')
				this._zooming = false;
			},
			500
		)
	}
}

Timeline.SYNC_UPDATES = true;

Timeline.PROPS = {
	itemRenderers: Config.instanceOf(Map).required(),
	items: Config.instanceOf(Map).required(),
	startDate: Config.string().required(),
	resetTimelineView: Config.bool().value(false),
	endDate: Config.string().required()
};

Timeline.STATE = {
	first: Config.bool().value(false),
	zoomLevel: Config.number().value(1),
	panPosition: Config.number().value(0),
	translatePosition: Config.number().value(0)
}

export default Timeline;