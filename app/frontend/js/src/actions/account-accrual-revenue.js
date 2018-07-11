import createBaseActions from 'actions/requests';

export const NAME = 'ACCOUNT_ACCRUAL_REVENUE';

const controller = 'account-accrual-revenue';

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
	get as getAccountAccrualRevenue
};