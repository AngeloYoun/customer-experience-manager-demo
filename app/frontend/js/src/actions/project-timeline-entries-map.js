import createBaseActions from 'actions/requests';

export const NAME = 'PROJECT_TIMELINE_ENTRIES_MAP';

const controller = 'project-timeline-entries-map';

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
	get as getProjectTimelineEntriesMap
};