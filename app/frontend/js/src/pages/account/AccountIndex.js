import JSXComponent, {Config} from 'metal-jsx';
import {fromJS, List, Map} from 'immutable';
import {isNil} from 'lodash';
import gql from 'graphql-tag';
import Moment from 'moment';

import {accountsActions, NAME as ACCOUNTS} from 'actions/accounts';
import Pageheader from 'components/page-header/PageHeader';
import Avatar from 'components/avatar/Avatar';
import Sidebar, {locationsMap} from 'components/sidebar/Sidebar';
import Navbar from 'components/navbar/Navbar';
import LoadingWrapper from 'components/wrappers/LoadingWrapper';
import searchIcon from 'resources/search-icon';
import {checkIfPropsChanged, getInitials} from 'lib/util';
import AccountHeader from 'pages/account/AccountHeader';
import Table from 'components/table/Table';
import TextInput from 'components/inputs/TextInput';
import AccountOverview from 'pages/account/overview';
import AccountProjects from 'pages/account/projects';
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

class AccountIndex extends JSXComponent {
	created() {
		const {
			router
		} = this.props;

		const {
			accountId
		} = router.params;

		window.document.title = `Dossiera - Accounts`

		this._query = window.Dossiera.apollo.watchQuery({
			query: gql(
				`query AccountIndex ($name: String, $industry: String, $limit: Int, $offset: Int) {
					accounts(name: $name, industry: $industry, limit: $limit, offset: $offset) {
						${accountFields.NAME}
						${accountFields.ID}
						${accountFields.INDUSTRY}
						${accountFields.LAST_MODIFIED_DATE}
						${accountFields.HAS_ACTIVE_SUBSCRIPTION}
						${accountFields.TYPE}
						${accountFields.WEBSITE}
					}
				}`
			),
			variables: {
				name: '',
				industry: '',
				limit: 20,
				offset: 0
			}
		});

		this._querySub = this._query.subscribe({
			next: ({data}) => {
				this.setState(
					{
						accounts: fromJS(data.accounts),
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
			router
		} = this.props;

		const {
			accounts,
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
			<div class="account-index-container">
				<div class="list-header page-header">
					<h1 class="page-title">
						{Liferay.Language.get('accounts')}
					</h1>

					<div class="list-search">
						{searchIcon}

						<TextInput
							autofocus={true}
							elementClasses="filter"
							initialValue={''}
							onChange={this._handleFilterChange}
							placeholder={Liferay.Language.get('search')}
						/>
					</div>
				</div>

					<Table
						elementClasses="accounts-table-container"
						columns={this._getColumnConfig()}
						defaultOrderByAscending={true}
						defaultOrderByColumnKey="last-modified"
						noDataMessage={Liferay.Language.get('there-are-no-accounts')}
						renderRowURL={account => `${window.Dossiera.URLS.HOST_URL}/accounts/${account.get(accountFields.ID)}`}
						rowItems={accounts}
					/>
			</div>
		);
	}

	_getColumnConfig = () => fromJS(
		[
			{
				key: 'avatar',
				renderer: account => (
					<Avatar
						elementClasses="header-avatar"
						content={getInitials(account.get(accountFields.NAME))}
						href={account.get(accountFields.WEBSITE) ? `//logo.clearbit.com/${account.get(accountFields.WEBSITE)}` : ''}
						{...this.otherProps()}
					/>
				)
			},
			{
				key: 'name',
				label: Liferay.Language.get('name'),
				renderer: account => (
					<div class="title">
						<h1 class="account-name">
							{account.get(accountFields.NAME)}
						</h1>

						<h3 class="account-type">
							{account.get(accountFields.TYPE)}
						</h3>
					</div>
				)
			},
			{
				key: 'last-modified',
				comparator: (account1, account2) => {
					const date1 = Moment(
						account1.get(accountFields.LAST_MODIFIED_DATE) || 0
					);

					const date2 = Moment(
						account2.get(accountFields.LAST_MODIFIED_DATE) || 0
					);

					return date1.valueOf() - date2.valueOf();
				},
				label: Liferay.Language.get('last-modified'),
				renderer: account => (
					<h3 class="last-modified">
						{Moment(account.get(accountFields.LAST_MODIFIED_DATE)).fromNow()}
					</h3>
				)
			}
		]
	);

	_handleFilterChange = value => {
		this._query.refetch({name: value})
	}
}

AccountIndex.PROPS = {
	router: Config.object().required()
};

AccountIndex.STATE = {
	accounts: Config.instanceOf(List).value(List()),
	loading: Config.bool().value(true)
};

export default AccountIndex;