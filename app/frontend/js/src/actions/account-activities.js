import createBaseActions from 'actions/requests';

export const NAME = 'ACCOUNT_ACTIVITIES';

const controller = 'account-activities';

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
	get as getAccountActivities
};