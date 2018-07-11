import createBaseActions from 'actions/requests';

export const NAME = 'TOUCHPOINTS';

const controller = 'touchpoints';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const touchpointsActions = base.actions;

export {
	actionTypes,
	touchpointsActions
};