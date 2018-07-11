import {Map, List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';
import {area, bisector, curveStepAfter, line, scaleLinear} from 'd3';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as PROJECTS} from 'actions/projects';
import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as TOUCHPOINTS} from 'actions/touchpoints';
import {NAME as OPPORTUNITY_LINE_ITEMS} from 'actions/opportunity-line-items';
import {checkIfPropsChanged, formatCurrency, mapAvailableKeys} from 'lib/util';
import fieldMap, {fieldValue} from 'lib/field-formats';

const {
	[ACCOUNTS]: accountsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[OPPORTUNITY_LINE_ITEMS]: opportunityLineItemsFields
} = fieldMap;

const {
	OPPORTUNITY_STAGE
} = fieldValue

const TOOLTIP_BOTTOM_OFFSET = 72;

export const getTodaysARR = (lineItems, opportunities) =>{
	const closeWonLineItems = mapAvailableKeys(
		getLineItemKeys(
			getCloseWonOpportunities(opportunities)
		),
		lineItems
	);

	const today = Moment();

	return closeWonLineItems.reduce(
		(accum, lineItem) => {
			const endDate = lineItem.get(opportunityLineItemsFields.END_LOCAL_DATE);
			const startDate = lineItem.get(opportunityLineItemsFields.START_LOCAL_DATE);

			accum += today.isBetween(startDate, endDate) ? parseInt(lineItem.get(opportunityLineItemsFields.TOTAL_PRICE)) : 0

			return accum
		},
		0
	)
}

const getCloseWonOpportunities = opportunities => opportunities.filter(
	opportunity => opportunity.get(opportunitiesFields.STAGE) === OPPORTUNITY_STAGE.CLOSED_WON
);

const getLineItemKeys = opportunities => opportunities.reduce(
	(accum, entry) => accum.concat(
		entry.get(opportunitiesFields.OPPORTUNITY_LINE_ITEMS)
	),
	new List()
);

class ARRModel extends JSXComponent {
	render() {
		const {
			account,
			accountOpportunities,
			accountOpportunityLineItems,
			filteredAccountOpportunities,
			height,
			horzScale,
			width
		} = this.props;

		const {
			tooltipActive,
			tooltipAmount,
			tooltipPosition
		} = this.state;

		this.today = new Moment().valueOf();

		const accountARR = this._getARRHistory(
			accountOpportunityLineItems,
			accountOpportunities,
			horzScale
		);

		const ARRHeight = accountARR.highestValue > 0 ? height / 3 : 0

		const ARRScale = this._getArrScale(
			ARRHeight,
			accountARR.highestValue
		);

		const filteredARR = this._getARRHistory(
			accountOpportunityLineItems,
			filteredAccountOpportunities,
			horzScale
		);

		const accountARRValues = accountARR.values.toJS();
		const filteredARRValues = filteredARR.values.toJS();

		const tooltipX = horzScale(tooltipPosition.x);
		const tooltipY = ARRScale(tooltipPosition.y);

		const today = Moment();
		const lastDay = Moment(horzScale.domain()[1])

		const projectedDays = [
			{
				date: today.valueOf()
			},
			{
				date: lastDay.valueOf()
			}
		];

		return (
			<div
				class="arr-model-container"
				onMousemove={this._handleARRHover(filteredARRValues, horzScale, filteredARR.todaysValue)}
				onMouseenter={this._toggleTooltip(true)}
				onMouseleave={this._toggleTooltip(false)}
			>
				<div
					class={`todays-arr ${tooltipActive ? 'hide' : ''}`}
					style={{
						transform: `translate(${horzScale(Moment().valueOf())}px, ${TOOLTIP_BOTTOM_OFFSET}px)`
					}}
					key="todays-arr"
				>
					<h4 class="todays-arr-label">
						{`ARR for ${Moment().format('MMM DD, YYYY')}`}
					</h4>

					<h3 class="todays-arr-amount">
						{formatCurrency(filteredARR.todaysValue, account.get(accountsFields.CURRENCY_ISO_CODE))}
					</h3>
				</div>

				<svg
					class="arr-model-svg"
					key="arr-model-svg"
					width={`${width}px`}
					height={`${ARRHeight}px`}
				>
					<g class="account-arr">
						<path
							class="past-revenue line"
							d={this._getPastLinePath(
								ARRScale,
								accountARRValues,
								horzScale
							)}
						/>

						<path
							class="projected-revenue line"
							d={this._getProjectedLinePath(
								accountARR.todaysValue,
								ARRScale,
								accountARRValues,
								horzScale,
								projectedDays
							)}
						/>

						<path
							class="fill"
							d={this._getAreaPath(
								accountARR.todaysValue,
								ARRScale,
								accountARRValues,
								horzScale,
								projectedDays
							)}
						/>
					</g>

					{filteredAccountOpportunities.size && (
						<g class="filtered-arr">
							<path
								class="past-revenue line"
								d={this._getPastLinePath(
									ARRScale,
									filteredARRValues,
									horzScale
								)}
							/>

							<path
								class="projected-revenue line"
								d={this._getProjectedLinePath(
									filteredARR.todaysValue,
									ARRScale,
									filteredARRValues,
									horzScale,
									projectedDays
								)}
							/>

							<path
								class="fill"
								d={this._getAreaPath(
									filteredARR.todaysValue,
									ARRScale,
									filteredARRValues,
									horzScale,
									projectedDays
								)}
							/>
						</g>
					)}
				</svg>

				{tooltipActive && (
					<div
						class="arr-tooltip"
						style={{
							height: `${100 + TOOLTIP_BOTTOM_OFFSET}%`,
							transform: `translate(${tooltipX}px, ${TOOLTIP_BOTTOM_OFFSET}px)`
						}}
						key="arr-tooltip"
					>
						<div
							class="arr-marker"
							style={{
								transform: `translate(0, -${TOOLTIP_BOTTOM_OFFSET + (ARRHeight - tooltipY)}px)`
							}}
						/>

						<div class="label">
							<h5 class="tooltip-label">{`ARR for ${Moment(horzScale.invert(tooltipX)).format('MMM DD, YYYY')}`}</h5>

							<h4 class="arr-amount">{formatCurrency(tooltipAmount, account.get(accountsFields.CURRENCY_ISO_CODE))}</h4>
						</div>
					</div>
				)}
			</div>
		);
	}

