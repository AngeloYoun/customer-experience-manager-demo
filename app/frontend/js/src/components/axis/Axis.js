import {is, List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {unionBy} from 'lodash';
import * as D3 from 'd3';
import Moment from 'moment';


export const MAJOR_AXIS_CLASS = 'major';
export const MINOR_AXIS_CLASS = 'minor';

export const MAJOR_TICK_LABEL_HORIZONTAL_POSITION = 5;
export const MAJOR_TICK_LABEL_VERTICAL_POSITION = 25;
export const MAJOR_TICK_LABEL_VERTICAL_OFFSET = "0.71em";

export const MINOR_TICK_LABEL_HORIZONTAL_POSITION = 5;
export const MINOR_TICK_LABEL_VERTICAL_POSITION = -27;
export const MINOR_TICK_LABEL_VERTICAL_OFFSET = "0.71em";

class Axis extends JSXComponent {
    render() {
        const {
            axisLength,
            scale,
            tickConfigs
		} = this.props;

		const prevTicks = this._prevTicks || {};

		const newTicks = {};

		const ticks = tickConfigs.reduce(
			(accum, {className, labelFormat, key, scalePosition, tickLength, textOffset}) => {
				return unionBy(
					accum,
					scale.ticks(scalePosition).map(
						tick => {
							const newTick = !prevTicks[key];

							newTicks[key] = true;

							return {
								date: tick,
								key,
								newTick,
								labelFormat: labelFormat,
								lengthStart: tickLength[0],
								lengthEnd: tickLength[1],
								className,
								textOffset
							}
						}
					),
					'date'
				)
			},
			[]
		);

		this._prevTicks = newTicks;

        return (
            <g
				ref="axis"
				class={`axis-container ${newTicks ? 'new-ticks' : ''}`}
				key="axis-container"
			>
                <path
					class="domain"
					key="domain"
					stroke="#000"
					d={`M0.5,0V0.5H${axisLength}V0`}
				/>

                {ticks.map(
					({className, date, key, newTick, labelFormat, lengthStart, lengthEnd, textOffset}) => {
						const dateJS = new Date(date);

						return (
							<g
								class={`tick ${newTick ? 'new-tick' : ''} ${className}`}
								opacity="1"
								transform={`translate(${scale(dateJS)}, 0)`}
								key={`${dateJS.valueOf()}-${key}`}
							>
								<line stroke="#000" y1={lengthStart} y2={lengthEnd} />

								{labelFormat && (
									<text fill="#000" x={textOffset[0]} y={textOffset[1]}>
										{labelFormat(dateJS)}
									</text>
								)}
							</g>
						);
					}
				)}
            </g>
        )
	}
}

Axis.PROPS = {
	axisLength: Config.number().required(),
	scale: Config.func().required(),
	tickConfigs: Config.instanceOf(List).required()
}

export default Axis;