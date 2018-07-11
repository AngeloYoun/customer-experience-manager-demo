import createBaseActions from 'actions/requests';

export const NAME = 'LOOP';

const controller = 'loop';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const loopActions = base.actions;

export {
	actionTypes,
	loopActions
};