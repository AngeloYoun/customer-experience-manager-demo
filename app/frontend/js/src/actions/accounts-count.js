import createBaseActions from 'actions/requests';

const controller = 'accounts-count';

const accountsCount = createBaseActions(
	{
		controller,
		name: 'ACCOUNTS_COUNT'
	}
);

const accountsQueryCount = createBaseActions(
	{
		controller,
		name: 'ACCOUNTS_QUERY_COUNT'
	}
);

const accountsCountActionTypes = accountsCount.actionTypes;

const accountsQueryCountActionTypes = accountsQueryCount.actionTypes;

const {
	get: getAccountsCount
} = accountsCount.actions;

const {
	get: getAccountsQueryCount
} = accountsQueryCount.actions;

export {
	accountsCountActionTypes,
	accountsQueryCountActionTypes,
	getAccountsCount,
	getAccountsQueryCount
};