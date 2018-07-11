import createBaseActions from 'actions/requests';

export const NAME = 'PROJECTS';

const controller = 'projects';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const projectsActions = base.actions;

export {
	actionTypes,
	projectsActions
};