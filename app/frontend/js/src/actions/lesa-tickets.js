import createBaseActions from 'actions/requests';

export const NAME = 'LESA_TICKETS';

const controller = 'lesa-tickets';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const lesaTicketsActions = base.actions;

export {
	actionTypes,
	lesaTicketsActions
};