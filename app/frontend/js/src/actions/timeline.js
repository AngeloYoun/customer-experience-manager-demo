export const actionTypes = {
	SET_TIMELINE_FILTER: 'SET_TIMELINE_FILTER'
};

export const timelineTypes = {
	OPPORTUNITY_TIMELINE: 'OPPORTUNITY_TIMELINE'
};

export function setTimelineFilter({filter, id}) {
	return {
		filter,
		id,
		type: actionTypes.SET_TIMELINE_FILTER
	};
}