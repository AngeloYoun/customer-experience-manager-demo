import createBaseActions from 'actions/requests';

export const NAME = 'PROJECT_SUBSCRIPTIONS';

const controller = 'project-subscriptions';

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
	get as getProjectSubscriptions
};