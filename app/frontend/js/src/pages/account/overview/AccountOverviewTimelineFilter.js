import {Map} from 'immutable';
import {contains, keys, values} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';

import {showModal, modalTypes} from 'actions/modal';
import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as LESA_TICKETS} from 'actions/lesa-tickets';
import {NAME as PROJECTS} from 'actions/projects';
import ActionButtion from 'components/buttons/ActionButton';
import SelectInput from 'components/inputs/SelectInput';
import Checkbox from 'components/inputs/Checkbox';
import DropdownInput from 'components/inputs/DropdownInput';
import fieldMap, {fieldValue} from 'lib/field-formats';
import existingBusinessIcon from 'resources/opportunity-existing-business';
import newBusinessIcon from 'resources/opportunity-new-business';
import newProjectIcon from 'resources/opportunity-new-project';
import otherIcon from 'resources/opportunity-other';
import professionalServicesIcon from 'resources/opportunity-professional-services';
import renewalIcon from 'resources/opportunity-renewal';
import {checkIfPropsChanged, mapAvailableKeys} from 'lib/util';
import LesaTicketIcon from 'components/icons/LesaTicketIcon';
import OpportunityIcon from 'components/icons/OpportunityIcon';

const {
	[ACCOUNTS]: accountsFields,
	[LESA_TICKETS]: lesaTicketsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[PROJECTS]: projectsFields
} = fieldMap;

const {
	LESA_TICKET_STATUS,
	OPPORTUNITY_TYPE,
	OPPORTUNITY_STAGE_OPEN
} = fieldValue;

const {
	EXISTING_BUSINESS,
	NEW_BUSINESS,
	NEW_PROJECT_EXISTING_BUSINESS,
	PROFESSIONAL_SERVICES,
	RENEWAL
} = OPPORTUNITY_TYPE;

const OTHER = 'OTHER';

const filterOptions = {
	[EXISTING_BUSINESS]: {
		filterCheck: entry => entry.get(opportunitiesFields.TYPE) === EXISTING_BUSINESS,
		icon: existingBusinessIcon,
		label: Liferay.Language.get('existing-business')
	},
	[NEW_BUSINESS]: {
		filterCheck: entry => entry.get(opportunitiesFields.TYPE) === NEW_BUSINESS,
		icon: newBusinessIcon,
		label: Liferay.Language.get('new-business')
	},
	[NEW_PROJECT_EXISTING_BUSINESS]: {
		filterCheck: entry => entry.get(opportunitiesFields.TYPE) === NEW_PROJECT_EXISTING_BUSINESS,
		icon: newProjectIcon,
		label: Liferay.Language.get('new-project')
	},
	[PROFESSIONAL_SERVICES]: {
		filterCheck: entry => entry.get(opportunitiesFields.TYPE) === PROFESSIONAL_SERVICES,
		icon: professionalServicesIcon,
		label: Liferay.Language.get('professional-services')
	},
	[RENEWAL]: {
		filterCheck: entry => entry.get(opportunitiesFields.TYPE) === RENEWAL,
		icon: renewalIcon,
		label: Liferay.Language.get('renewal')
	},
	[OTHER]: {
		filterCheck: entry => !values(OPPORTUNITY_TYPE).includes(
			entry.get(opportunitiesFields.TYPE)
		),
		icon: otherIcon,
		label: Liferay.Language.get('other')
	}
};

