import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import List from 'components/list/List';
import Modal from 'components/modal/Modal';
import UserInfo from 'components/user-info/UserInfo';
import fieldMap from 'lib/field-formats';
import {formatFields} from 'lib/util';

const {
	USER_AVATAR,
	USER_EMAIL,
	USER_FIRST_NAME,
	USER_LAST_NAME
} = fieldMap;

class UserListModal extends JSXComponent {
	render() {
		const {
			modalProps
		} = this.props;

		const userList = modalProps.get('data');

		return (
			<Modal
				titleRenderer={this._titleRenderer}
				{...this.otherProps()}
			>
				<div class="user-list-modal-container">
					<List
						elementClasses="user-list"
						itemCount={userList.size}
						itemRenderer={this._renderEntry}
						listItems={userList}
					/>
				</div>
			</Modal>
		);
	}

	_renderEntry = ({index, itemData}) => {
		const formattedFields = formatFields(
			itemData,
			[
				USER_FIRST_NAME,
				USER_LAST_NAME,
				USER_EMAIL
			]
		);

		return [
			<UserInfo
				avatarHref={itemData.get(USER_AVATAR)}
				elementClasses="opportunity-owner"
				key={index}
				name={`${formattedFields[USER_FIRST_NAME]} ${formattedFields[USER_LAST_NAME]}`}
				secondary={formattedFields[USER_EMAIL]}
			/>
		];
	}

	_titleRenderer = () => {
		const {
			modalProps
		} = this.props;

		return `${Liferay.Language.get('opportunity-owners')} (${modalProps.get('data').size})`;
	};
}

UserListModal.PROPS = {
	modalProps: Config.instanceOf(Map).required()
};

export default UserListModal;