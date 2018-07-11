import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as PROJECTS} from 'actions/projects';
import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as TOUCHPOINTS} from 'actions/touchpoints';
import {NAME as LESA_TICKETS} from 'actions/lesa-tickets';
import {NAME as OPPORTUNITY_LINE_ITEMS} from 'actions/opportunity-line-items';
import CloseButton from 'components/buttons/CloseButton';
import {activityStatuses} from 'components/models/ActivityPoint';
import InlineInfo from 'components/text-groups/InlineInfo';
import OpportunitySummary from 'components/text-groups/OpportunitySummary';
import TicketComments from 'components/text-groups/TicketComments';
import ActivityPoint from 'components/models/ActivityPoint';
import TouchpointIcon from 'components/icons/TouchpointIcon';
import OpportunityIcon from 'components/icons/OpportunityIcon';
import LesaTicketSidebar from 'components/timeline-sidebar/LesaTicketSidebar';
import OpportunitySidebar from 'components/timeline-sidebar/OpportunitySidebar';
import TouchpointSidebar from 'components/timeline-sidebar/TouchpointSidebar';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {ACTIVITY_TYPE} from 'pages/account/overview/AccountOverviewHistory';

const {
	[OPPORTUNITIES]: opportunitiesFields,
	[PROJECTS]: projectsFields,
	[LESA_TICKETS]: lesaTicketsFields,
	[TOUCHPOINTS]: touchpointsFields
} = fieldMap;

const {
	LESA_TICKET_STATUS
} = fieldValue;

const sidebarTypeMap = {
	[OPPORTUNITIES]: ({data, ...props}) => (
		<OpportunitySidebar opportunity={data} {...props} />
	),
	[LESA_TICKETS]: ({data, ...props}) => (
		<LesaTicketSidebar lesaTicket={data} {...props} />
	),
	[TOUCHPOINTS]: ({data, ...props}) => (
		<TouchpointSidebar touchpoint={data} {...props} />
	)
};

class AccountOverviewSidebar extends JSXComponent {
	render() {
		const {
			closeSidebar,
			data
		} = this.props;

		return (
			<div class="account-overview-sidebar-container">
				{sidebarTypeMap[data.get(ACTIVITY_TYPE)](this.props)}

				<CloseButton onClick={closeSidebar} />
			</div>
		);
	}

	_handleOnChange = ({target: {value}}) => {
		const {data, onChange} = this.props;

		onChange(value, data);
	};
}

AccountOverviewSidebar.PROPS = {
	autofocus: Config.value(false),
	accountProjects: Config.instanceOf(Map).required(),
	closeSidebar: Config.func().required(),
	initialValue: Config.string(),
	label: Config.string(),
	onChange: Config.func().value(f => f),
	placeholder: Config.string(),
	value: Config.string()
};

export default AccountOverviewSidebar;