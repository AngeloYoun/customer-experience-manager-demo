import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {hideModal, modalTypes} from 'actions/modal';
import ActivityDetailsModal from 'components/modal/ActivityDetailsModal';
import CreateModal from 'components/modal/CreateModal';
import LoginModal from 'components/modal/LoginModal';
import UserListModal from 'components/modal/UserListModal';

const modalTypeMap = {
	[modalTypes.ACTIVITY_DETAILS]: ActivityDetailsModal,
	[modalTypes.CREATE]: CreateModal,
	[modalTypes.LOGIN]: LoginModal,
	[modalTypes.USER_LIST]: UserListModal
};

class ModalHandler extends JSXComponent {
	render() {
		const {
			active,
			hideModal,
			modalProps,
			modalType
		} = this.props;

		const documentBody = document.body;
		const ModalComponent = modalTypeMap[modalType];

		if (active) {
			documentBody.classList.add('modal-global-open');

			if (documentBody.clientHeight > window.innerHeight) {
				documentBody.classList.add('modal-global-scrollbar');
			}

			if (modalType === modalTypes.LOGIN) {
				documentBody.classList.add('modal-blur');
			}
		}
		else {
			documentBody.classList.remove('modal-blur');
			documentBody.classList.remove('modal-global-open');
			documentBody.classList.remove('modal-global-scrollbar');
		}

		return (
			<div class="modal-handler-container">
				{active &&
					<ModalComponent
						hideModal={hideModal}
						modalProps={modalProps}
					/>
				}
			</div>
		);
	}
}

ModalHandler.PROPS = {
	active: Config.value(false),
	modalProps: Config.instanceOf(Map),
	modalType: Config.string()
};

export default connect(
	state => {
		const modalState = fromJS(state.modal || {});

		return {
			active: modalState.get('active'),
			modalProps: modalState.get('modalProps'),
			modalType: modalState.get('modalType')
		}
	},
	{
		hideModal
	}
)(ModalHandler);