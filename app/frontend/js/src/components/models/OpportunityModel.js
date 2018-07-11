import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {formatCurrency} from 'lib/util';
import OpportunityPoint from 'components/timeline/OpportunityPoint';
import InlineInfo from 'components/text-groups/InlineInfo';
import ActivityPoint, {activityStatuses} from 'components/models/ActivityPoint';

const {
	[OPPORTUNITIES]: opportunitiesFields
} = fieldMap;

const {
	OPPORTUNITY_STAGE
} = fieldValue;

export const opportunityClosedStatusMap = {
	[OPPORTUNITY_STAGE.CLOSED_WON]: activityStatuses.POSITIVE,
	[OPPORTUNITY_STAGE.CLOSED_LOST]: activityStatuses.NEGATIVE,
	[OPPORTUNITY_STAGE.ROLLED_INTO_OPPORTUNITY]: activityStatuses.POSITIVE
};

export const isOpportunityOpen = opportunity => getOpportunityStatus(opportunity.get(opportunitiesFields.STAGE)) === activityStatuses.NEUTRAL;

export const getOpportunityStatus = stage => opportunityClosedStatusMap[stage] ? opportunityClosedStatusMap[stage] : activityStatuses.NEUTRAL;

class OpportunityModel extends JSXComponent {
	render() {
		const {
			addIndicator,
			addMarker,
			getScaleTimeValue,
			opportunity,
			handleActivityMouseEnter,
			handleActivityMouseLeave,
			handleSelectActivity,
			related,
			selected,
			x,
			y
		} = this.props;

		const stage = opportunity.get(opportunitiesFields.STAGE);
		const status = getOpportunityStatus(stage);
		const id = opportunity.get(opportunitiesFields.ID)

		const closedWon = status === activityStatuses.POSITIVE;

		if (selected || related) {
			const subscriptionStart = opportunity.get(opportunitiesFields.SUBSCRIPTION_START_DATE);
			const subscriptionEnd = opportunity.get(opportunitiesFields.SUBSCRIPTION_END_DATE);

			const x0 = getScaleTimeValue(subscriptionStart);
			const x1 = getScaleTimeValue(subscriptionEnd);

			const subscriptionIndicatorHeight = 13;

			addIndicator(
				<svg
					class={`subscription-term ${selected ? 'active' : ''} ${status}`}
					key={`term-${id}`}
					height={subscriptionIndicatorHeight}
					width={x1 - x0}
					style={{transform: `translate(${x0}px, ${y + 4}px)`}}
				>
					<rect x="1" y="1" width={x1 - x0 - 2} height={subscriptionIndicatorHeight - 2} />
				</svg>
			)
		}

		const closeDate = opportunity.get(opportunitiesFields.CLOSE_DATE);

		if (selected) {
			const createdDate = opportunity.get(opportunitiesFields.CREATED_DATE);
			const createdDateX = getScaleTimeValue(createdDate);

			addMarker(
				{
					x: createdDateX,
					content: (
						<h4 class="marker-label-text-primary">{'Opportunity Created'}</h4>
					)
				}
			);

			const subscriptionStartX = getScaleTimeValue(opportunity.get(opportunitiesFields.SUBSCRIPTION_START_DATE));

			addMarker(
				{
					x: subscriptionStartX,
					content: (
						<div>
							<h4 class="marker-label-text-primary">
								{'Subscription Start'}
							</h4>
						</div>
					)
				}
			);

			const subscriptionEndX = getScaleTimeValue(opportunity.get(opportunitiesFields.SUBSCRIPTION_END_DATE));

			addMarker(
				{
					x: subscriptionEndX,
					content: (
						<div>
							<h4 class="marker-label-text-primary">
								{'Subscription End'}
							</h4>
						</div>
					)
				}
			);
			
			if (opportunity.get(opportunitiesFields.STAGE_HISTORY)) {
				opportunity.get(opportunitiesFields.STAGE_HISTORY).map(
					(stageChange, index) => {
						const stageChangeX = getScaleTimeValue(stageChange.get(opportunitiesFields.CLOSE_DATE));

						const stage = stageChange.get(opportunitiesFields.STAGE)

						addMarker(
							{
								x: stageChangeX,
								content: (
									<h5 class={`stage-label ${getOpportunityStatus(stage)}`}>
										{stage}
									</h5>
								)
							}
						);
					}
				)
			}

			const closeDateX = getScaleTimeValue(opportunity.get(opportunitiesFields.CLOSE_DATE));

			const today = Moment();
			const todayX = getScaleTimeValue(today);

			const relativeCloseDateX = closedWon ? closeDateX - createdDateX : closeDateX - todayX;

			addIndicator(
				<svg
					class="open-duration"
					height="1"
					style={{transform: `translate(${closedWon ? createdDateX : todayX}px, 160px)`}}
				>
					<text
						class="label"
						x={relativeCloseDateX - 4}
						y="-4"
					>
						{closedWon ? `Closed in ${Moment(closeDate).to(createdDate, true)}` : `Closing in ${today.to(closeDate, true)}`}
					</text>

					<line
						class="guide"
						x1="0%"
						y1="1"
						x2={relativeCloseDateX}
						y2="1"
					/>
				</svg>
			)
		}

		const type = opportunity.get(opportunitiesFields.TYPE);

		const critical = (status === activityStatuses.NEUTRAL) && (Moment(closeDate).diff(Moment(), 'days') < 40);

		return (
			<ActivityPoint
				key={`activity-${id}`}
				elementClasses={`${selected ? 'selected' : ''} ${critical ? 'critical' : ''}`}
				status={status}
				x={x}
				y={y}
				onClick={handleSelectActivity(
					opportunity.get(opportunitiesFields.CREATED_DATE),
					opportunity.get(opportunitiesFields.SUBSCRIPTION_END_DATE)
				)}
				onMouseEnter={handleActivityMouseEnter(
					<div class="tooltip-content">
						<h5 class="type">
							{`${type} Opportunity`}
						</h5>

						<h3 class="summary">
							{opportunity.get(opportunitiesFields.NAME)}
						</h3>

						<div class="meta">
							<InlineInfo
								elementClasses={`amount`}
								label={Liferay.Language.get('amount')}
								value={formatCurrency(
									opportunity.get(opportunitiesFields.LIST_PRICE_TOTAL),
									opportunity.get(opportunitiesFields.CURRENCY_ISO_CODE)
								)}
							/>
						</div>

						<h4 class="status">
							{status === activityStatuses.NEUTRAL ? (
								`Opportunity due in ${Moment(opportunity.get(opportunitiesFields.CLOSE_DATE)).fromNow(true)}.`
							) : [
								'Opportunity ',
								(<strong class={`status ${status}`}>
									{stage.toLowerCase()}
								</strong>),
								` on ${Moment(opportunity.get(opportunitiesFields.CLOSE_DATE)).format('MMM DD, YYYY')}.`
							]}
						</h4>
					</div>
				)}
				onMouseLeave={handleActivityMouseLeave}
			>
				<OpportunityPoint
					key={id}
					opportunityKey={id}
					stage={stage}
					type={type}
				/>
			</ActivityPoint>
		);
	}
}

OpportunityModel.PROPS = {
	addIndicator: Config.func().required(),
	addMarker: Config.func().required(),
	getScaleTimeValue: Config.func().required(),
	handleSelectActivity: Config.func().required(),
	opportunity: Config.instanceOf(Map).required(),
	related: Config.bool().value(false),
	selected: Config.bool().value(false),
	x: Config.number().required(),
	y: Config.number().required()
};

OpportunityModel.SYNC_UPDATES = true;

export default OpportunityModel;