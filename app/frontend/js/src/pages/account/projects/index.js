import {fromJS, List, Map} from 'immutable';
import {isNil} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';
import gql from 'graphql-tag';

import {NAME as ACCOUNTS, accountsActions} from 'actions/accounts';
import {NAME as PROJECTS, projectsActions} from 'actions/projects';
import ProjectsTable from 'components/table/ProjectsTable';
import DataHandler from 'components/wrappers/DataHandler';
import fieldMap from 'lib/field-formats';
import {requestActions, requestModifiers} from 'lib/request';
import {checkIfPropsChanged, formatField, mapAvailableKeys} from 'lib/util';
import AccountProjectsDetails from 'pages/account/projects/AccountProjectsDetails';

const {
	[ACCOUNTS]: accountsFields,
	[PROJECTS]: projectsFields
} = fieldMap;

const {
	GET
} = requestActions;

const {
	ANY
} = requestModifiers

const {
	PROJECT_KEY
} = fieldMap;

class AccountProjects extends JSXComponent {
	created() {
		const {
			account,
			accountId
		} = this.props;

		window.document.title = `${account.get(accountsFields.NAME)} - Projects`

		this._querySub = window.Dossiera.apollo.watchQuery({
			query: gql(
				`query AccountProjects ($accountId: String) {
					getProjectsByAccount(id: $accountId) {
						name
						liferayVersion
						subscriptionStartDate
						subscriptionEndDate
						solutionType
						id
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
						projects: fromJS(data.getProjectsByAccount),
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
			account,
			accountId,
			entityId,
		} = this.props;

		const {
			projects
		} = this.state;

		return (
			<div class="account-projects-container">
				{!entityId && projects &&
					<ProjectsTable
						projects={projects}
						renderProjectUrl={this._renderProjectRowURL}
					/>
				}

				{entityId &&
					<AccountProjectsDetails
						elementClasses="content"
						account={account}
						project={projects.get(entityId)}
						projectId={entityId}
					/>
				}
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return nextState || checkIfPropsChanged(
			[
				'accounts',
				'projects'
			],
			nextProps
		);
	}

	_renderProjectRowURL = project => {
		return (
			`${window.Dossiera.URLS.HOST_URL}/accounts/${this.props.accountId}/projects/${project.get(projectsFields.ID)}`
		);
	}
}

AccountProjects.PROPS = {
	account: Config.instanceOf(Map).required(),
	accountId: Config.string().required(),
};

AccountProjects.STATE = {
	projects: Config.instanceOf(List)
}

export default AccountProjects;