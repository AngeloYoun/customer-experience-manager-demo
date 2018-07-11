import {actionTypes as contactsActionTypes} from 'actions/contacts';
import {composeReducers} from 'lib/util';
import createBaseReducer from 'reducers/request-handler';

export default composeReducers(
	createBaseReducer(
		{
			actionTypes: contactsActionTypes,
			primaryKey: 'contacts'
		}
	)
);