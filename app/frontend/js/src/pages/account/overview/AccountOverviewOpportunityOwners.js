import {List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {modalTypes, showModal} from 'actions/modal';
import ActionButton from 'components/buttons/ActionButton';
import ListComponent from 'components/list/List';
import PlaceholderMessage from 'components/text-groups/PlaceholderMessage';
import UserInfo from 'components/user-info/UserInfo';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {formatFields, subLanguageKey} from 'lib/util';

const {
	DOSSIERA_TYPE,
	USER_AVATAR,
	USER_EMAIL,
	USER_FIRST_NAME,
	USER_LAST_NAME
} = fieldMap;

const {
	ACCOUNT_OWNER_TYPE
} = fieldValue;

const BUTTON_PLACEHOLDER = 'BUTTON_PLACEHOLDER';

class AccountOverviewOpportunityOwners extends JSXComponent {
	render() {
		const {
			associatedUsers
		} = this.props;

		let opportunityOwners = associatedUsers.filter(
			item => item.get(DOSSIERA_TYPE) === ACCOUNT_OWNER_TYPE.OPPORTUNITY
		);

		const opportunityOwnerCount = opportunityOwners.size;

		if (opportunityOwnerCount > 4) {
			opportunityOwners = opportunityOwners.slice(0, 4);

			opportunityOwners = opportunityOwners.push(BUTTON_PLACEHOLDER);
		}

		return (
			<div class="account-overview-opportunity-owners-container">
				{(opportunityOwners && opportunityOwners.size) ? (
					<ListComponent
						itemRenderer={this._renderEntry}
						listItems={opportunityOwners}
					/>
				) : (
					<PlaceholderMessage
						message={Liferay.Language.get('there-are-no-opportunities')}
					/>
				)}
			</div>
		);
	}

	_getOpportunityOwners = associatedUsers => {
		const opportunityOwners = [];

		associatedUsers.forEach(
			item => {
				if (item.get(DOSSIERA_TYPE) === ACCOUNT_OWNER_TYPE.OPPORTUNITY) {
					opportunityOwners.push(item);
				}
			}
		);

		return opportunityOwners;
	}

	_handleViewAll = () => {
		const {
			associatedUsers,
			showModal
		} = this.props;

		const opportunityOwners = this._getOpportunityOwners(associatedUsers);

		showModal(
			{
				data: opportunityOwners
			},
			modalTypes.USER_LIST
		);
	}

	_renderEntry = ({index, itemData}) => {
		const {
			associatedUsers
		} = this.props;

		const opportunityOwners = this._getOpportunityOwners(associatedUsers);

		const renderedComponent = [];

		if (itemData === BUTTON_PLACEHOLDER) {
			renderedComponent.push(
				<ActionButton
					buttonLabel={subLanguageKey(
						Liferay.Language.get('view-all-x-owners'),
						[opportunityOwners.length]
					)}
					elementClasses="view-all-button"
					key={index}
					onClick={this._handleViewAll}
				/>
			);
		}
		else {
			const formattedFields = formatFields(
				itemData,
				[
					USER_FIRST_NAME,
					USER_LAST_NAME,
					USER_EMAIL
				]
			);

			renderedComponent.push(
				<UserInfo
					avatarHref={itemData.get(USER_AVATAR)}
					elementClasses="opportunity-owner"
					key={index}
					name={`${formattedFields[USER_FIRST_NAME]} ${formattedFields[USER_LAST_NAME]}`}
					secondary={formattedFields[USER_EMAIL]}
				/>
			);
		}

		return renderedComponent;
	}
}

AccountOverviewOpportunityOwners.PROPS = {
	associatedUsers: Config.instanceOf(List).required(),
	showModal: Config.func()
};

function mapDispatchToProps(dispatch) {
	return {
		showModal: (modalProps, modalType) => {
			dispatch(
				showModal(
					{
						modalProps,
						modalType
					}
				)
			);
		}
	};
}

export default connect(
	null,
	mapDispatchToProps
)(AccountOverviewOpportunityOwners);