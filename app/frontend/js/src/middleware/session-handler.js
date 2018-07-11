import {debounce} from 'lodash';

import {actionTypes as loginActionTypes, login, logout} from 'actions/login';
import {hideModal, modalTypes, showModal} from 'actions/modal';
import {CALL_API} from 'middleware/api';

const LOCAL_STORAGE_LOGGED_IN = '1';

const LOCAL_STORAGE_LOGGED_OUT = '0';

const LOGGED_IN_LOCAL_STORAGE_KEY = 'dossieraLoggedIn';

const SECOND = 1000;

let failedActions = [];

let loginPollerId;
let logoutPollerId;

const sessionHandlerMap = {
	[loginActionTypes.LOGIN]: (next, store) => {
		next(
			hideModal()
		);

		Liferay.Session = createLiferaySession(Liferay.Session, Liferay.SessionBase);

		window.clearTimeout(loginPollerId);

		window.localStorage.setItem(LOGGED_IN_LOCAL_STORAGE_KEY, LOCAL_STORAGE_LOGGED_IN);

		logoutPollerId = pollForLogout(store);

		failedActions.map(
			action => store.dispatch(
				{
					[CALL_API]: action.CALL_API
				}
			)
		);

		failedActions = [];
	},
	[loginActionTypes.LOGOUT]: (next, store) => {
		next(
			showModal(
				{
					modalType: modalTypes.LOGIN
				}
			)
		);

		destroyLiferaySession(Liferay.Session);

		window.clearTimeout(logoutPollerId);

		window.localStorage.setItem(LOGGED_IN_LOCAL_STORAGE_KEY, LOCAL_STORAGE_LOGGED_OUT);

		loginPollerId = pollForLogin(store);
	}
};

const extendSession = debounce(
	() => {
		if (Liferay.Session) {
			Liferay.Session.extend();
		}
	},
	SECOND * 60,
	{
		leading: true,
		trailing: true
	}
);

const pollForLogin = store => window.setTimeout(
	() => {
		if (window.localStorage.getItem(LOGGED_IN_LOCAL_STORAGE_KEY) === LOCAL_STORAGE_LOGGED_IN) {
			handleLogin(store);
		}
		else {
			pollForLogin(store);
		}
	},
	5 * SECOND
);

const pollForLogout = store => window.setTimeout(
	() => {
		if (window.localStorage.getItem(LOGGED_IN_LOCAL_STORAGE_KEY) === LOCAL_STORAGE_LOGGED_OUT) {
			handleLogout(store);
		}
		else {
			pollForLogout(store);
		}
	},
	10 * SECOND
);

export function handleLogin(store) {
	let retVal;

	if (!store.getState().getIn(['login', 'loggedIn'])) {
		retVal = store.dispatch(
			login()
		);
	}

	return retVal;
}

export function handleLogout(store, action) {
	let retVal;

	if (action) {
		failedActions.push(action);
	}

	if (store.getState().getIn(['login', 'loggedIn'])) {
		retVal = store.dispatch(
			logout()
		);
	}

	return retVal;
}

export function sessionStartup(router, store) {
	window.localStorage.setItem(LOGGED_IN_LOCAL_STORAGE_KEY, LOCAL_STORAGE_LOGGED_IN);

	// Liferay.on(
	// 	'sessionExpired',
	// 	() => handleLogout(store)
	// );

	router.on(
		'startNavigate',
		extendSession
	);

	logoutPollerId = pollForLogout(store);
}

export default store => next => action => {
	extendSession();

	if (sessionHandlerMap.hasOwnProperty(action.type)) {
		sessionHandlerMap[action.type](next, store);
	}

	return next(action);
};

function createLiferaySession(liferaySession, liferaySessionBase) {
	let newSession;

	if (liferaySession) {
		const {
			autoExtend,
			redirectOnExpire,
			redirectUrl,
			sessionLength,
			warningLength
		} = liferaySession.getAttrs();

		newSession = new liferaySessionBase(
			{
				autoExtend,
				redirectOnExpire,
				redirectUrl,
				sessionLength: sessionLength / SECOND,
				warningLength: warningLength / SECOND
			}
		);
	}

	return newSession;
}

function destroyLiferaySession(liferaySession) {
	if (liferaySession) {
		liferaySession.expire();

		if (liferaySession.display) {
			liferaySession.display._getBanner().remove();

			liferaySession.display.destroy();
		}

		liferaySession.destroy();
	}
}