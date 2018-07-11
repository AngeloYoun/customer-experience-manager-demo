import createBaseActions from 'actions/requests';

export const NAME = 'ACCOUNT_TIMELINE_ENTRIES';

const controller = 'account-timeline-entries';

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
	get as getAccountTimelineEntries
};