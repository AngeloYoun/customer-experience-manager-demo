import createBaseActions from 'actions/requests';

export const NAME = 'LOGIN';

const controller = 'login';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = {
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',
	...base.actionTypes
};

const {
	post
} = base.actions;

const loginAction = ({username, password}) => {
	return post(
		{
			payload: {
				[`_${window.Dossiera.LOGIN_PORTLET_ID}_login`]: username,
				[`_${window.Dossiera.LOGIN_PORTLET_ID}_password`]: password
			},
			requestURL: `${window.Dossiera.URLS.LOGIN_URL}`
		}
	);
};

export function logout() {
	return {
		loggedIn: false,
		type: actionTypes.LOGOUT
	};
}

export function login() {
	return {
		loggedIn: true,
		type: actionTypes.LOGIN
	};
}

export {
	actionTypes,
	loginAction as postLogin
};