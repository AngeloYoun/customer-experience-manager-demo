import {fromJS, List, Map} from 'immutable';
import {isNil} from 'lodash';
import Moment from 'moment';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {NAME as ACCOUNTS, accountsActions} from 'actions/accounts';
import {NAME as PROJECTS, projectsActions} from 'actions/projects';
import {NAME as OPPORTUNITIES, opportunitiesActions} from 'actions/opportunities';
import {NAME as USERS, usersActions} from 'actions/users';
import {loopActions} from 'actions/loop';
import Pageheader from 'components/page-header/PageHeader';
import ActivityTimeline from 'components/timeline-vertical/ActivityTimeline';
import Sidebar, {locationsMap} from 'components/sidebar/Sidebar';
import Navbar from 'components/navbar/Navbar';
import CollapsableContainer from 'components/containers/CollapsableContainer';
import AccountCard from 'components/text-groups/AccountCard';
import {isOpportunityOpen} from 'components/models/OpportunityModel';
import ProjectCard from 'components/text-groups/ProjectCard';
import OpportunityCard from 'components/text-groups/OpportunityCard';
import DataHandler from 'components/wrappers/DataHandler';
import {checkIfPropsChanged, formatCurrency, getLoopNameFromEmail, mapAvailableKeys, subLanguageKey, subLanguageKeyArray} from 'lib/util';
import AccountHeader from 'pages/account/AccountHeader';
import AccountOverview from 'pages/account/overview';
import AccountProjects from 'pages/account/projects';
import {requestActions, requestModifiers} from 'lib/request';
import fieldMap from 'lib/field-formats';

const {
	[ACCOUNTS]: accountsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[PROJECTS]: projectsFields,
	[USERS]: usersFields
} = fieldMap;

const {
	ANY
} = requestModifiers;

class HomeDashboard extends JSXComponent {
	created() {
		window.document.title = `Home - Dashboard`
	}

	render() {
		const {
			accounts,
			getAccounts,
			getOpportunities,
			getProjects,
			opportunities,
			projects,
			user
		} = this.props;

		const userAccountKeys = user.get(usersFields.ACCOUNTS);
		const userOpportunityKeys = user.get(usersFields.OPPORTUNITIES);
		const userProjectKeys = user.get(usersFields.PROJECTS);

		const userAccounts = mapAvailableKeys(
			userAccountKeys,
			accounts
		);

		const userOpportunities = mapAvailableKeys(
			userOpportunityKeys,
			opportunities
		);

		const userProjects = mapAvailableKeys(
			userProjectKeys,
			projects
		);

		const openOpportunities = userOpportunities.filter(
			opportunity => isOpportunityOpen(opportunity)
		);

		const activeProjects = userProjects.filter(
			project => Moment().isBetween(
				project.get(projectsFields.SUBSCRIPTION_START_DATE),
				project.get(projectsFields.SUBSCRIPTION_END_DATE)
			)
		);

		const activeAccounts = userAccounts.filter(
			account => !accounts.get(accountsFields.HAS_ACTIVE_SUBSCRIPTION)
		);

		return (
			<div class="home-dashboard-container">
				<DataHandler
					elementClasses="home-dashboard-content"
					dataConfigs={fromJS([
						{
							action: getAccounts,
							dataExists: userAccounts.size === userAccountKeys.size,
							requestParams: {
								modifiers: [
									{
										key: ANY,
										args: [accountsFields.ID].concat(userAccountKeys.toJS())
									}
								]
							},
						},
						{
							action: getOpportunities,
							dataExists: userOpportunities.size === userOpportunityKeys.size,
							requestParams: {
								modifiers: [
									{
										key: ANY,
										args: [opportunitiesFields.ID].concat(userOpportunityKeys.toJS())
									}
								]
							},
						},
						{
							action: getProjects,
							dataExists: userProjects.size === userProjectKeys.size,
							requestParams: {
								modifiers: [
									{
										key: ANY,
										args: [projectsFields.ID].concat(userProjectKeys.toJS())
									}
								]
							}
						}
					])}
				>
					<div class="content-section section-1-3">
						<CollapsableContainer
							title={subLanguageKey(
								Liferay.Language.get('x-active-accounts'),
								[
									activeAccounts.size
								]
							)}
						>
							{activeAccounts.map(
								account => (
									<AccountCard
										account={account}
									/>
								)
							).toJS()}
						</CollapsableContainer>
					</div>

					<div class="content-section section-1-3">
						<CollapsableContainer
							title={subLanguageKey(
								Liferay.Language.get('x-active-projects'),
								[
									activeProjects.size
								]
							)}
						>
							{activeProjects.map(
								project => (
									<ProjectCard
										accounts={accounts}
										project={project}
									/>
								)
							).toJS()}
						</CollapsableContainer>
					</div>

					<div class="content-section section-1-3">
						<CollapsableContainer
							title={subLanguageKey(
								Liferay.Language.get('x-opportunities-in-progress'),
								[
									openOpportunities.size
								]
							)}
						>
							{openOpportunities.map(
								opportunity => (
									<OpportunityCard
										accounts={accounts}
										opportunity={opportunity}
										projects={projects}
									/>
								)
							).toJS()}
						</CollapsableContainer>
					</div>
				</DataHandler>

				<div class="content-section section-1-1">
					<DataHandler
						dataConfigs={fromJS([
							{
								action: getOpportunities,
								dataExists: userOpportunities.size === userOpportunityKeys.size,
								requestParams: {
									modifiers: [
										{
											key: ANY,
											args: [opportunitiesFields.ID].concat(userOpportunityKeys.toJS())
										}
									]
								},
							},
							{
								action: getProjects,
								dataExists: userProjects.size === userProjectKeys.size,
								requestParams: {
									modifiers: [
										{
											key: ANY,
											args: [projectsFields.ID].concat(userProjectKeys.toJS())
										}
									]
								}
							}
						])}
					>
						{userOpportunities && userProjects && (
							<ActivityTimeline
								opportunities={userOpportunities}
								projects={userProjects}
								key="overview-history-vertical"
							/>
						)}
					</DataHandler>
				</div>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			[
				'accounts',
				'opportunities',
				'projects',
				'user'
			],
			nextProps
		);
	}
}

HomeDashboard.PROPS = {
	accounts: Config.instanceOf(Map),
	opportunities: Config.instanceOf(Map),
	projects: Config.instanceOf(Map),
	user: Config.instanceOf(Map),
	getAccounts: Config.func().required(),
	getOpportunities: Config.func().required(),
	getProjects: Config.func().required()
};

export default connect(
	state => (
		{
			accounts: state.getIn(['accounts', 'data']),
			opportunities: state.getIn(['opportunities', 'data']),
			projects: state.getIn(['projects', 'data'])
		}
	),
	{
		getAccounts: accountsActions.GET,
		getOpportunities: opportunitiesActions.GET,
		getProjects: projectsActions.GET,
	}
)(HomeDashboard);