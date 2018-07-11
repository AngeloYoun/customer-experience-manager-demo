export const actionTypes = {
	HIDE_MODAL: 'HIDE_MODAL',
	SHOW_MODAL: 'SHOW_MODAL'
};

export const modalTypes = {
	ACTIVITY_DETAILS: 'ACTIVITY_DETAILS',
	CREATE: 'CREATE',
	LOGIN: 'LOGIN',
	USER_LIST: 'USER_LIST'
};

export function showModal({modalProps, modalType}) {
	return {
		modalProps,
		modalType,
		type: actionTypes.SHOW_MODAL
	};
}

export function hideModal() {
	return {
		type: actionTypes.HIDE_MODAL
	};
}