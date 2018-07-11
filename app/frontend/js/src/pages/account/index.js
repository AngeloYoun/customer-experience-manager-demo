import JSXComponent, {Config} from 'metal-jsx';
import {fromJS, List, Map} from 'immutable';
import {isNil} from 'lodash';
import gql from 'graphql-tag';

import {accountsActions, NAME as ACCOUNTS} from 'actions/accounts';
import Pageheader from 'components/page-header/PageHeader';
import Sidebar, {locationsMap} from 'components/sidebar/Sidebar';
import Navbar from 'components/navbar/Navbar';
import LoadingWrapper from 'components/wrappers/LoadingWrapper';
import {checkIfPropsChanged} from 'lib/util';
import AccountHeader from 'pages/account/AccountHeader';
import AccountOverview from 'pages/account/overview';
import AccountProjects from 'pages/account/projects';
import AccountIndex from 'pages/account/AccountIndex';
import {requestActions} from 'lib/request';
import fieldMap from 'lib/field-formats';

const {
	[ACCOUNTS]: accountFields
} = fieldMap;

const OVERVIEW = 'overview';

const PROJECTS = 'projects';

const accountViewKeys = Map(
	{
		[OVERVIEW]: Liferay.Language.get('overview'),
		[PROJECTS]: Liferay.Language.get('projects')
	}
);

const accountViewOptions = List([OVERVIEW, PROJECTS]);

const {
	DELETE,
	GET,
	POST,
	PATCH
} = requestActions;

class Account extends JSXComponent {
	created() {
		const {
			router
		} = this.props;

		const {
			accountId
		} = router.params;

		if (accountId) {
			this._querySub = window.Dossiera.apollo.watchQuery({
				query: gql(
					`query Account ($accountId: String) {
						account(id: $accountId) {
							name
							id
							industry
							lastModifiedBy
							type
							website
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
	}

	detached() {
		if (this.props.router.params.accountId) {
			this._querySub.unsubscribe();
		}
	}

	render() {
		const {
			router
		} = this.props;

		const {
			account,
			loading
		} = this.state;

		const {
			accountId,
			entityId
		} = router.params;

		let accountView = router.params.accountView;

		if (accountId && (!accountView || !accountViewKeys.has(accountView))) {
			accountView = OVERVIEW;
		}

		return (
			<div class="account-container">
				<Sidebar
					key="sidebar"
					selected={locationsMap.ACCOUNTS}
				/>

				<div class="view-container">
					{!accountId && (
						<AccountIndex router={router} />
					)}

					{accountId && (
						<LoadingWrapper dataLoaded={!loading}>
							{account && (
								<Pageheader
									avatarHref={account.get(accountFields.WEBSITE) ? `//logo.clearbit.com/${account.get(accountFields.WEBSITE)}` : ''}
									label={Liferay.Language.get('account')}
									title={account.get(accountFields.NAME)}
									key="page_header"
								/>
							)}

							<Navbar
								href={`${window.Dossiera.URLS.HOST_URL}/accounts/${accountId}/{option}`}
								options={accountViewOptions}
								optionsMap={accountViewKeys}
								selected={accountView}
								key="navbar"
							/>

							{(accountView === OVERVIEW) && account && (
								<AccountOverview
									account={account}
									accountId={accountId}
									entityId={entityId}
									elementClasses="content"
									key="account_overview"
								/>
							)}

							{(accountView === PROJECTS) && (
								<AccountProjects
									account={account}
									accountId={accountId}
									entityId={entityId}
									elementClasses="full-width-content"
									key="account_projects"
								/>
							)}
						</LoadingWrapper>
					)}
				</div>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return nextState || checkIfPropsChanged(
			[
				'router'
			],
			nextProps
		);
	}
}

Account.PROPS = {
	router: Config.object().required()
};

Account.STATE = {
	account: Config.instanceOf(Map),
	loading: Config.bool().value(true)
};

export default Account;