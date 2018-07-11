import createBaseActions from 'actions/requests';

export const NAME = 'OPPORTUNITIES';

const controller = 'opportunities';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const opportunitiesActions = base.actions;

export {
	actionTypes,
	opportunitiesActions
};