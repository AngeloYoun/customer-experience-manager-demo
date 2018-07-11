import {setWith} from 'lodash';

import {actionTypes as accountsActionTypes} from 'actions/accounts';
import {actionTypes as contactsActionTypes} from 'actions/contacts';
import {actionTypes as lesaTicketsActionTypes} from 'actions/lesa-tickets';
import {actionTypes as loopActionTypes} from 'actions/loop';
import {actionTypes as opportunitiesActionTypes} from 'actions/opportunities';
import {actionTypes as opportunityLineItemsActionTypes} from 'actions/opportunity-line-items';
import {actionTypes as projectsActionTypes} from 'actions/projects';
import {actionTypes as touchpointsActionTypes} from 'actions/touchpoints';
import {actionTypes as usersActionTypes} from 'actions/users';

const normalize = ({response: {data, parameters}}, entityKey) => (
	{
		[entityKey]: parameters.path ? (
			setWith({}, parameters.path, data)
		) : (
			data.reduce(
				(accum, entity) => (
					{
						[entity.id]: entity,
						...accum
					}
				),
				{}
			)
		)
	}
);

const actionMap = {
	[accountsActionTypes.GET_SUCCESS]: action => normalize(action, 'accounts'),
	[contactsActionTypes.GET_SUCCESS]: action => normalize(action, 'contacts'),
	[lesaTicketsActionTypes.GET_SUCCESS]: action => normalize(action, 'lesa-tickets'),
	[loopActionTypes.GET_SUCCESS]: ({response: {data}}) => (
		{
			loop: {
				[data.emailAddress]: data
			}
		}
	),
	[opportunitiesActionTypes.GET_SUCCESS]: action => normalize(action, 'opportunities'),
	[opportunitiesActionTypes.PATCH_SUCCESS]: ({response: {data, parameters}}) => {console.log('fire'); return (
		{
			opportunities: {
				[parameters.path[0]]: parameters.payload
			}
		}
	)},
	[opportunityLineItemsActionTypes.GET_SUCCESS]: action => normalize(action, 'opportunityLineItems'),
	[projectsActionTypes.GET_SUCCESS]: action => normalize(action, 'projects'),
	[touchpointsActionTypes.GET_SUCCESS]: action => normalize(action, 'touchpoints'),
	[touchpointsActionTypes.POST_SUCCESS]: ({response: {data}}) => (
		{
			touchpoints: {
				[data.id]: data
			}
		}
	),
	[usersActionTypes.GET_SUCCESS]: action => normalize(action, 'users')
};

export default store => next => action => {
	if (actionMap.hasOwnProperty(action.type)) {
		action = {
			normalized: actionMap[action.type](action),
			...action
		};
	}

	return next(action);
};