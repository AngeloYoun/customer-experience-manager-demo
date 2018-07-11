import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as PROJECTS} from 'actions/projects';
import {NAME as TOUCHPOINTS} from 'actions/touchpoints';
import ActivityPoint, {activityStatuses} from 'components/models/ActivityPoint';
import TouchpointIcon from 'components/icons/TouchpointIcon';
import InlineInfo from 'components/text-groups/InlineInfo';
import ContactsList from 'components/text-groups/ContactsList';
import NavTabs from 'components/timeline-sidebar/NavTabs';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {mapAvailableKeys} from 'lib/util';

const {
	[PROJECTS]: projectsFields,
	[TOUCHPOINTS]: touchpointsFields,
} = fieldMap;

const {
	TOUCHPOINT_TYPE
} = fieldValue;

const COMMENTS = 'COMMENTS';

const DETAILS = 'DETAILS';

class TouchpointSidebar extends JSXComponent {
	render() {
		const {
			accountProjects,
			accountContacts,
			touchpoint
		} = this.props;

		const {
			selectedView
		} = this.state;

		const type = touchpoint.get(touchpointsFields.TYPE);

		return (
			<div class="touchpoint-sidebar-container">
				<div class="header">
					<ActivityPoint
						elementClasses="inactive"
						status={status}
					>
						<TouchpointIcon
							type={type}
						/>
					</ActivityPoint>

					<div class="title">
						<InlineInfo
							elementClasses={'project-name'}
							label={'Project'}
							value={`${accountProjects.get(
								touchpoint.get(touchpointsFields.PROJECT)
							).get(projectsFields.NAME)}`}
						/>

						<h3 class="touchpoint-subject">
							{touchpoint.get(touchpointsFields.SUBJECT)}
						</h3>

						<div class="meta-info">
							<InlineInfo
								elementClasses={'type'}
								label={'Type'}
								value={type}
							/>

							<InlineInfo
								elementClasses={`status`}
								label={'Status'}
								value={touchpoint.get(touchpointsFields.STATUS)}
							/>
						</div>

					</div>
				</div>

				<NavTabs
					onClick={this._handleNavClick}
					selected={selectedView}
					tabs={fromJS(
						[
							{
								label: Liferay.Language.get('details'),
								key: DETAILS
							},
							{
								label: Liferay.Language.get('comments'),
								key: COMMENTS
							}
						]
					)}
				/>

				<div class="info">
					{selectedView === DETAILS && (
						<div class="details">
							{type === TOUCHPOINT_TYPE.EVENT && (
								<div class="event-details">
									{touchpoint.get('sessions').map(
										session => (
											<div class="session">
												<h4 class="label">
													{'Session'}
												</h4>

												<h3 class="session-name">
													{session.get('name')}
												</h3>

												<h4 class="attendee-label">
													{'Attendees'}
												</h4>

												<ContactsList contacts={mapAvailableKeys(
													session.get('contacts'),
													accountContacts
												).toList()} />
											</div>
										)
									).toJS()}
								</div>
							)}

							{(type === TOUCHPOINT_TYPE.DOWNLOAD || type === TOUCHPOINT_TYPE.WEBPAGE) && (
								<div class="link-details">
									<h4 class="label">
										{'Content Link'}
									</h4>

									<h3 class="content-link">
										<a
											class="link"
											href={touchpoint.get(touchpointsFields.COMMENTS)}
										>
											{touchpoint.get(touchpointsFields.SUBJECT)}
										</a>
									</h3>
								</div>
							)}

							{(type === TOUCHPOINT_TYPE.EMAIL || type === TOUCHPOINT_TYPE.CALL) && (
								<h4 class="description">
									{touchpoint.get(touchpointsFields.COMMENTS)}
								</h4>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}

	_handleNavClick = key => () => {
		this.setState(
			{
				selectedView: key
			}
		)
	}
}

TouchpointSidebar.PROPS = {
	accountProjects: Config.instanceOf(Map).required(),
	accountContacts: Config.instanceOf(Map).required(),
	touchpoint: Config.instanceOf(Map).required()
}

TouchpointSidebar.STATE = {
	selectedView: Config.string().value(DETAILS)
}

export default TouchpointSidebar;