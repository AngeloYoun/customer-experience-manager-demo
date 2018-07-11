import {uniqueId} from 'lodash';

export const actionTypes = {
	CLOSE_ALERT: 'CLOSE_ALERT',
	SHOW_ALERT: 'SHOW_ALERT'
};

export const alertTypes = {
	ERROR: 'ERROR'
};

export function closeAlert(id) {
	return {
		id,
		type: actionTypes.CLOSE_ALERT
	};
}

export function showAlert({alertProps = {}, alertType, id = uniqueId()}) {
	alertProps.id = id;

	return {
		alertProps,
		alertType,
		id,
		type: actionTypes.SHOW_ALERT
	};
}