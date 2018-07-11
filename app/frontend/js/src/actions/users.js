import createBaseActions from 'actions/requests';

export const NAME = 'USERS';

const controller = 'users';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const usersActions = base.actions;

export {
	actionTypes,
	usersActions
};