class AccountOverviewTimelineFilter extends JSXComponent {
	render() {
		const {
			account,
			accountLesaTickets,
			accountProjects,
			accountOpportunities,
			filters,
			setFilter,
			showModal
		} = this.props;

		const {
			scopeFilter = account.get(accountsFields.ID)
		} = this.state;

		const scope = filters.get('scope');

		const selectedScope =  filters.get('scope') ?  filters.get('scope') : f => !!f;

		const scopes = accountProjects.map(
			entry => (
				Map(
					{
						id: entry.get(projectsFields.ID),
						name: entry.get(projectsFields.NAME),
						label: Liferay.Language.get('project'),
						type: PROJECTS
					}
				)
			)
		).toList().unshift(
			Map(
				{
					id: account.get(accountsFields.ID),
					name: 'Account',
					type: ACCOUNTS
				}
			)
		);

		return (
			<div class="account-overview-timeline-filter">
				<div class="timeline-header">
					<SelectInput
						elementClasses="borderless scope-filter"
						onChange={this._handleScopeFilter}
						data={scopes}
						renderer={entry => (
							<div class="scope-filter-entry">
								{entry.get('label') && (
									<h4 class="label">
										{entry.get('label')}
									</h4>
								)}

								<h2 class="name">
									{entry.get('name')}
								</h2>
							</div>
						)}
						selectedIndex={scopes.findKey(
							entry => entry.get('id') === scopeFilter
						)}
					/>

					<div class="open-activities">
						<div class="open-opportunities">
							<h4 class="label">
								{Liferay.Language.get('open-opportunities')}
							</h4>

							<div class="opportunities">
								{this._getOpenOpportunities(accountOpportunities).filter(
									selectedScope
								).groupBy(item => item.get(opportunitiesFields.TYPE)).map(
									(items, key) => (
										<div class="opportunity">
											<h4 class="count">
												{items.size}
											</h4>

											<OpportunityIcon type={key} />
										</div>
									)
								).toJS()}
							</div>
						</div>

						<div class="open-tickets">
							<h4 class="label">
								{Liferay.Language.get('open-tickets')}
							</h4>

							<div class="tickets">
								{this._getOpenLesaTickets(accountLesaTickets).filter(
									selectedScope
								).groupBy(item => item.get(lesaTicketsFields.SEVERITY)).map(
									(items, key) => (
										<div class="ticket">
											<h4 class="count">
												{items.size}
											</h4>

											<LesaTicketIcon severity={key} />
										</div>
									)
								).toJS()}
							</div>
						</div>
					</div>
				</div>

				<DropdownInput
					elementClasses="filter"
					label={'Filter Timeline'}
				>
					<div class="timeline-filter-settings">
						{keys(filterOptions).map(
							filterKey => (
								<Checkbox
									active={!filters.has(filterKey)}
									onClick={this._handleFilter(filterKey)}
									data-key={filterKey}
								>
									<div class="icon">{filterOptions[filterKey].icon}</div>

									{filterOptions[filterKey].label}
								</Checkbox>
							)
						)}
					</div>
				</DropdownInput>

				<ActionButtion
					buttonLabel={'Create'}
					onClick={this._handleCreate}
					elementClasses={'create-button'}
				/>
			</div>
		);
	}

	_getOpenOpportunities = opportunities => opportunities.filter(
		opportunity => values(OPPORTUNITY_STAGE_OPEN).includes(
			opportunity.get(opportunitiesFields.STAGE)
		)
	);

	_getOpenLesaTickets = tickets => tickets.filter(
		ticket => LESA_TICKET_STATUS.IN_PROGRESS === ticket.get(lesaTicketsFields.STATUS)
	);

	_handleCreate = () => {
		const {
			account,
			showModal
		} = this.props;

		showModal(
			{
				modalProps: {
					account
				},
				modalType: modalTypes.CREATE
			}
		);
	}

	_handleScopeFilter = entity => {
		const {
			setFilter
		} = this.props;

		if (entity.get('type') === PROJECTS) {
			setFilter(
				true,
				'scope',
				entry => entry.get(opportunitiesFields.PROJECT) !== entity.get('id')
			);
		}
		else if (entity.get('type') === ACCOUNTS) {
			setFilter(
				false,
				'scope'
			);
		}

		this.setState(
			{
				scopeFilter: entity.get('id')
			}
		)
	}

	_handleFilter = key => (event, active) => this.props.setFilter(active, key, filterOptions[key].filterCheck)
}

AccountOverviewTimelineFilter.PROPS = {
	setFilter: Config.func().required(),
	showModal: Config.func().required()
};

AccountOverviewTimelineFilter.STATE = {
	scopeFilter: Config.string().value()
}

export default AccountOverviewTimelineFilter;