import {fromJS, List, Map} from 'immutable';
import {isNil} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';
import gql from 'graphql-tag';

import {NAME as ACCOUNTS, accountsActions} from 'actions/accounts';
import {NAME as CONTACTS, contactsActions} from 'actions/contacts';
import {NAME as LESA_TICKETS, lesaTicketsActions} from 'actions/lesa-tickets';
import {NAME as PROJECTS, projectsActions} from 'actions/projects';
import {NAME as OPPORTUNITIES, opportunitiesActions} from 'actions/opportunities';
import {NAME as TOUCHPOINTS, touchpointsActions} from 'actions/touchpoints';
import {NAME as OPPORTUNITY_LINE_ITEMS, opportunityLineItemsActions} from 'actions/opportunity-line-items';
import AccountOverviewHistory from 'pages/account/overview/AccountOverviewHistory';
import ActivityTimeline from 'components/timeline-vertical/ActivityTimeline';
import AccountAbout from 'components/text-groups/AccountAbout';
import LoadingWrapper from 'components/wrappers/LoadingWrapper';
import {isOpportunityOpen} from 'components/models/OpportunityModel';
import CollapsableContainer from 'components/containers/CollapsableContainer';
import OpportunityCard from 'components/text-groups/OpportunityCard';
import ProjectCard from 'components/text-groups/ProjectCard';
import {requestActions, requestModifiers} from 'lib/request';
import {checkIfPropsChanged, joinArrayFields, mapAvailableKeys, subLanguageKey} from 'lib/util';
import fieldMap from 'lib/field-formats';

const {
	[ACCOUNTS]: accountsFields,
	[CONTACTS]: contactsFields,
	[LESA_TICKETS]: lesaTicketsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[OPPORTUNITY_LINE_ITEMS]: opportunityLineItemsFields,
	[PROJECTS]: projectsFields,
	[TOUCHPOINTS]: touchpointsFields
} = fieldMap;

const {
	GET
} = requestActions;

const {
	ANY
} = requestModifiers

const dataKeys = [
	'account',
	'contacts',
	'lesaTickets',
	'projects',
	'opportunities',
	'opportunityLineItems',
	'touchpoints'
];

class AccountOverview extends JSXComponent {
	created() {
		const {
			account,
			accountId
		} = this.props;

		window.document.title = `${account.get(accountsFields.NAME)} - Overview`

		this._querySub = window.Dossiera.apollo.watchQuery({
			query: gql(
				`query AccountOverview ($accountId: String) {
					account(id: $accountId) {
						id
						projects {
							subscriptionStartDate
							subscriptionEndDate
							id
						}
						tickets {
							id
						}
						opportunities {
							id
							stage
						}
					}
				}`
			),
			variables: {
				accountId
			}
		}).subscribe({
			next: ({data}) => {
				this.setState(
					{
						account: fromJS(data.account),
						loading: false
					}
				)
			}
		});
	}

	detached() {
		this._querySub.unsubscribe();
	}

	render() {
		const {
			accountId
		} = this.props;

		const {
			account
		} = this.state;

		const accountOpportunities = account.get(accountsFields.OPPORTUNITIES) || List();
		const accountProjects = account.get(accountsFields.PROJECTS) || List();

		const openOpportunities = accountOpportunities.filter(
			opportunity => isOpportunityOpen(opportunity)
		);

		const activeProjects = accountProjects.filter(
			project => Moment().isBetween(
				project.get(projectsFields.SUBSCRIPTION_START_DATE),
				project.get(projectsFields.SUBSCRIPTION_END_DATE)
			)
		);

		return (
			<div class="account-overview-container">
				<div class="content-section section-1-1">
					<AccountOverviewHistory
						accountId={accountId}
						key="overview-history"
					/>
				</div>

				<div class="content-section section-1-4">
					<CollapsableContainer
						title={subLanguageKey(
							Liferay.Language.get('x-opportunities-in-progress'),
							[openOpportunities.size]
						)}
						startCollapsed={true}
					>
						{openOpportunities.map(
							opportunity => (
								<OpportunityCard
									opportunityId={opportunity.get(opportunitiesFields.ID)}
								/>
							)
						).toJS()}
					</CollapsableContainer>

					<CollapsableContainer
						title={subLanguageKey(
							Liferay.Language.get('x-active-projects'),
							[
								activeProjects.size
							]
						)}
						startCollapsed={true}
					>
						{activeProjects.map(
							project => (
								<ProjectCard
									projectId={project.get(projectsFields.ID)}
								/>
							)
						).toJS()}
					</CollapsableContainer>

					<CollapsableContainer title={Liferay.Language.get('about')}>
						<AccountAbout accountId={accountId} />
					</CollapsableContainer>
				</div>

				<div class="content-section section-3-4">
					<LoadingWrapper dataLoaded={false}>
						<ActivityTimeline
							key="overview-history-vertical"
						/>
					</LoadingWrapper>
				</div>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return nextState || checkIfPropsChanged(
			dataKeys,
			nextProps
		);
	}

	_getAccountProjects(projectKeys, projects) {
		return projectKeys.map(
			key => projects.get(key)
		);
	}
}

AccountOverview.PROPS = {
	accountId: Config.string().required()
};

AccountOverview.STATE = {
	account: Config.instanceOf(Map).value(Map()),
}

export default AccountOverview;