import {List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import OpportunityTimeline from 'components/timeline/OpportunityTimeline';
import fieldMap from 'lib/field-formats';

const {
	OPPORTUNITY_CLOSE_LOCAL_DATE,
	OPPORTUNITY_KEY,
	OPPORTUNITY_STAGE,
	OPPORTUNITY_SUBSCRIPTION_END_LOCAL_DATE,
	OPPORTUNITY_SUBSCRIPTION_START_LOCAL_DATE,
	OPPORTUNITY_TYPE
} = fieldMap;

const DIMENSION_HORZ_AXIS_HEIGHT = 56;

const DIMENSION_TIMELINE_HEIGHT = 400;

class ProjectOverviewHistory extends JSXComponent {
	render() {
		const {
			projectHistory
		} = this.props;

		const timelineEntries = projectHistory.reduce(
			(accum, relatedOpportunities, groupKey) => accum.concat(
				relatedOpportunities.map(
					(opportunity, index) => {
						const start = this._getOpportunityStartDate(opportunity);

						const prevOpportunity = relatedOpportunities.get(index - 1);

						const dateDiffIsLessThan1Month = (index !== 0) && (Moment(start).diff(this._getOpportunityStartDate(prevOpportunity), 'months', true) < 1);

						return Map(
							{
								className: `subgroup ${dateDiffIsLessThan1Month ? 'overlapped' : ''}`,
								end: opportunity.get(OPPORTUNITY_SUBSCRIPTION_END_LOCAL_DATE) || start,
								key: opportunity.get(OPPORTUNITY_KEY),
								stage: opportunity.get(OPPORTUNITY_STAGE),
								start,
								subgroup: dateDiffIsLessThan1Month ? `${groupKey}${index}` : groupKey,
								subgroupOrder: accum.size,
								type: opportunity.get(OPPORTUNITY_TYPE)
							}
						);
					}
				)
			),
			new List()
		);

		const timelineEndDate = this._getTimelineEndDate(timelineEntries);
		const timelineStartDate = this._getTimelineStartDate(timelineEntries);

		const endDateString = timelineEndDate.format('YYYY-MM-DD');
		const startDateString = timelineStartDate.format('YYYY-MM-DD');

		return (
			<div class="project-overview-history-container">
				<OpportunityTimeline
					endDate={endDateString}
					key="opportunity-timeline"
					opportunities={timelineEntries}
					stackSubgroups={true}
					startDate={startDateString}
					timelineAxisHeight={DIMENSION_HORZ_AXIS_HEIGHT}
					timelineHeight={DIMENSION_TIMELINE_HEIGHT}
				/>
			</div>
		);
	}

	_getOpportunityStartDate = opportunity => opportunity.get(OPPORTUNITY_SUBSCRIPTION_START_LOCAL_DATE) || opportunity.get(OPPORTUNITY_CLOSE_LOCAL_DATE);

	_getTimelineEndDate = timelineEntries => {
		let latestDate = Moment();

		if (timelineEntries && timelineEntries.size) {
			const latestEndDate = timelineEntries.maxBy(item => item.get('end')).get('end');
			const latestStartDate = timelineEntries.maxBy(item => item.get('start')).get('start');

			latestDate = Moment(latestStartDate).isAfter(latestEndDate) ? latestStartDate : latestEndDate;

			if (Moment(latestDate).isBefore(Moment())) {
				latestDate = Moment();
			}
		}

		return this._roundUpToQuarterStart(latestDate);
	}

	_getTimelineStartDate = timelineEntries => {
		let earliestDate = Moment().subtract(1, 'years');

		if (timelineEntries && timelineEntries.size) {
			earliestDate = timelineEntries.minBy(item => item.get('start')).get('start');
		}

		return this._roundDownToQuarterStart(earliestDate);
	}

	_roundDownToQuarterStart = date => Moment(date).startOf('quarter');

	_roundUpToQuarterStart = date => Moment(date).startOf('quarter').add(1, 'quarters');
}

ProjectOverviewHistory.PROPS = {
	projectHistory: Config.instanceOf(Map)
};

export default ProjectOverviewHistory;