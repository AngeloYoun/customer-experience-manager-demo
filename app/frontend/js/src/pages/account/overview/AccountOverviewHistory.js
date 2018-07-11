import {List, Map, fromJS} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';
import {scaleLinear, timeYear, timeFormat, timeMonth} from 'd3';
import gql from 'graphql-tag';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as PROJECTS} from 'actions/projects';
import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as TOUCHPOINTS} from 'actions/touchpoints';
import {NAME as LESA_TICKETS} from 'actions/lesa-tickets';
import {NAME as OPPORTUNITY_LINE_ITEMS} from 'actions/opportunity-line-items';
import AccountActivitiesModel from 'components/models/AccountActivitiesModel';
import ARRModel from 'components/models/ARRModel';
import AccountOverviewTimelineFilter from 'pages/account/overview/AccountOverviewTimelineFilter'
import AccountOverviewSidebar from 'pages/account/overview/AccountOverviewSidebar';
import LoadingWrapper from 'components/wrappers/LoadingWrapper';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {checkIfPropsChanged, mapAvailableKeys} from 'lib/util';
import Timeline from 'components/timeline/Timeline';

export const ACTIVITY_TYPE = 'ACTIVITY_TYPE';

const {
	[ACCOUNTS]: accountFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[OPPORTUNITY_LINE_ITEMS]: opportunityLineItemsFields,
	[PROJECTS]: projectsFields,
	[TOUCHPOINTS]: touchpointsFields
} = fieldMap;

const TIMELINE_ITEMS = 'TIMELINE_ITEMS';
const ARR_GRAPH = 'ARR_GRAPH';

const ITEM_RENDERER_MAP = Map(
	{
		[TIMELINE_ITEMS]: props => (
			<AccountActivitiesModel {...props} key="account-activities-model" />
		),
		[ARR_GRAPH]: props => (
			<ARRModel {...props} key="arr-model" />
		)
	}
);

class AccountOverviewHistory extends JSXComponent {
	created() {
		const {
			accountId
		} = this.props;

		this._querySub = window.Dossiera.apollo.watchQuery({
			query: gql(
				`query AccountOverviewHistory($accountId: String) {
					account(id: $accountId) {
						id
						name
						createdDate
						industry
						lastModifiedBy
						type
						projects {
							id
						}
						tickets {
							id
						}
						opportunities {
							id
						}
						website
					}
					getProjectsByAccount(id: $accountId) {
						id
						name
						subscriptionEndDate
						createdDate
						subscriptionStartDate
						description
						salesforceProjectId
						liferayVersion
						name
						startDate
						goLiveDate
						tickets {
							id
						}
						partnerFirstLineSupport
					}
					getOpportunitiesByAccount(id: $accountId) {
						account {
							id
						}
						listPriceTotal
						closeDate
						type
						id
						currencyIsoCode
						name
						stage
						opportunityLineItems {
							id
							currencyIsoCode
							name
							quantity
							startLocalDate
							endLocalDate
							term
							termType
							totalPrice
						}
						subscriptionEndDate
						subscriptionStartDate
					}
					getTicketsByAccount(id: $accountId) {
						component
						description
						escalationLevel
						id
						issueClosedDate
						issueDueDate
						issueReportDate
						issueReporter
						project {
							id
						}
						resolution
						severity
						status
						summary
					}
				}`
			),
			variables: {
				accountId
			}
		}).subscribe({
			next: ({data}) => {
				const accountOpportunities = fromJS(data.getOpportunitiesByAccount);

				this.setState(
					{
						account: fromJS(data.account),
						accountLesaTickets: fromJS(data.getTicketsByAccount),
						accountProjects: fromJS(data.getProjectsByAccount),
						accountOpportunities,
						accountOpportunityLineItems: accountOpportunities.reduce(
							(accum, opportunity) => accum.concat(
								opportunity.get(opportunitiesFields.OPPORTUNITY_LINE_ITEMS)
							),
							new List()
						),
						loading: false,
					}
				)
			}
		});
	}

	detached() {
		this._querySub.unsubscribe();
	}

