import {fromJS, List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as PROJECTS} from 'actions/projects';
import Tag, {tagTypes} from 'components/tag/Tag';
import ActiveTag from 'components/tag/ActiveTag';
import Table from 'components/table/Table';
import fieldMap from 'lib/field-formats';
import {formatField} from 'lib/util';

const {
	[PROJECTS]: projectsFields
} = fieldMap;

const {
	PROJECT_LIFERAY_FEATURES_USED_ARRAY,
	PROJECT_NAME,
	PROJECT_PARTNER,
	PROJECT_SUBSCRIPTION_END_DATE,
	PROJECT_SUBSCRIPTION_LEVEL,
	PROJECT_SUBSCRIPTION_START_DATE,
	PROJECT_SUPPORT_REGION
} = fieldMap;

class ProjectsTable extends JSXComponent {
	render() {
		const {
			projects,
			renderProjectUrl
		} = this.props;

		return (
			<div class="projects-table-container">
				<Table
					columns={this._getColumnConfig()}
					defaultOrderByAscending={true}
					defaultOrderByColumnKey="subscription-term"
					noDataMessage={Liferay.Language.get('there-are-no-projects')}
					renderRowURL={renderProjectUrl}
					rowItems={projects}
				/>
			</div>
		);
	}

	_formatAndCompareLocale = key => (project1, project2) => {
		const region1 = project1.get(key);
		const region2 = project2.get(key);

		return region1.localeCompare(region2);
	}

	_getColumnConfig = () => fromJS(
		[
			{
				comparator: this._formatAndCompareLocale(projectsFields.NAME),
				key: 'name',
				label: Liferay.Language.get('name'),
				renderer: project => (
					<div>
						<h1>
							{project.get(projectsFields.NAME)}
						</h1>

						<h3 class="liferay-features-used">
							{formatField(project, PROJECT_LIFERAY_FEATURES_USED_ARRAY)}
						</h3>
					</div>
				)
			},
			{
				comparator: this._formatAndCompareLocale(projectsFields.PROJECT_LIFERAY_VERSION),
				key: 'product',
				label: Liferay.Language.get('product'),
				renderer: project => (
					<div>
						<h2 class="liferay-version">
							{project.get(projectsFields.LIFERAY_VERSION)}
						</h2>

						<div class="subscription-level">
							<Tag
								elementClasses="level"
								options={{level: formatField(project, PROJECT_SUBSCRIPTION_LEVEL)}}
								type={tagTypes.SUBSCRIPTION_LEVEL}
							/>
						</div>
					</div>
				)
			},
			{
				comparator: (project1, project2) => {
					return this._isSubscriptionActive(project1) && !this._isSubscriptionActive(project2) ? 1 : -1;
				},
				key: 'status',
				label: Liferay.Language.get('status'),
				renderer: project => (
					<ActiveTag status={this._isSubscriptionActive(project)} />
				)
			},
			{
				comparator: (project1, project2) => {
					const date1 = Moment(
						project1.get(projectsFields.SUBSCRIPTION_END_DATE) || 0
					);

					const date2 = Moment(
						project2.get(projectsFields.SUBSCRIPTION_END_DATE) || 0
					);

					return date1.valueOf() - date2.valueOf();
				},
				key: 'subscription-term',
				label: Liferay.Language.get('subscription-term'),
				renderer: project => {
					const subscriptionEnd = project.get(projectsFields.SUBSCRIPTION_END_DATE);
					const subscriptionStart = project.get(projectsFields.SUBSCRIPTION_START_DATE);

					let subscriptionTerm = '-';

					if (subscriptionEnd && subscriptionStart) {
						subscriptionTerm = `${Moment(subscriptionStart).format('MMM YYYY')} - ${Moment(subscriptionEnd).format('MMM YYYY')}`;
					}

					return (
						<h3>
							{subscriptionTerm}
						</h3>
					);
				}
			},
			{
				comparator: this._formatAndCompareLocale(PROJECT_PARTNER),
				key: 'partner',
				label: Liferay.Language.get('partner'),
				renderer: project => (
					<h2 class="liferay-version">
						{formatField(project, PROJECT_PARTNER)}
					</h2>
				)
			},
			{
				comparator: this._formatAndCompareLocale(PROJECT_SUPPORT_REGION),
				key: 'region',
				label: Liferay.Language.get('region'),
				renderer: project => (
					<h2 class="liferay-version">
						{formatField(project, PROJECT_SUPPORT_REGION)}
					</h2>
				)
			}
		]
	);

	_isSubscriptionActive = project => Moment().isBetween(
		project.get(projectsFields.SUBSCRIPTION_START_DATE),
		project.get(projectsFields.SUBSCRIPTION_END_DATE)
	)
}

ProjectsTable.PROPS = {
	projects: Config.instanceOf(List).required(),
	renderProjectUrl: Config.func().required()
};

export default ProjectsTable;