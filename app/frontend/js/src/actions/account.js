import createBaseActions from 'actions/requests';

export const NAME = 'ACCOUNT';

const controller = 'account';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const {
	get,
	post
} = base.actions;

export {
	actionTypes,
	get as getAccount
};