	render() {
		const {
			filters,
			account,
			accountContacts,
			accountLesaTickets,
			accountOpportunities,
			accountOpportunityLineItems,
			accountProjects,
			accountTouchpoints,
			loading,
			selectedData
		} = this.state;

		const filteredAccountOpportunities = filters.size ? accountOpportunities.filter(
			entry => filters.every(
				filterCheck => {
					return !filterCheck(entry)
				}
			)
		) : accountOpportunities;

		const scopeFilter = filters.get('scope');

		const scopedAccountOpportunities = scopeFilter ? accountOpportunities.filter(
			entry => !scopeFilter(entry)
		) : accountOpportunities;

		const filteredAccountLesaTickets = filters.size ? accountLesaTickets.filter(
			entry => filters.every(
				filterCheck => {
					return !filterCheck(entry)
				}
			)
		) : accountLesaTickets;

		const filteredAccountTouchpoints = filters.size ? accountTouchpoints.filter(
			entry => filters.every(
				filterCheck => {
					return !filterCheck(entry)
				}
			)
		) : accountTouchpoints;

		return (
			<div class="account-overview-history-container">
				<LoadingWrapper dataLoaded={!loading}>
					<div class="timeline-controls">
						<AccountOverviewTimelineFilter
							account={account}
							accountLesaTickets={accountLesaTickets}
							accountOpportunities={accountOpportunities}
							accountProjects={accountProjects}
							filters={filters}
							setFilter={this._setFilter}
						/>
					</div>

					<Timeline
						elementClasses={selectedData ? 'sidebar-active' : ''}
						endDate={'2019-12-01'}
						items={fromJS(
							{
								[ARR_GRAPH]: {
									account,
									accountOpportunities,
									accountOpportunityLineItems,
									filteredAccountOpportunities: scopedAccountOpportunities
								},
								[TIMELINE_ITEMS]: {
									account,
									accountLesaTickets: filteredAccountLesaTickets,
									accountOpportunities: filteredAccountOpportunities,
									accountProjects: accountProjects,
									accountTouchpoints: filteredAccountTouchpoints,
									selectedId: selectedData ? selectedData.get('id') : '',
									toggleSidebar: this._toggleSidebar
								}
							}
						)}
						itemHeight={24}
						itemWidth={24}
						itemRenderers={ITEM_RENDERER_MAP}
						resetTimelineView={!selectedData}
						startDate={Moment(account.get(accountFields.CREATED_DATE)).startOf('year').format('YYYY-MM-DD')}
					/>

					{selectedData && (
						<div class="timeline-sidebar">
							<AccountOverviewSidebar
								data={selectedData}
								lineItems={accountOpportunityLineItems}
								accountContacts={accountContacts}
								accountProjects={accountProjects}
								closeSidebar={this._closeSidebar}
							/>
						</div>
					)}
				</LoadingWrapper>
			</div>
		);
	}

	_closeSidebar = () => {
		this.setState(
			{
				resetTimelineView: true,
				selectedData: ''
			}
		);
	}

	_toggleSidebar = (selectedData, type) => {
		this.setState(
			{
				selectedData: selectedData ? selectedData.set(ACTIVITY_TYPE, type) : ''
			}
		);
	}

	shouldUpdate(nextState, nextProps) {
		return nextState ? true : checkIfPropsChanged(
			[
				'account',
				'accountLesaTickets',
				'accountProjects',
				'accountOpportunities',
				'accountOpportunityLineItems',
				'accountTouchpoints'
			],
			nextProps
		);
	}

	_setFilter = (active, key, check) => {
		this.setState(
			{
				filters: active ? this.state.filters.merge(
					Map(
						{
							[key]: check
						}
					)
				) : this.state.filters.delete(key),
				selectedData: ''
			}
		);
	}
}

AccountOverviewHistory.PROPS = {
	accountId: Config.string().required()
};

AccountOverviewHistory.STATE = {
	filters: Config.instanceOf(Map).value(Map()),
	loading: Config.bool().value(true),
	account: Config.instanceOf(Map).value(Map()),
	accountContacts: Config.instanceOf(List).value(List()),
	accountLesaTickets: Config.instanceOf(List).value(List()),
	accountProjects: Config.instanceOf(List).value(List()),
	accountOpportunities: Config.instanceOf(List).value(List()),
	accountOpportunityLineItems: Config.instanceOf(List).value(List()),
	accountTouchpoints: Config.instanceOf(List).value(List()),
	selectedData: Config.value(null)
}

AccountOverviewHistory.SYNC_UPDATES = true;

export default AccountOverviewHistory;