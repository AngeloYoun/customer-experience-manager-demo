import {actionTypes as lesaTicketsActionTypes} from 'actions/lesa-tickets';
import {composeReducers} from 'lib/util';
import createBaseReducer from 'reducers/request-handler';

export default composeReducers(
	createBaseReducer(
		{
			actionTypes: lesaTicketsActionTypes,
			primaryKey: 'lesa-tickets'
		}
	)
);