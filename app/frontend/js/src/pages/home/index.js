import {fromJS, List, Map} from 'immutable';
import {isNil} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {loopActions} from 'actions/loop';
import {usersActions, NAME as USERS} from 'actions/users';
import Pageheader from 'components/page-header/PageHeader';
import Sidebar, {locationsMap} from 'components/sidebar/Sidebar';
import Navbar from 'components/navbar/Navbar';
import DataHandler from 'components/wrappers/DataHandler';
import {checkIfPropsChanged, getLoopNameFromEmail} from 'lib/util';
import HomeDashboard from 'pages/home/dashboard'
import {requestActions} from 'lib/request';
import fieldMap from 'lib/field-formats';

const {
	[USERS]: usersFields
} = fieldMap;

const ACCOUNTS = 'accounts';

const DASHBOARD = 'dashboard';

const PROJECTS = 'projects';

const homeViewKeys = Map(
	{
		[DASHBOARD]: Liferay.Language.get('dashboard'),
		[ACCOUNTS]: Liferay.Language.get('accounts'),
		[PROJECTS]: Liferay.Language.get('projects')
	}
);

const homeViewOptions = List([DASHBOARD, ACCOUNTS, PROJECTS]);

const {
	DELETE,
	GET,
	POST,
	PATCH
} = requestActions;

class Home extends JSXComponent {
	render() {
		const {
			loopUser,
			user,
			getLoop,
			getUsers,
			router
		} = this.props;

		let {
			homeView
		} = router.params;

		if (!homeView || !homeViewKeys.has(homeView)) {
			homeView = DASHBOARD;
		}

		const userName = window.Dossiera.userEmail;

		return (
			<div class="home-container">
				<Sidebar
					key="sidebar"
					selected={locationsMap.HOME}
				/>

				<DataHandler
					elementClasses="view-container"
					dataConfigs={fromJS(
						[
							{
								action: getUsers,
								dataExists: !isNil(user),
								requestParams: {
									path: [userName]
								},
								waitForData: true
							},
							{
								action: getLoop,
								dataExists: loopUser,
								requestParams: {
									wedeploy: false,
									path: ['people', `_${getLoopNameFromEmail(userName)}`]
								},
								waitForData: true
							}
						]
					)}
				>
					{loopUser && (
						<Pageheader
							avatarHref={`https://loop.liferay.com${loopUser.getIn(['profileImageData', 'imageURL_web'])}`}
							label={loopUser.get('jobTitle')}
							liferayLogo={true}
							title={`${loopUser.get('firstName')} ${loopUser.get('lastName')}`}
						/>
					)}

					<Navbar
						href={`${window.Dossiera.URLS.HOST_URL}/home/{option}`}
						options={homeViewOptions}
						optionsMap={homeViewKeys}
						selected={homeView}
					/>

					{(homeView === DASHBOARD) && user && (
						<HomeDashboard
							elementClasses="content"
							user={user.merge(loopUser)}
						/>
					)}
				</DataHandler>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			[
				'user',
				'loopUser',
				'router'
			],
			nextProps
		);
	}
}

Home.PROPS = {
	loopUser: Config.instanceOf(Map),
	user: Config.instanceOf(Map),
	getLoop: Config.func().required(),
	getUsers: Config.func().required(),
	router: Config.object().required()
};

export default connect(
	state => {
		const user = window.Dossiera.userEmail;

		return {
			loopUser: state.getIn(['loop', 'data', user]),
			user: state.getIn(['users', 'data', user])
		}
	},
	{
		getLoop: loopActions[GET],
		getUsers: usersActions[GET]
	}
)(Home);