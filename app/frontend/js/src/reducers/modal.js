import {fromJS, Map} from 'immutable';

import {actionTypes} from 'actions/modal';
import {createReducer} from 'lib/util';

const actionHandlers = {
	[actionTypes.HIDE_MODAL]: state => {
		return fromJS(
			{
				active: false
			}
		);
	},
	[actionTypes.SHOW_MODAL]: (state, {modalProps, modalType}) => {
		return fromJS(
			{
				active: true,
				modalProps,
				modalType
			}
		);
	}
};

export default createReducer(Map(), actionHandlers);