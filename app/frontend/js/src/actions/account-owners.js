import createBaseActions from 'actions/requests';

export const NAME = 'ACCOUNT_OWNERS';

const controller = 'account-owners';

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
	get as getAccountOwners
};