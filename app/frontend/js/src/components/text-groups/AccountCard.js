import {fromJS, List, Map} from 'immutable';
import Moment from 'moment';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {opportunitiesActions, NAME as OPPORTUNITIES} from 'actions/opportunities';
import {opportunityLineItemsActions, NAME as OPPORTUNITY_LINE_ITEMS} from 'actions/opportunity-line-items';
import {NAME as PROJECTS} from 'actions/projects';
import Avatar from 'components/avatar/Avatar';
import InlineInfo from 'components/text-groups/InlineInfo';
import OpportunityIcon from 'components/icons/OpportunityIcon';
import {getTodaysARR} from 'components/models/ARRModel';
import DataHandler from 'components/wrappers/DataHandler';
import fieldMap from 'lib/field-formats';
import {requestActions, requestModifiers} from 'lib/request';
import {formatCurrency, mapAvailableKeys, subLanguageKey, subLanguageKeyArray} from 'lib/util';

const {
	[ACCOUNTS]: accountsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[OPPORTUNITY_LINE_ITEMS]: opportunityLineItemsFields,
	[PROJECTS]: projectsFields
} = fieldMap;

const {
	GET
} = requestActions;

const {
	ANY
} = requestModifiers

class AccountCard extends JSXComponent {
	render () {
		const {
			account,
			getOpportunities,
			getOpportunityLineItems,
			opportunities,
			opportunityLineItems,
			projects
		} = this.props;

		// const account = accounts.get(
		// 	opportunity.get(opportunitiesFields.ACCOUNT)
		// );
		const accountId = account.get(accountsFields.ID)

		const accountOpportunityKeys = account.get(accountsFields.OPPORTUNITIES);

		const accountOpportunities = mapAvailableKeys(
			accountOpportunityKeys,
			opportunities
		);

		const accountOpportunityLineItemKeys = accountOpportunities.reduce(
			(accum, entry) => accum.concat(entry.get(opportunitiesFields.OPPORTUNITY_LINE_ITEMS)),
			new List()
		);

		const accountOpportunityLineItems = mapAvailableKeys(
			accountOpportunityLineItemKeys,
			opportunityLineItems
		);


		// const project = projects.get(
		// 	opportunity.get(opportunitiesFields.PROJECT)
		// );

		// const accountName = account ? account.get(accountsFields.NAME) : '';

		// const projectName = project ? project.get(projectsFields.NAME) : '';

		return (
			<a href={`${window.Dossiera.URLS.HOST_URL}/accounts/${account.get(accountsFields.ID)}`}>
				<div class="account-card-container">
					<div class="title">
						<h3 class="name">
							<Avatar
								elementClasses="account-avatar"
								href={account.get(accountsFields.WEBSITE) ? `//logo.clearbit.com/${account.get(accountsFields.WEBSITE)}` : ''}
							/>

							{account.get(accountsFields.NAME)}
						</h3>

						<div class="info">
							<DataHandler
								dataConfigs={fromJS(
									[
										{
											action: getOpportunities,
											dataExists: accountOpportunities.size === accountOpportunityKeys.size,
											requestParams: {
												modifiers: [
													{
														key: ANY,
														args: [opportunitiesFields.ACCOUNT, accountId]
													}
												]
											},
										}
									]
								)}
								inline={true}
							>
								<DataHandler
									dataConfigs={fromJS(
										[
											{
												action: getOpportunityLineItems,
												dataExists: accountOpportunityLineItems.size === accountOpportunityLineItemKeys.size,
												requestParams: {
													modifiers: [
														{
															key: ANY,
															args: [
																opportunityLineItemsFields.ID,
																...accountOpportunityLineItemKeys.toJS()
															]
														}
													]
												}
											}
										]
									)}
									inline={true}
								>
									<InlineInfo
										label={Liferay.Language.get('arr')}
										value={formatCurrency(
											getTodaysARR(accountOpportunityLineItems, accountOpportunities),
											account.get(accountsFields.CURRENCY_ISO_CODE)
										)}
									/>
								</DataHandler>
							</DataHandler>

							<InlineInfo
								label={Liferay.Language.get('projects')}
								value={`${account.get(accountsFields.PROJECTS).size}`}
							/>
						</div>

						<h4 class="lastest-activity">
							{subLanguageKey(
								Liferay.Language.get('last-modified-x'),
								[Moment(account.get(accountsFields.LAST_MODIFIED_DATE)).fromNow()]
							)}
						</h4>
					</div>
				</div>
			</a>
		)
	}
}

AccountCard.PROPS = {
	account: Config.instanceOf(Map),
	opportunities: Config.instanceOf(Map),
	opportunityLineItems: Config.instanceOf(Map),
	projects: Config.instanceOf(Map)
};

export default connect(
	state => (
		{
			opportunities: state.getIn(['opportunities', 'data']),
			opportunityLineItems: state.getIn(['opportunityLineItems', 'data'])
		}
	),
	{
		getOpportunities: opportunitiesActions.GET,
		getOpportunityLineItems: opportunityLineItemsActions.GET,
	}
)(AccountCard);