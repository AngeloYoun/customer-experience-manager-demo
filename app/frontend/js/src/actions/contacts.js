import createBaseActions from 'actions/requests';

export const NAME = 'CONTACTS';

const controller = 'contacts';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const contactsActions = base.actions;

export {
	actionTypes,
	contactsActions
};