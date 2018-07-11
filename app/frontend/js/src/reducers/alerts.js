import {fromJS, Map} from 'immutable';

import {actionTypes} from 'actions/alerts';
import {createReducer} from 'lib/util';

const actionHandlers = {
	[actionTypes.CLOSE_ALERT]: (state, {id}) => state.delete(id),
	[actionTypes.SHOW_ALERT]: (state, {alertProps, alertType, id}) => state.mergeDeep(
		fromJS(
			{
				[id]: {
					alertProps,
					alertType
				}
			}
		)
	)
};

export default createReducer(Map(), actionHandlers);