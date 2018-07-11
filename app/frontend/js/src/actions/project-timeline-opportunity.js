import createBaseActions from 'actions/requests';

export const NAME = 'PROJECT_TIMELINE_OPPORTUNITY';

const controller = 'project-timeline-opportunity';

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
	get as getProjectTimelineOpportunity
};