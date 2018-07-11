import {fromJS, List, Map} from 'immutable';
import {isNil} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {getProjectOwners} from 'actions/project-owners';
import {getProjectStatistics} from 'actions/project-statistics';
import {getProjectSubscriptions} from 'actions/project-subscriptions';
import {getProjectTimelineEntriesMap} from 'actions/project-timeline-entries-map';
import DataHandler from 'components/wrappers/DataHandler';
import {checkIfPropsChanged} from 'lib/util';
import ProjectOverviewActiveSubscriptions from 'pages/project/overview/ProjectOverviewActiveSubscriptions';
import ProjectOverviewHistory from 'pages/project/overview/ProjectOverviewHistory';
import ProjectOverviewOpportunityOwners from 'pages/project/overview/ProjectOverviewOpportunityOwners';
import ProjectOverviewStatistics from 'pages/project/overview/ProjectOverviewStatistics';

const connectedDataKeys = [
	'projectStatistics',
	'projectTimelineEntriesMap',
	'projectOwners',
	'projectSubscriptions'
];

const dataKeys = [
	'project',
	...connectedDataKeys
];

class ProjectOverview extends JSXComponent {
	render() {
		const {
			getProjectOwners,
			getProjectStatistics,
			getProjectSubscriptions,
			getProjectTimelineEntriesMap,
			projectId,
			projectOwners,
			projectStatistics,
			projectSubscriptions,
			projectTimelineEntriesMap
		} = this.props;

		const requestParams = {entityId: projectId};

		return (
			<div class="project-overview-container">
				<div class="content-section section-1-1">
					<DataHandler
						dataConfigs={fromJS(
							[
								{
									action: getProjectStatistics,
									dataExists: !isNil(projectStatistics),
									requestParams,
									waitForData: false
								}
							]
						)}
					>
						<ProjectOverviewStatistics
							projectStatistics={projectStatistics}
						/>
					</DataHandler>

					<DataHandler
						dataConfigs={fromJS(
							[
								{
									action: getProjectTimelineEntriesMap,
									dataExists: !isNil(projectTimelineEntriesMap),
									requestParams
								}
							]
						)}
					>
						<ProjectOverviewHistory
							projectHistory={projectTimelineEntriesMap}
						/>
					</DataHandler>
				</div>

				<div class="content-section section-1-4">
					<h2 class="section-header">
						{Liferay.Language.get('opportunity-owners')}
					</h2>

					<DataHandler
						dataConfigs={fromJS(
							[
								{
									action: getProjectOwners,
									dataExists: !isNil(projectOwners),
									requestParams
								}
							]
						)}
					>
						<ProjectOverviewOpportunityOwners
							projectOwners={projectOwners}
						/>
					</DataHandler>
				</div>

				<div class="content-section section-3-4">
					<h2 class="section-header">
						{Liferay.Language.get('active-subscriptions')}
					</h2>

					<DataHandler
						dataConfigs={fromJS(
							[
								{
									action: getProjectSubscriptions,
									dataExists: !isNil(projectSubscriptions),
									requestParams
								}
							]
						)}
					>
						<ProjectOverviewActiveSubscriptions
							projectSubscriptions={projectSubscriptions}
						/>
					</DataHandler>
				</div>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			dataKeys,
			nextProps
		);
	}
}

ProjectOverview.PROPS = {
	getProjectOwners: Config.func(),
	getProjectStatistics: Config.func(),
	getProjectSubscriptions: Config.func(),
	getProjectTimelineEntriesMap: Config.func(),
	project: Config.instanceOf(Map),
	projectId: Config.string().required,
	projectOwners: Config.instanceOf(List),
	projectStatistics: Config.instanceOf(Map),
	projectSubscriptions: Config.instanceOf(List),
	projectTimelineEntriesMap: Config.instanceOf(Map)

};

export default connect(
	(state, {projectId}) => {
		return connectedDataKeys.reduce(
			(accum, dataKey) => (
				{
					[dataKey]: state.getIn([dataKey, 'data', projectId]),
					...accum
				}
			),
			{}
		);
	},
	{
		getProjectOwners,
		getProjectStatistics,
		getProjectSubscriptions,
		getProjectTimelineEntriesMap
	}
)(ProjectOverview);