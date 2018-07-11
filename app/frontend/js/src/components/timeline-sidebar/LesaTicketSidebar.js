import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as PROJECTS} from 'actions/projects';
import {NAME as LESA_TICKETS} from 'actions/lesa-tickets';
import ActivityPoint, {activityStatuses} from 'components/models/ActivityPoint';
import LesaTicketIcon from 'components/icons/LesaTicketIcon';
import InlineInfo from 'components/text-groups/InlineInfo';
import TicketComments from 'components/text-groups/TicketComments';
import NavTabs from 'components/timeline-sidebar/NavTabs';
import fieldMap, {fieldValue} from 'lib/field-formats';

const {
	[PROJECTS]: projectsFields,
	[LESA_TICKETS]: lesaTicketsFields,
} = fieldMap;

const {
	LESA_TICKET_STATUS
} = fieldValue;

const COMMENTS = 'COMMENTS';

const DESCRIPTION = 'DESCRIPTION';

const HISTORY = 'HISTORY';

class LesaTicketSidebar extends JSXComponent {
	render() {
		const {
			lesaTicket,
			accountProjects,
			accountContacts
		} = this.props;

		const {
			selectedView
		} = this.state;

		const id = lesaTicket.get(lesaTicketsFields.ID);
		const resolution = lesaTicket.get(lesaTicketsFields.RESOLUTION);
		const severity = lesaTicket.get(lesaTicketsFields.SEVERITY);
		const status = lesaTicket.get(lesaTicketsFields.STATUS) === LESA_TICKET_STATUS.CLOSED ? activityStatuses.POSITIVE : activityStatuses.NEUTRAL;
		const summary = lesaTicket.get(lesaTicketsFields.SUMMARY);
		const issueClosedDate = lesaTicket.get(lesaTicketsFields.ISSUE_CLOSED_DATE);

		return (
			<div class="lesa-ticket-sidebar-container">
				<div class="header">
					<ActivityPoint
						elementClasses="inactive"
						status={status}
					>
						<LesaTicketIcon
							key={id}
 							severity={severity}
						/>
					</ActivityPoint>

					<div class="title">
						<InlineInfo
							elementClasses={'project-name'}
							label={Liferay.Language.get('project')}
							value={`${accountProjects.get(
								lesaTicket.get(lesaTicketsFields.PROJECT)
							).get(projectsFields.NAME)}`}
						/>

						<h3 class="ticket-summary">
							{summary}
						</h3>

						<div class="meta-info">
							<InlineInfo
								elementClasses={`severity severity-${lesaTicket.get(lesaTicketsFields.SEVERITY).toLowerCase()}`}
								label={Liferay.Language.get('severity')}
								value={lesaTicket.get(lesaTicketsFields.SEVERITY)}
							/>

							<InlineInfo
								elementClasses={'escalation'}
								label={Liferay.Language.get('escalation')}
								value={lesaTicket.get(lesaTicketsFields.ESCALATION_LEVEL)}
							/>

							<InlineInfo
								elementClasses={`status ${status}`}
								label={Liferay.Language.get('status')}
								value={`${lesaTicket.get(lesaTicketsFields.STATUS)}${resolution ? ` - ${lesaTicket.get(lesaTicketsFields.RESOLUTION)}` : ''}`}
							/>
						</div>

						<div class="meta-info">
							<InlineInfo
								elementClasses={`component`}
								label={Liferay.Language.get('component')}
								value={`${lesaTicket.get(lesaTicketsFields.COMPONENT)}`}
							/>

							<InlineInfo
								elementClasses={`id`}
								label={Liferay.Language.get('id')}
								value={`${lesaTicket.get(lesaTicketsFields.ID)}`}
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
								label: Liferay.Language.get('description'),
								key: DESCRIPTION
							},
							{
								label: Liferay.Language.get('comments'),
								key: COMMENTS
							},
							{
								label: Liferay.Language.get('history'),
								key: HISTORY
							}
						]
					)}
				/>

				<div class="info">
					{selectedView === DESCRIPTION && (
						<div class="description-container">
							<h4 class="reported-by">
								{`Reported by ${accountContacts.get(
									lesaTicket.get(lesaTicketsFields.ISSUE_REPORTER)
								).get('name')} on ${Moment(
									lesaTicket.get(lesaTicketsFields.ISSUE_REPORT_DATE)
								).format('MMMM D, YYYY')}`}
							</h4>

							{issueClosedDate && (
								<h4 class="closed-on">
									<strong class={`resolution ${status}`}>
										{lesaTicket.get(lesaTicketsFields.RESOLUTION)}
									</strong>

									{` on ${Moment(issueClosedDate).format('MMMM D, YYYY')}`}
								</h4>
							)}

							<h4 class="description">
								{lesaTicket.get(lesaTicketsFields.DESCRIPTION)}
							</h4>
						</div>
					)}

					{selectedView === COMMENTS && (
						<TicketComments
							accountContacts={accountContacts}
							lesaTicket={lesaTicket}
						/>
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

LesaTicketSidebar.PROPS = {
	lesaTicket: Config.instanceOf(Map).required(),
	accountProjects: Config.instanceOf(Map).required(),
	accountContacts: Config.instanceOf(Map).required(),
}

LesaTicketSidebar.STATE = {
	selectedView: Config.string().value(DESCRIPTION)
}

export default LesaTicketSidebar;