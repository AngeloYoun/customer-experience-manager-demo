import {Map, List, fromJS} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import OpportunityLine from 'components/timeline-vertical/OpportunityLine';
import YearFilter from 'components/timeline-vertical/YearFilter'
import fieldMap, {fieldValue} from 'lib/field-formats';
import {checkIfPropsChanged} from 'lib/util';
import TimelineVertical, {DATE} from 'components/timeline-vertical/TimelineVertical';

const {
	[OPPORTUNITIES]: opportunitiesFields,
} = fieldMap;

const TYPE = '_ACTIVITY_TYPE';

const OPPORTUNITY = 'OPPORTUNITY';

const ITEM_RENDERER_MAP = {
	[OPPORTUNITY]: ({activity, ...props}) => [
		<OpportunityLine
			stageHistory={activity}
			key={activity.get('id')}
			{...props}
		/>
	],

};

class ActivityTimeline extends JSXComponent {
	render() {
		const {
			opportunities,
			projects,
		} = this.props;

		const {
			filters,
		} = this.state;

		const stageHistories = opportunities.reduce(
			(accum, opportunity, id) => {
				return accum.concat(
					opportunity.get(opportunitiesFields.STAGE_HISTORY).map(
						stageHistory => stageHistory.merge({
							[DATE]: Moment(stageHistory.get(opportunitiesFields.CLOSE_DATE)).valueOf(),
							[TYPE]: OPPORTUNITY,
							opportunityId: id
						})
					)
				)
			},
			List()
		);

		const activities = stageHistories;

		const filteredActivities = filters.size ? activities.filter(
			entry => filters.some(
				filterCheck => {
					return !filterCheck(entry)
				}
			)
		) : activities;

		return (
			<div class="activity-timeline-container">
				<div class="content-section section-3-4">
					<TimelineVertical
						items={filteredActivities}
						itemRenderers={this._activitiyRenderer}
					/>
				</div>

				<div class="content-section section-1-4">
					<YearFilter
						filters={filters}
						setFilter={this._setFilter}
						years={List(['2017', '2016', '2015'])}
					/>
				</div>
			</div>
		);
	}

	_activitiyRenderer = activity => {
		const {
			projects,
			opportunities
		} = this.props;


		return ITEM_RENDERER_MAP[activity.get(TYPE)](
			{
				activity,
				opportunities,
				projects
			}
		);
	}

	shouldUpdate(nextState, nextProps) {
		return nextState ? true : checkIfPropsChanged(
			[
				'projects',
				'opportunities',
			],
			nextProps
		);
	}

	_setFilter = (active, key, check) => {
		this.setState(
			{
				filters: active ? Map({[key]: check}) : new Map()
			}
		);
	}
}

ActivityTimeline.PROPS = {
	projects: Config.instanceOf(Map).required(),
	opportunities: Config.instanceOf(Map).required(),
};

ActivityTimeline.STATE = {
	filters: Config.instanceOf(Map).value(new Map()),
}

export default ActivityTimeline;