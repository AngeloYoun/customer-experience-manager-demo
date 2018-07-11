import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import PageHeader from 'components/page-header/PageHeader';
import fieldMap from 'lib/field-formats';
import {formatFields} from 'lib/util';

const {
	ACCOUNT_NAME,
	PROJECT_LIFERAY_VERSION,
	PROJECT_NAME,
	PROJECT_SOLUTION_TYPE_ARRAY,
	PROJECT_SUBSCRIPTION_END_LOCAL_DATE,
	PROJECT_SUBSCRIPTION_START_LOCAL_DATE
} = fieldMap;

class ProjectHeader extends JSXComponent {
	render() {
		const {
			account,
			accountId,
			project
		} = this.props;

		let currentLocation;
		let info;
		let path;

		if (project) {
			const formattedFields = formatFields(
				project,
				[
					PROJECT_LIFERAY_VERSION,
					PROJECT_NAME,
					PROJECT_SOLUTION_TYPE_ARRAY,
					PROJECT_SUBSCRIPTION_END_LOCAL_DATE,
					PROJECT_SUBSCRIPTION_START_LOCAL_DATE
				]
			);

			currentLocation = fromJS(
				{
					label: Liferay.Language.get('project'),
					name: formattedFields[PROJECT_NAME]
				}
			);

			let status = Liferay.Language.get('active');

			if (Moment(project.get(PROJECT_SUBSCRIPTION_END_LOCAL_DATE)).isBefore(Moment())) {
				status = Liferay.Language.get('inactive');
			}

			info = fromJS(
				[
					{
						label: Liferay.Language.get('solution'),
						value: formattedFields[PROJECT_SOLUTION_TYPE_ARRAY]
					},
					{
						label: Liferay.Language.get('liferay-version'),
						value: formattedFields[PROJECT_LIFERAY_VERSION]
					},
					{
						label: Liferay.Language.get('status'),
						value: status
					}
				]
			);

			path = fromJS(
				[
					{
						entityId: accountId,
						label: Liferay.Language.get('account'),
						name: `${account.get(ACCOUNT_NAME)}`
					}
				]
			);
		}

		return (
			<PageHeader
				currentLocation={currentLocation}
				info={info}
				path={path}
			/>
		);
	}
}

ProjectHeader.PROPS = {
	account: Config.instanceOf(Map),
	accountId: Config.string(),
	project: Config.instanceOf(Map),
	projectId: Config.string()
};

export default ProjectHeader;