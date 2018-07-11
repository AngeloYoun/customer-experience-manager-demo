import {List, fromJS, Map} from 'immutable';
import {values} from 'lodash';
import Moment from 'moment';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';
import gql from 'graphql-tag';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as LESA_TICKETS, lesaTicketsActions} from 'actions/lesa-tickets';
import {NAME as OPPORTUNITIES, opportunitiesActions} from 'actions/opportunities';
import {NAME as PROJECTS} from 'actions/projects';
import LoadingWrapper from 'components/wrappers/LoadingWrapper';
import OpportunityIcon from 'components/icons/OpportunityIcon';
import LesaTicketIcon from 'components/icons/LesaTicketIcon';
import ActiveTag from 'components/tag/ActiveTag';
import {requestModifiers} from 'lib/request';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {formatCurrency, mapAvailableKeys, subLanguageKey, subLanguageKeyArray} from 'lib/util';

const {
	[ACCOUNTS]: accountField,
	[LESA_TICKETS]: ticketFields,
	[OPPORTUNITIES]: opportunityFields,
	[PROJECTS]: projectFields
} = fieldMap;

const {
	LESA_TICKET_STATUS,
	OPPORTUNITY_TYPE,
	OPPORTUNITY_STAGE_OPEN
} = fieldValue;

const {
	ANY
} = requestModifiers;

class ProjectCard extends JSXComponent {
	created() {
		const {
			projectId
		} = this.props;

		this._querySub = window.Dossiera.apollo.watchQuery({
			query: gql(
				`query ProjectCard($projectId: String) {
					project(id: $projectId) {
						${projectFields.NAME}
						${projectFields.ID}
						${projectFields.SUBSCRIPTION_END_DATE}
					}
					getAccountByProject(id: $projectId) {
						${accountField.ID}
						${accountField.NAME}
					}
					getTicketsByProject(id: $projectId) {
						${ticketFields.ID}
						${ticketFields.STATUS}
						${ticketFields.SEVERITY}
					}
					getOpportunitiesByProject(id: $projectId) {
						${opportunityFields.ID}
						${opportunityFields.STAGE}
						${opportunityFields.TYPE}
					}
				}`
			),
			variables: {
				projectId
			}
		}).subscribe({
			next: ({data}) => {
				this.setState(
					{
						project: fromJS(data.project),
						projectAccount: fromJS(data.getAccountByProject),
						projectLesaTickets: fromJS(data.projectLesaTickets),
						projectOpportunities: fromJS(data.getOpportunitiesByProject),
					}
				)
			}
		})
	}

	detached() {
		this._querySub.unsubscribe();
	}

	render () {
		const {
			projectAccount,
			project,
			projectLesaTickets,
			projectOpportunities
		} = this.state;

		const openLesaTickets = projectLesaTickets ? this._getOpenLesaTickets(projectLesaTickets) : '';

		const openOpportunities = projectOpportunities ? this._getOpenOpportunities(projectOpportunities) : '';

		return (
			<LoadingWrapper dataLoaded={!!projectAccount}>
				{projectAccount && (
					<a href={`${window.Dossiera.URLS.HOST_URL}/accounts/${projectAccount.get(accountField.ID)}/projects/${project.get(projectFields.ID)}`}>
						<div class="project-card-container">
							<div class="title">
								<h3 class="name">
									{project.get(projectFields.NAME)}
								</h3>

								<h4 class="parent-account">
									<a class="link" href={`${window.Dossiera.URLS.HOST_URL}/accounts/${projectAccount.get(accountField.ID)}`}>
										{projectAccount.get(accountField.NAME)}
									</a>
								</h4>

								<h4 class="subscription-end">
									{`Subscription ending in ${Moment(project.get(projectFields.SUBSCRIPTION_END_DATE)).fromNow(true)}.`}
								</h4>
							</div>

							<div class="meta">
								{!!openOpportunities && (
									<div class="open-opportunities">
										<h5 class="label">
											{'Open Opp.'}
										</h5>

										{this._getOpenOpportunities(projectOpportunities).groupBy(
											item => item.get(opportunityFields.TYPE)
										).map(
											(items, key) => (
												<div class="opportunity">
													<h4 class="count">
														{items.size}
													</h4>

													<OpportunityIcon type={key} />
												</div>
											)
										).toJS()}
									</div>
								)}

								{openLesaTickets.size && (
									<div class="open-tickets">
										<h5 class="label">
											{Liferay.Language.get('open-tickets')}
										</h5>

										<div class="tickets">
											{openLesaTickets.groupBy(
												item => item.get(lesaTicketsFields.SEVERITY)
											).map(
												(items, key) => (
													<div class="ticket">
														<h4 class="count">
															{items.size}
														</h4>

														<LesaTicketIcon severity={key} />
													</div>
												)
											).toJS()}
										</div>
									</div>
								)}
							</div>
						</div>
					</a>
				)}
			</LoadingWrapper>
		)
	}

	_getOpenLesaTickets = tickets => tickets.filter(
		ticket => LESA_TICKET_STATUS.IN_PROGRESS === ticket.get(lesaTicketsFields.STATUS)
	);

	_getOpenOpportunities = opportunities => opportunities.filter(
		opportunity => values(OPPORTUNITY_STAGE_OPEN).includes(
			opportunity.get(opportunityFields.STAGE)
		)
	);
}

ProjectCard.PROPS = {
	projectId: Config.string().required()
};

ProjectCard.STATE = {
	project: Config.instanceOf(Map),
	projectAccount: Config.instanceOf(Map),
	projectLesaTickets: Config.instanceOf(List),
	projectOpportunities: Config.instanceOf(List),
}

export default ProjectCard;