import {actionTypes as touchpointsActionTypes} from 'actions/touchpoints';
import {composeReducers} from 'lib/util';
import createBaseReducer from 'reducers/request-handler';

export default composeReducers(
	createBaseReducer(
		{
			actionTypes: touchpointsActionTypes,
			primaryKey: 'touchpoints'
		}
	)
);