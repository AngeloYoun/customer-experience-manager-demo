import createBaseActions from 'actions/requests';

export const NAME = 'PROJECT_STATISTICS';

const controller = 'project-statistics';

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
	get as getProjectStatistics
};