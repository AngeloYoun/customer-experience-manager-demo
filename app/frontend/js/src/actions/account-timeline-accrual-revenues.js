import createBaseActions from 'actions/requests';

export const NAME = 'ACCOUNT_TIMELINE_ACCRUAL_REVENUES';

const controller = 'account-timeline-accrual-revenues';

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
	get as getAccountTimelineAccrualRevenues
};