import {alertTypes, showAlert} from 'actions/alerts';
import {handleLogout} from 'middleware/session-handler';

const DEFAULT_STATUS = 'default';

const ERROR_ALERT_ID = 'errorAlert';

const pathToAlertErrors = ['alerts', ERROR_ALERT_ID, 'alertProps', 'errors'];

const errorHandlerMap = {
	[401]: ({action, next, store}) => handleLogout(store, action),
	[DEFAULT_STATUS]: ({action, next, store}) => next(
		showAlert(
			{
				alertProps: {
					errors: [
						action.error.message,
						...store.getState().getIn(pathToAlertErrors) || []
					]
				},
				alertType: alertTypes.ERROR,
				id: ERROR_ALERT_ID
			}
		)
	)
};

export default store => next => action => {
	const actionTypeStatus = action.type.split('_').pop();

	if (actionTypeStatus === 'FAILURE') {
		const error = action.error;

		const status = errorHandlerMap.hasOwnProperty(error.status) ? error.status : DEFAULT_STATUS;

		errorHandlerMap[status](
			{
				action,
				next,
				store
			}
		);
	}

	return next(action);
};