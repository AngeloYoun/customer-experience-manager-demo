import {actionTypes as projectsActionTypes} from 'actions/projects';
import {composeReducers} from 'lib/util';
import createBaseReducer from 'reducers/request-handler';

export default composeReducers(
	createBaseReducer(
		{
			actionTypes: projectsActionTypes,
			primaryKey: 'projects'
		}
	)
);