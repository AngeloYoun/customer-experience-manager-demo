import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import Modal from 'components/modal/Modal';
import PlaceholderMessage from 'components/text-groups/PlaceholderMessage';
import UserInfo, {userInfoSizes} from 'components/user-info/UserInfo';
import fieldMap from 'lib/field-formats';
import {formatFields} from 'lib/util';
import emailIcon from 'resources/email-icon';
import externalLinkIcon from 'resources/external-link-icon';

const {
	ACTIVITY_CONTACT_FIRST_NAME,
	ACTIVITY_CONTACT_LAST_NAME,
	ACTIVITY_CREATED_BY,
	ACTIVITY_DATE,
	ACTIVITY_SUBJECT,
	DOSSIERA_ACTIVITY_DATE_TIME,
	DOSSIERA_DESCRIPTION,
	SALESFORCE_CONTACT_EMAIL,
	SALESFORCE_KEY
} = fieldMap;

class ActivityDetailsModal extends JSXComponent {
	render() {
		const {
			modalProps
		} = this.props;

		const activityData = modalProps.get('data');

		const formattedFields = formatFields(
			activityData,
			[
				ACTIVITY_CONTACT_FIRST_NAME,
				ACTIVITY_CONTACT_LAST_NAME,
				ACTIVITY_CREATED_BY,
				ACTIVITY_DATE,
				DOSSIERA_ACTIVITY_DATE_TIME,
				DOSSIERA_DESCRIPTION,
				SALESFORCE_CONTACT_EMAIL
			]
		);

		return (
			<Modal
				titleRenderer={this._titleRenderer}
				{...this.otherProps()}
			>
				<div class="activity-details-modal-container">
					<div class="scrolling-container">
						<div class="scrolling-content">
							{activityData.get(DOSSIERA_DESCRIPTION) ? (
								<h3 class="activity-description">
									{formattedFields[DOSSIERA_DESCRIPTION]}
								</h3>
							) : (
								<PlaceholderMessage
									message={Liferay.Language.get('this-activity-has-no-description')}
								/>
							)}
						</div>
					</div>

					<div class="fixed-info">
						<div class="info-item assigned-to">
							<h3 class="label">
								{Liferay.Language.get('assigned-to')}
							</h3>

							<UserInfo
								elementClasses="activity-owner"
								name={formattedFields[ACTIVITY_CREATED_BY]}
								size={userInfoSizes.LARGE}
							/>
						</div>

						<div class="info-item due-date">
							<h3 class="label">
								{Liferay.Language.get('date-created')}
							</h3>

							<h2 class="info">
								{Moment(
									activityData.get(ACTIVITY_DATE)
								).fromNow(false)}
							</h2>
						</div>

						<div class="info-item related-contact">
							<h3 class="label">
								{Liferay.Language.get('related-contact')}
							</h3>

							<h2 class="info">
								{`${formattedFields[ACTIVITY_CONTACT_FIRST_NAME]} ${formattedFields[ACTIVITY_CONTACT_LAST_NAME]}`}
							</h2>

							<h2 class="meta contact-email">
								{formattedFields[SALESFORCE_CONTACT_EMAIL]}
							</h2>
						</div>

						<a
							class="link-to-salesforce"
							href={`https://login.salesforce.com/${activityData.get(SALESFORCE_KEY)}`}
							target="_blank"
						>
							<h2 class="link-label">
								{Liferay.Language.get('go-to-salesforce')}
							</h2>

							{externalLinkIcon}
						</a>
					</div>
				</div>
			</Modal>
		);
	}

	_titleRenderer = () => (
		[
			<span class="modal-header-icon" key="icon">
				{emailIcon}
			</span>,
			this.props.modalProps.getIn(['data', ACTIVITY_SUBJECT])
		]
	)
}

ActivityDetailsModal.PROPS = {
	modalProps: Config.instanceOf(Map).required()
};

export default ActivityDetailsModal;