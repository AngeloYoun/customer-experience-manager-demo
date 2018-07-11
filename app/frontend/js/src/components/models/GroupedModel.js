import {List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as LESA_TICKETS} from 'actions/lesa-tickets';
import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as TOUCHPOINTS} from 'actions/touchpoints';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {formatCurrency} from 'lib/util';
import {getOpportunityStatus} from 'components/models/OpportunityModel';
import OpportunityPoint from 'components/timeline/OpportunityPoint';
import LesaTicketIcon from 'components/icons/LesaTicketIcon';
import InlineInfo from 'components/text-groups/InlineInfo';
import ActivityPoint, {activityStatuses} from 'components/models/ActivityPoint';

const {
	[LESA_TICKETS]: lesaTicketsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[TOUCHPOINTS]: touchpointsFields
} = fieldMap;

const {
	LESA_TICKET_STATUS
} = fieldValue;

class GroupedModel extends JSXComponent {
	render() {
		const {
			addIndicator,
			addMarker,
			getScaleTimeValue,
			activity,
			handleActivityMouseEnter,
			handleActivityMouseLeave,
			handleSelectActivity,
			related,
			selected,
			x,
			y
		} = this.props;

		const activityCount = activity.size;

		let status = activity.getIn([0, 'status'])

		const stage = activity.getIn([0, 'stage'])

		const type = activity.getIn([0, 'type'])

		const severity = activity.getIn([0, 'severity'])

		const activityType = activity.getIn([0, 'TYPE'])

		if (activityType === OPPORTUNITIES) {
			status = getOpportunityStatus(stage);
		}
		else if (activityType === LESA_TICKETS) {
			status = status === LESA_TICKET_STATUS.CLOSED ? (
				activityStatuses.POSITIVE
			) : (
				activityStatuses.NEUTRAL
			);;
		}

		const id = `group-${x}`

		return (
			<ActivityPoint
				activityCount={activityCount}
				key={`activity-group-${x}-${severity}-${type}-${activityType}`}
				elementClasses={`${selected ? 'selected' : ''}`}
				status={status}
				x={x}
				y={y}
				onClick={handleSelectActivity(

				)}
				onMouseEnter={handleActivityMouseEnter(
					<div class="tooltip-content">

					</div>
				)}
				onMouseLeave={handleActivityMouseLeave}
			>
				{activityType === OPPORTUNITIES && (
					<OpportunityPoint
						key={id}
						opportunityKey={id}
						stage={stage}
						type={type}
					/>
				)}

				{activityType === LESA_TICKETS && (
					<LesaTicketIcon
						key={id}
						severity={severity}
					/>
				)}
			</ActivityPoint>
		);
	}
}

GroupedModel.PROPS = {
	addIndicator: Config.func().required(),
	addMarker: Config.func().required(),
	getScaleTimeValue: Config.func().required(),
	handleSelectActivity: Config.func().required(),
	activity: Config.instanceOf(List).required(),
	related: Config.bool().value(false),
	selected: Config.bool().value(false),
	x: Config.number().required(),
	y: Config.number().required()
};

GroupedModel.SYNC_UPDATES = true;

export default GroupedModel;