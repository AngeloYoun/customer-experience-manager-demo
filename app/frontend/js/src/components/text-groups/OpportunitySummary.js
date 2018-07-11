import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as OPPORTUNITY_LINE_ITEMS} from 'actions/opportunity-line-items';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {checkIfPropsChanged, formatCurrency, subLanguageKey, subLanguageKeyArray} from 'lib/util';

const NON_SUBSCRIPTION_GROUP_KEY = 'nonSubscription';

const {
	[OPPORTUNITIES]: opportunitiesFields,
	[OPPORTUNITY_LINE_ITEMS]: opportunityLineItemsFields
} = fieldMap;

const {
	OPPORTUNITY_STAGE: OPPORTUNITY_STAGE_VALUES
} = fieldValue;

class OpportunitySummary extends JSXComponent {
	render() {
		const {
			opportunity
		} = this.props;

		const opportunityStage = opportunity.get(opportunitiesFields.STAGE);

		let stageClassName = 'open';

		let langKey = Liferay.Language.get('x-on-x');

		if (opportunityStage === OPPORTUNITY_STAGE_VALUES.CLOSED_WON) {
			stageClassName = 'won';
		}
		else if (opportunityStage === OPPORTUNITY_STAGE_VALUES.CLOSED_LOST) {
			stageClassName = 'lost';
		}
		else if (opportunityStage === OPPORTUNITY_STAGE_VALUES.ROLLED_INTO_OPPORTUNITY) {
			stageClassName = 'neutral';
		}

		if (stageClassName == 'open') {
			langKey = Liferay.Language.get('x-closing-on-x');
		}

		const opportunityStatus = subLanguageKeyArray(
			langKey,
			[
				<h3
					class={`opportunity-stage ${stageClassName}`}
					key="opportunity-status"
				>
					{opportunityStage}
				</h3>,
				opportunity ? Moment(opportunity.get(opportunitiesFields.CLOSE_DATE)).format('MMM DD, YYYY') : ''
			]
		);

		return (
			<div class="opportunity-summary-container">
				<div class="line-item-list">
					{this._generateLineItemList(opportunity)}
				</div>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			[
				'opportunity',
				'opportunityKey'
			],
			nextProps
		);
	}

	_generateLineItemEntry = (lineItem, index, uniqueId) => {
		return [
			<div class="line-item" key={`${uniqueId}-${index}`}>
				<h4 class="line-item-quantity">
					{subLanguageKeyArray(
						Liferay.Language.get('x-x'),
						[<span class="line-item-quantity-count" key="quantity-count">{`${lineItem.get(opportunityLineItemsFields.QUANTITY)}`}</span>]
					)}
				</h4>

				<h4 class="line-item-product-name">
					{lineItem.get(opportunityLineItemsFields.NAME)}
				</h4>

				<h4 class="line-item-price">
					{
						formatCurrency(
							lineItem.get(opportunityLineItemsFields.TOTAL_PRICE),
							lineItem.get(opportunityLineItemsFields.CURRENCY_ISO_CODE)
						)
					}
				</h4>
			</div>
		];
	}

	_generateLineItemList = opportunity => {
		const {
			lineItems
		} = this.props;

		const opportunityLineItems = opportunity.get(opportunitiesFields.OPPORTUNITY_LINE_ITEMS).map(
			lineItemKey => lineItems.get(lineItemKey)
		)

		const groupedLineItems = this._groupBySubscriptionTerm(opportunityLineItems);

		let lineItemList = [];

		for (const uniqueSubscriptionTerms in groupedLineItems) {
			const opportunityLineItems = groupedLineItems[uniqueSubscriptionTerms];

			const firstLineItem = opportunityLineItems[0];

			const endDate = firstLineItem.get(opportunityLineItemsFields.END_LOCAL_DATE);
			const startDate = firstLineItem.get(opportunityLineItemsFields.START_LOCAL_DATE);

			let subscriptionLength = subLanguageKey(
				Liferay.Language.get('x-year-subscription'),
				[Math.round(Moment(endDate).diff(startDate, 'years', true) * 10) / 10]
			);

			let subscriptionTerm = `${Moment(startDate).format('MMM DD, YYYY')} - ${Moment(endDate).format('MMM DD, YYYY')}`;

			if (uniqueSubscriptionTerms === NON_SUBSCRIPTION_GROUP_KEY) {
				subscriptionLength = Liferay.Language.get('non-subscription');
				subscriptionTerm = '';
			}

			lineItemList.push(
				<div class="subscription-group-header">
					<h3 class="subscription-length">{subscriptionLength}</h3>

					<h4 class="subscription-term">{subscriptionTerm}</h4>
				</div>
			);

			const lineItemEntries = opportunityLineItems.map(
				(lineItem, index) => this._generateLineItemEntry(lineItem, index, uniqueSubscriptionTerms)
			);

			lineItemList = lineItemList.concat(lineItemEntries);
		}

		return lineItemList;
	}

	_groupBySubscriptionTerm = lineItems => {
		const groupedLineItems = {};

		if (lineItems) {
			lineItems.forEach(
				item => {
					const endDate = item.get(opportunityLineItemsFields.END_LOCAL_DATE);
					const startDate = item.get(opportunityLineItemsFields.START_LOCAL_DATE);

					if (startDate && endDate) {
						const subscriptionTermKey = `${startDate}${endDate}`;

						const subscriptionTermArray = groupedLineItems[subscriptionTermKey];

						if (subscriptionTermArray) {
							subscriptionTermArray.push(item);
						}
						else {
							groupedLineItems[subscriptionTermKey] = [item];
						}
					}
					else {
						const nonSubscriptionArray = groupedLineItems[NON_SUBSCRIPTION_GROUP_KEY];

						if (nonSubscriptionArray) {
							nonSubscriptionArray.push(item);
						}
						else {
							groupedLineItems[NON_SUBSCRIPTION_GROUP_KEY] = [item];
						}
					}
				}
			);
		}

		return groupedLineItems;
	}
}

OpportunitySummary.PROPS = {
	lineItems: Config.instanceOf(Map),
	opportunity: Config.instanceOf(Map),
	opportunityKey: Config.string()
};

export default OpportunitySummary;