import createBaseActions from 'actions/requests';

export const NAME = 'ACCOUNT_STATISTICS';

const controller = 'account-statistics';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const {
	get
} = base.actions;

export {
	actionTypes,
	get as getAccountStatistics
};