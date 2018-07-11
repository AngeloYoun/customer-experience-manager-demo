import createBaseActions from 'actions/requests';

export const NAME = 'PROJECT';

const controller = 'project';

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
	get as getProject
};