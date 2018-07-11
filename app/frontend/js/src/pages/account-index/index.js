import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {getAccounts} from 'actions/accounts';
import {getAccountsCount, getAccountsQueryCount} from 'actions/accounts-count';
import PageHeader from 'components/page-header/PageHeader';
import AccountIndexList from 'pages/account-index/AccountIndexList';

class AccountIndex extends JSXComponent {
	attached() {
		this.props.getAccountsCount();
	}

	render() {
		const {
			accounts,
			accountsCount,
			accountsQueryCount,
			accountsResults,
			getAccounts,
			getAccountsQueryCount,
			loadingAccounts,
			router
		} = this.props;

		const match = router.currentUrl.match(/\?query=(.*)/);

		const query = match ? decodeURIComponent(match[1]) : '';

		const logoutLink = (
			<a
				class="info link"
				href={window.Dossiera.URLS.LOGOUT_URL}
			>
				{Liferay.Language.get('logout')}
			</a>
		);

		const info = fromJS(
			[
				{
					value: logoutLink
				}
			]
		);

		return (
			<div class="account-index-container">
				<PageHeader
					info={info}
				/>

				<AccountIndexList
					accounts={accounts}
					accountsCount={accountsCount}
					accountsQueryCount={accountsQueryCount}
					accountsResults={accountsResults}
					getAccounts={getAccounts}
					getAccountsQueryCount={getAccountsQueryCount}
					loading={loadingAccounts}
					query={query}
				/>
			</div>
		);
	}
}

AccountIndex.PROPS = {
	accounts: Config.instanceOf(Map)
};

function mapStateToProps(state) {
	return {
		accounts: state.getIn(['accounts', 'data']),
		accountsCount: state.getIn(['accountsQuery', 'data', 'count']),
		accountsQueryCount: state.getIn(['accountsQuery', 'data', 'queryCount']),
		accountsResults: state.getIn(['accountsQuery', 'data', 'queryResult']),
		loadingAccounts: state.getIn(['accounts', 'loadingAccounts'])
	};
}

export default connect(
	mapStateToProps,
	{
		getAccounts,
		getAccountsCount,
		getAccountsQueryCount
	}
)(AccountIndex);