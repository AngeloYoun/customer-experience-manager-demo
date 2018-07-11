import {List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import ListComponent from 'components/list/List';
import PlaceholderMessage from 'components/text-groups/PlaceholderMessage';
import UserInfo from 'components/user-info/UserInfo';
import fieldMap from 'lib/field-formats';
import {formatFields} from 'lib/util';

const {
	USER_AVATAR,
	USER_EMAIL,
	USER_FIRST_NAME,
	USER_LAST_NAME
} = fieldMap;

class ProjectOverviewOpportunityOwners extends JSXComponent {
	render() {
		const {
			projectOwners
		} = this.props;

		return (
			<div class="project-overview-opportunity-owners-container">
				{(projectOwners && projectOwners.size) ? (
					<ListComponent
						focused={true}
						itemCount={20}
						itemRenderer={this._renderEntry}
						listItems={projectOwners}
					/>
				) : (
					<PlaceholderMessage
						message={Liferay.Language.get('there-are-no-opportunities')}
					/>
				)}
			</div>
		);
	}

	_renderEntry = ({index, itemData}) => {
		const formattedFields = formatFields(
			itemData,
			[
				USER_EMAIL,
				USER_FIRST_NAME,
				USER_LAST_NAME
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
}

ProjectOverviewOpportunityOwners.PROPS = {
	projectOwners: Config.instanceOf(List)
};

export default ProjectOverviewOpportunityOwners;