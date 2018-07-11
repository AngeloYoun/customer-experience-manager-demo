import createBaseActions from 'actions/requests';

const controller = 'account-opportunities';

const accountNewDeals = createBaseActions(
	{
		controller,
		name: 'ACCOUNT_NEW_DEALS'
	}
);

const accountOpportunities = createBaseActions(
	{
		controller,
		name: 'ACCOUNT_OPPORTUNITIES'
	}
);

const accountNewDealsActionTypes = accountNewDeals.actionTypes;

const accountOpportunitiesActionTypes = accountOpportunities.actionTypes;

const {
	get: getAccountNewDeals
} = accountNewDeals.actions;

const {
	get: getAccountOpportunities
} = accountOpportunities.actions;

export {
	accountNewDealsActionTypes,
	accountOpportunitiesActionTypes,
	getAccountNewDeals,
	getAccountOpportunities
};