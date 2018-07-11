import createBaseActions from 'actions/requests';

export const NAME = 'PROJECT_OWNERS';

const controller = 'project-owners';

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
	get as getProjectOwners
};