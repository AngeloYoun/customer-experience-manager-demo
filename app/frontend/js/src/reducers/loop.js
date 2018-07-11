import {actionTypes as loopActionTypes} from 'actions/loop';
import {composeReducers} from 'lib/util';
import createBaseReducer from 'reducers/request-handler';

export default composeReducers(
	createBaseReducer(
		{
			actionTypes: loopActionTypes,
			primaryKey: 'loop'
		}
	)
);