	_handleARRHover = (data, horzScale, todaysValue) => event => {
		const date = horzScale.invert(event.clientX - this.element.getBoundingClientRect().left);

		const index = bisector(entry => entry.date).right(data, date);

		let amount = index < 1 || index > data.length - 1 ? 0 : data[index - 1].amount;

		amount = Moment().isAfter(date, 'day') ? amount : todaysValue;

		this.setState({
			tooltipAmount: amount,
			tooltipPosition: {
				x: date,
				y: amount
			}
		})
	}

	_toggleTooltip = active => () => {
		this.setState(
			{
				tooltipActive: active
			}
		)
	}

	_getArrScale = (height, highestRevenue) => {
		return scaleLinear().range(
			[0, height]
		).domain(
			[highestRevenue, 0]
		)
	}

	_getAreaPath = (todaysValue, arrScale, data, horzScale, projectedDays) => {
		const today = Moment();

		return area().x(
			entry => horzScale(entry.date)
		).y1(
			entry => today.isAfter(entry.date, 'day') ? arrScale(entry.amount || 0) : arrScale(todaysValue)
		).y0(
			arrScale(0)
		).curve(
			curveStepAfter
		)(
			data.filter(
				entry => today.isAfter(entry.date, 'day')
			).concat(projectedDays)
		);
	};

	_getPastLinePath = (arrScale, data, horzScale) => {
		const today = new Moment().valueOf();

		return line().x(
			entry => horzScale(entry.date <= today ? entry.date : today)
		).y(
			entry => arrScale(entry.date <= today ? entry.amount : null)
		).curve(
			curveStepAfter
		)(data);
	};

	_getProjectedLinePath = (todaysValue, arrScale, data, horzScale, projectedDays) => {
		return line().x(
			entry => horzScale(entry.date)
		).y(
			entry => arrScale(todaysValue)
		).curve(
			curveStepAfter
		)(projectedDays);
	};

	_getARRHistory = (lineItems, opportunities, horzScale) => {
		const closeWonLineItems = getCloseWonOpportunities(opportunities).reduce(
			(accum, opportunity) => accum.concat(opportunity.get(opportunitiesFields.OPPORTUNITY_LINE_ITEMS)),
			List()
		)

		const arrChanges = closeWonLineItems.reduce(
			(accum, lineItem) => {
				const total = lineItem.get(opportunityLineItemsFields.TOTAL_PRICE);
				const term = lineItem.get(opportunityLineItemsFields.TERM);
				const start = lineItem.get(opportunityLineItemsFields.START_LOCAL_DATE);
				const end = lineItem.get(opportunityLineItemsFields.END_LOCAL_DATE);

				const arr = total / term;

				return lineItem.get(opportunityLineItemsFields.TERM_TYPE) === 'Annual' ? accum.concat(
					{
						date: Moment(start).startOf('day').valueOf(),
						change: arr
					},
					{
						date: Moment(end).endOf('day').valueOf(),
						change: -arr
					}
				) : accum;
			},
			new List()
		)

		const sortedArrChanges = arrChanges.sortBy(arrChange => arrChange.date);

		const [domainMin, domainMax] = horzScale.domain();

		return sortedArrChanges.reduce(
			({latestValue, todaysValue, highestValue, values}, {change, date}) => {
				const amount = latestValue + change;

				return {
					latestValue: amount,
					todaysValue: date <= this.today ? amount : todaysValue,
					highestValue: amount > highestValue ? amount : highestValue,
					values: values.push(
						Map(
							{
								date,
								amount: amount > 0 ? amount : 0
							}
						)
					)
				}
			},
			{
				latestValue: 0,
				todaysValue: 0,
				highestValue: 0,
				values: new List(
					[
						{
							date: domainMin,
							amount: 0
						}
					]
				)
			}
		);
	}
}

ARRModel.PROPS = {
	accountOpportunities: Config.instanceOf(List).required(),
	filteredAccountOpportunities: Config.instanceOf(List).required(),
	height: Config.number().required(),
	horzScale: Config.func().required(),
	accountOpportunityLineItems: Config.instanceOf(List).required(),
	width: Config.number().required()
};

ARRModel.STATE = {
	tooltipActive: Config.bool().value(false),
	tooltipAmount: Config.number().value(0),
	tooltipPosition: Config.object().value({})
};

ARRModel.SYNC_UPDATE = true;

export default ARRModel;