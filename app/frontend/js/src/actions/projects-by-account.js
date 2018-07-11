import createBaseActions from 'actions/requests';

export const NAME = 'PROJECTS';

const controller = 'projects-by-account';

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
	get as getProjectsByAccount
};