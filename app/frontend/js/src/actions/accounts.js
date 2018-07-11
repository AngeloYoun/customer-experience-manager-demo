import createBaseActions from 'actions/requests';

export const NAME = 'ACCOUNTS';

const controller = 'accounts';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const accountsActions = base.actions;

export {
	actionTypes,
	accountsActions
};