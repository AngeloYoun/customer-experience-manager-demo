import {fromJS, List, Map} from 'immutable';
import {isNil} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {getAccount} from 'actions/account';
import {getProject} from 'actions/project';
import Navbar from 'components/navbar/Navbar';
import DataHandler from 'components/wrappers/DataHandler';
import LoadingWrapper from 'components/wrappers/LoadingWrapper';
import {checkIfPropsChanged} from 'lib/util';
import ProjectHeader from 'pages/project/ProjectHeader';
import ProjectDetails from 'pages/project/details';
import ProjectOverview from 'pages/project/overview';

const DETAILS = 'details';

const OVERVIEW = 'overview';

const projectViewKeys = Map(
	{
		[DETAILS]: Liferay.Language.get('details'),
		[OVERVIEW]: Liferay.Language.get('overview')
	}
);

const projectViewOptions = List([OVERVIEW, DETAILS]);

class Project extends JSXComponent {
	attached() {
		const {
			account,
			getAccount,
			getProject,
			project,
			router
		} = this.props;

		if (isNil(account)) {
			getAccount(
				{
					entityId: router.params.accountId
				}
			);
		}

		if (isNil(project)) {
			getProject(
				{
					entityId: router.params.projectId
				}
			);
		}
	}

	render() {
		const {
			account,
			getAccount,
			getProject,
			project,
			router
		} = this.props;

		const {
			accountId,
			projectId,
			projectView = OVERVIEW
		} = router.params;

		return (
			<div class="project-container">
				<DataHandler
					dataConfigs={fromJS(
						[
							{
								action: getAccount,
								dataExists: !isNil(account),
								requestParams: {entityId: accountId},
								waitForData: false
							},
							{
								action: getProject,
								dataExists: !isNil(project),
								requestParams: {entityId: projectId},
								waitForData: false
							}
						]
					)}
				>
					<ProjectHeader
						account={account}
						accountId={accountId}
						project={project}
					/>

					<Navbar
						href={`${window.Dossiera.URLS.PORTLET_URL}account/${accountId}/projects/${projectId}/{option}`}
						options={projectViewOptions}
						optionsMap={projectViewKeys}
						selected={projectView}
					/>

					{(projectView === OVERVIEW) && (
						<ProjectOverview
							elementClasses="content"
							project={project}
							projectId={projectId}
						/>
					)}

					{(projectView === DETAILS) && (
						<LoadingWrapper
							dataLoaded={!isNil(project)}
						>
							<ProjectDetails
								elementClasses="content"
								project={project}
								projectId={projectId}
							/>
						</LoadingWrapper>
					)}
				</DataHandler>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			[
				'account',
				'project',
				'router'
			],
			nextProps
		);
	}
}

Project.PROPS = {
	account: Config.instanceOf(Map),
	getAccount: Config.func().required(),
	getProject: Config.func().required(),
	project: Config.instanceOf(Map),
	router: Config.object().required()
};

export default connect(
	(state, {router: {params: {accountId, projectId}}}) => (
		{
			account: state.getIn(['accounts', 'data', accountId]),
			project: state.getIn(['projects', 'data', projectId])
		}
	),
	{
		getAccount,
		getProject
	}
)(Project);