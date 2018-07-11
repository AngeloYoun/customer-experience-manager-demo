import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as PROJECTS} from 'actions/projects';
import OpportunityIcon from 'components/icons/OpportunityIcon';
import ActivityPoint, {activityStatuses} from 'components/models/ActivityPoint';
import {opportunityClosedStatusMap} from 'components/models/OpportunityModel';
import fieldMap from 'lib/field-formats';

const {
	[OPPORTUNITIES]: opportunitiesFields,
	[PROJECTS]: projectsFields
} = fieldMap;

class OpportunityLine extends JSXComponent {
	render() {
		const {
			opportunities,
			projects,
			stageHistory
		} = this.props;

		const opportunityId = stageHistory.get('opportunityId');

		const opportunity = opportunities.get(opportunityId);

		const projectId = opportunity.get(opportunitiesFields.PROJECT);
		const project = projects.get(projectId);
		const projectName = project.get(projectsFields.NAME);

		const stage = stageHistory.get(opportunitiesFields.STAGE);
		const type = opportunity.get(opportunitiesFields.TYPE);

		const status = opportunityClosedStatusMap[stage] ? opportunityClosedStatusMap[stage] : activityStatuses.NEUTRAL;

		return (
			<div class="opportunity-line-container">
				<OpportunityIcon type={type} />

				<h3 class="opportunity-line">
					<span class="type">{`${type} Opportunity`}</span>

					{' for project '}

					<a
						class="project link"
						href={`${window.Dossiera.URLS.HOST_URL}/accounts/${project.get(projectsFields.ACCOUNT)}/projects/${project.get(projectsFields.ID)}`}
					>
						{projectName}
					</a>

					{' moved to '}

					<span class={`stage ${status}`}>{stage}</span>

					{'.'}
				</h3>
			</div>
		);
	}
}

OpportunityLine.PROPS = {
	opportunities: Config.instanceOf(Map).required(),
	projects: Config.instanceOf(Map).required(),
	stageHistory: Config.instanceOf(Map).required()
};

export default OpportunityLine;