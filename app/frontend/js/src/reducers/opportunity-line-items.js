import {actionTypes as opportunityLineItemsActionTypes} from 'actions/opportunity-line-items';
import {composeReducers} from 'lib/util';
import createBaseReducer from 'reducers/request-handler';

export default composeReducers(
	createBaseReducer(
		{
			actionTypes: opportunityLineItemsActionTypes,
			primaryKey: 'opportunityLineItems'
		}
	)
);