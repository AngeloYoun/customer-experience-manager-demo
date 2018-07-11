import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import {NAME as TOUCHPOINTS} from 'actions/touchpoints';
import Moment from 'moment';
import fieldMap, {fieldValue} from 'lib/field-formats';
import TouchpointIcon from 'components/icons/TouchpointIcon';
import ActivityPoint, {activityStatuses} from 'components/models/ActivityPoint';

const {
	[TOUCHPOINTS]: touchpointsFields
} = fieldMap;

const {
	TOUCHPOINT_STATUS,
	TOUCHPOINT_TYPE
} = fieldValue;

class TouchpointModel extends JSXComponent {
	render() {
		const {
			addIndicator,
			addMarker,
			getScaleTimeValue,
			handleActivityMouseEnter,
			handleActivityMouseLeave,
			handleSelectActivity,
			related,
			selected,
			touchpoint,
			x,
			y
		} = this.props;

		const type = touchpoint.get(touchpointsFields.TYPE);
		const status = touchpoint.get(touchpointsFields.STATUS);
		const id = touchpoint.get(touchpointsFields.ID);

		const completed = status === TOUCHPOINT_STATUS.COMPLETED;

		const activityStatus = completed ? '' : activityStatuses.NEUTRAL;

		const dateCompleted = touchpoint.get(touchpointsFields.COMPLETED_DATE);
		const dateCreated = touchpoint.get(touchpointsFields.CREATED_DATE);
		const dueDate = touchpoint.get(touchpointsFields.DUE_DATE);

		if (selected) {
			addMarker(
				{
					x: getScaleTimeValue(dateCreated),
					content: (
						<div>
							<h4 class="marker-label-text-primary">
								{'Date Created'}
							</h4>
						</div>
					)
				}
			);

			if (completed) {
				addMarker(
					{
						x: getScaleTimeValue(dateCompleted),
						content: (
							<div>
								<h4 class="marker-label-text-primary">
									{'Date Completed'}
								</h4>
							</div>
						)
					}
				);
			}
			else {
				addMarker(
					{
						x: getScaleTimeValue(dueDate),
						content: (
							<div>
								<h4 class="marker-label-text-primary">
									{'Due Date'}
								</h4>
							</div>
						)
					}
				);
			}
		}

		return (
			<ActivityPoint
				key={`activity-${id}`}
				elementClasses={`${selected ? 'selected' : ''} ${!completed && Moment(dueDate).diff(Moment()) > 7 ? 'critical' : ''}`}
				x={x}
				y={y}
				status={activityStatus}
				onClick={handleSelectActivity(
					dateCreated,
					dateCompleted || dueDate
				)}
				onMouseEnter={handleActivityMouseEnter(
					<div class="tooltip-content">
						<h5 class="type">
							{`${type} Touchpoint`}
						</h5>

						<h3 class="summary">
							{touchpoint.get(touchpointsFields.SUBJECT)}
						</h3>

						<h4 class="status">
							{status === 'Completed' ? (
								`Touchpoint completed on ${Moment(touchpoint.get(touchpointsFields.COMPLETED_DATE)).format('MMM DD, YYYY')}.`
							) : (
								`Task due in ${Moment(touchpoint.get(touchpointsFields.DUE_DATE)).fromNow()}.`
							)}
						</h4>
					</div>
				)}
				onMouseLeave={handleActivityMouseLeave}
			>
				<TouchpointIcon
					key={id}
					type={type}
				/>
			</ActivityPoint>
		);
	}
}

TouchpointModel.PROPS = {
	addIndicator: Config.func().required(),
	addMarker: Config.func().required(),
	getScaleTimeValue: Config.func().required(),
	handleSelectActivity: Config.func().required(),
	touchpoint: Config.instanceOf(Map).required(),
	related: Config.bool().value(false),
	selected: Config.bool().value(false),
	x: Config.number().required(),
	y: Config.number().required()
};

export default TouchpointModel;