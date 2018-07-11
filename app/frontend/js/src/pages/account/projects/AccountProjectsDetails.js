import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as PROJECTS} from 'actions/projects';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {formatFields, getPluralMessage} from 'lib/util';

const {
	[ACCOUNTS]: accountsFields,
	[PROJECTS]: projectsFields
} = fieldMap;

const {
	PROJECT_CMS_ARRAY,
	PROJECT_CRM_ARRAY,
	PROJECT_DESCRIPTION,
	PROJECT_FIRST_LINE_SUPPORT,
	PROJECT_HOSTING,
	PROJECT_IDENTITY_MANAGEMENT,
	PROJECT_INTEGRATED_TECHNOLOGIES_ARRAY,
	PROJECT_LIFERAY_FEATURES_USED_ARRAY,
	PROJECT_LIFERAY_VERSION,
	PROJECT_MOBILE_SOLUTION_ARRAY,
	PROJECT_SEARCH_ARRAY,
	PROJECT_SOLUTION_TYPE_ARRAY,
	PROJECT_STAGING,
	PROJECT_SUBSCRIPTION_END_LOCAL_DATE,
	PROJECT_SUBSCRIPTION_START_LOCAL_DATE,
	PROJECT_USERS_CONCURRENT,
	PROJECT_USERS_TOTAL
} = fieldMap;

const {
	PROJECT_FIRST_LINE_SUPPORT: {
		YES
	}
} = fieldValue;

class AccountProjectsDetails extends JSXComponent {
	created() {
		const {
			account,
			project
		} = this.props;

		window.document.title = `${account.get(accountsFields.NAME)} - ${project.get(projectsFields.NAME)}`
	}

	render() {
		const {
			project
		} = this.props;

		const inputKeys = [
			PROJECT_CMS_ARRAY,
			PROJECT_CRM_ARRAY,
			PROJECT_HOSTING,
			PROJECT_IDENTITY_MANAGEMENT,
			PROJECT_INTEGRATED_TECHNOLOGIES_ARRAY,
			PROJECT_MOBILE_SOLUTION_ARRAY,
			PROJECT_SEARCH_ARRAY,
			PROJECT_STAGING
		];

		const technicalInfoFields = formatFields(project, inputKeys);

		const labels = {
			[PROJECT_CMS_ARRAY]: Liferay.Language.get('cms'),
			[PROJECT_CRM_ARRAY]: Liferay.Language.get('crm'),
			[PROJECT_HOSTING]: Liferay.Language.get('hosting'),
			[PROJECT_IDENTITY_MANAGEMENT]: Liferay.Language.get('identity-management'),
			[PROJECT_INTEGRATED_TECHNOLOGIES_ARRAY]: Liferay.Language.get('integrated-technologies'),
			[PROJECT_MOBILE_SOLUTION_ARRAY]: Liferay.Language.get('mobile-solution'),
			[PROJECT_SEARCH_ARRAY]: Liferay.Language.get('search'),
			[PROJECT_STAGING]: Liferay.Language.get('staging')
		};

		const formattedFields = formatFields(
			project,
			[
				PROJECT_FIRST_LINE_SUPPORT,
				PROJECT_LIFERAY_FEATURES_USED_ARRAY,
				PROJECT_LIFERAY_VERSION,
				PROJECT_SOLUTION_TYPE_ARRAY,
				PROJECT_SUBSCRIPTION_END_LOCAL_DATE,
				PROJECT_SUBSCRIPTION_START_LOCAL_DATE,
				PROJECT_USERS_CONCURRENT,
				PROJECT_USERS_TOTAL
			]
		);

		const subscriptionEndLocalDate = project.get(PROJECT_SUBSCRIPTION_END_LOCAL_DATE);
		const subscriptionStartLocalDate = project.get(PROJECT_SUBSCRIPTION_START_LOCAL_DATE);

		const subscriptionTermLeft = Math.round(Moment(subscriptionEndLocalDate).diff(subscriptionStartLocalDate, 'years', true) * 10) / 10;
		const subscriptionTermString = `${Moment(subscriptionStartLocalDate).format('MMM YYYY')} - ${Moment(subscriptionEndLocalDate).format('MMM YYYY')}`;

		return (
			<div class="account-projects-details-container">
				<div class="content-section section-1-1">
					<div class="header">
						<div class="title">
							<h2 class="solution-type">
								{formattedFields[PROJECT_SOLUTION_TYPE_ARRAY]}
							</h2>

							<div class="liferay-info">
								<h2 class="liferay-version">
									{formattedFields[PROJECT_LIFERAY_VERSION]}
								</h2>

								<h3 class="liferay-features">
									{formattedFields[PROJECT_LIFERAY_FEATURES_USED_ARRAY]}
								</h3>
							</div>

							<div class="meta-info">
								{(formattedFields[PROJECT_FIRST_LINE_SUPPORT] === YES) &&
									<div class="first-line-support">
										<h5 class="first-line-support-label">{Liferay.Language.get('partner-first-line-support')}</h5>
									</div>
								}

								<div class="info-item">
									<h4 class="label">{Liferay.Language.get('users-total-concurrent')}</h4>

									<h4 class="info">{`${formattedFields[PROJECT_USERS_TOTAL]} / ${formattedFields[PROJECT_USERS_CONCURRENT]}`}</h4>
								</div>
							</div>
						</div>

						<div class="info-item project-description">
							<h3 class="label">
								{Liferay.Language.get('project-description')}
							</h3>

							<h3 class="info">
								{formatFields(project, [PROJECT_DESCRIPTION])[PROJECT_DESCRIPTION]}
							</h3>
						</div>
					</div>

					<div class="project-details">
						<div class="project-info">
							<div class="info-item subscription-term">
								<h3 class="label">
									{Liferay.Language.get('subscription-term')}
								</h3>

								<h2 class="info">
									{subscriptionTermString}
								</h2>

								<h3 class="info subscription-term-left">
									{getPluralMessage(
										Liferay.Language.get('x-more-year'),
										Liferay.Language.get('x-more-years'),
										subscriptionTermLeft
									)}
								</h3>
							</div>
						</div>

						<div class="technical-info">
							{this._renderInfoItems(technicalInfoFields, inputKeys, labels)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	_renderInfoItems = (data, keys, labels) => {
		return keys.map(
			key => {
				return [
					<div class="info-item" key={key}>
						<h4 class="label">
							{labels[key]}
						</h4>

						<h4 class="info">
							{data[key]}
						</h4>
					</div>
				];
			}
		);
	}
}

AccountProjectsDetails.PROPS = {
	project: Config.instanceOf(Map).required()
};

export default AccountProjectsDetails;