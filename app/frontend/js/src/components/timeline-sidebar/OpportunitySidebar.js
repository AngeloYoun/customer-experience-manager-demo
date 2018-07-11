import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as PROJECTS} from 'actions/projects';
import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {opportunityClosedStatusMap} from 'components/models/OpportunityModel';
import ActivityPoint, {activityStatuses} from 'components/models/ActivityPoint';
import OpportunityIcon from 'components/icons/OpportunityIcon';
import InlineInfo from 'components/text-groups/InlineInfo';
import OpportunitySummary from 'components/text-groups/OpportunitySummary';
import ContactsList from 'components/text-groups/ContactsList';
import NavTabs from 'components/timeline-sidebar/NavTabs';
import fieldMap from 'lib/field-formats';
import {formatCurrency, mapAvailableKeys} from 'lib/util';

const {
	[PROJECTS]: projectsFields,
	[OPPORTUNITIES]: opportunitiesFields,
} = fieldMap;

const CONTACTS = 'CONTACTS';

const PRECEDING = 'PRECEDING';

const PRODUCTS = 'PRODUCTS';

class OpportunitySidebar extends JSXComponent {
	render() {
		const {
			opportunity,
			accountProjects,
			accountContacts,
			lineItems
		} = this.props;

		const {
			selectedView
		} = this.state;

		const type = opportunity.get(opportunitiesFields.TYPE);
		const stage = opportunity.get(opportunitiesFields.STAGE)
		const id = opportunity.get(opportunitiesFields.ID);
		const status = opportunityClosedStatusMap[stage] ? opportunityClosedStatusMap[stage] : activityStatuses.NEUTRAL;

		return (
			<div class="opportunity">
				<div class="header">
					<ActivityPoint
						elementClasses="inactive"
						status={status}
					>
						<OpportunityIcon
							key={id}
							opportunityKey={id}
							stage={stage}
							type={opportunity.get(opportunitiesFields.TYPE)}
						/>
					</ActivityPoint>

					<div class="title">
						<h4 class="project-name">
							<span class="inline-label">
								{'Project: '}
							</span>

							{`${accountProjects.get(
								opportunity.get(opportunitiesFields.PROJECT)
							).get(projectsFields.NAME)}`}
						</h4>

						<h3 class="opportunity-type">
							{`${type} Opportunity`}
						</h3>

						<div class="meta-info">
							<InlineInfo
								elementClasses={'total-amount'}
								label={'Total Amount'}
								value={formatCurrency(
									opportunity.get(opportunitiesFields.AMOUNT),
									opportunity.get(opportunitiesFields.CURRENCY_ISO_CODE)
								)}
							/>

							<InlineInfo
								elementClasses={`status ${status}`}
								label={'Stage'}
								value={stage}
							/>
						</div>

						<div class="meta-info">
							<InlineInfo
								elementClasses={'sold-by'}
								label={'Sold By'}
								value={opportunity.get(opportunitiesFields.SOLD_BY)}
							/>

							<InlineInfo
								elementClasses={'id'}
								label={'ID'}
								value={opportunity.get(opportunitiesFields.ID)}
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
								label: Liferay.Language.get('products'),
								key: PRODUCTS
							},
							{
								label: Liferay.Language.get('contacts'),
								key: CONTACTS
							},
							{
								label: Liferay.Language.get('preceding'),
								key: PRECEDING
							}
						]
					)}
				/>

				<div class="info">
					{selectedView === PRODUCTS && (
						<OpportunitySummary
							opportunity={opportunity}
							lineItems={lineItems}
						/>
					)}

					{selectedView === CONTACTS && (
						<ContactsList
							contacts={mapAvailableKeys(
								opportunity.get(opportunitiesFields.CONTACTS),
								accountContacts
							).toList()}
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

OpportunitySidebar.PROPS = {
	accountProjects: Config.instanceOf(Map).required(),
	accountContacts: Config.instanceOf(Map).required(),
	lineItems: Config.instanceOf(Map).required(),
	opportunity: Config.instanceOf(Map).required()
}

OpportunitySidebar.STATE = {
	selectedView: Config.string().value(PRODUCTS)
}

export default OpportunitySidebar;