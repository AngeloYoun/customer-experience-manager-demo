import {List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import ListComponent from 'components/list/List';
import PlaceholderMessage from 'components/text-groups/PlaceholderMessage';
import Tag, {tagTypes} from 'components/tag/Tag';
import fieldMap from 'lib/field-formats';
import {formatCurrency, formatFields, getPluralMessage, splitLineItemName, subLanguageKey, subLanguageKeyArray} from 'lib/util';

const {
	OPPORTUNITY_LINE_ITEMS_END_LOCAL_DATE,
	OPPORTUNITY_LINE_ITEMS_NAME,
	OPPORTUNITY_LINE_ITEMS_QUANTITY,
	OPPORTUNITY_LINE_ITEMS_START_LOCAL_DATE,
	OPPORTUNITY_LINE_ITEMS_TOTAL_PRICE
} = fieldMap;

class ProjectOverviewActiveSubscriptions extends JSXComponent {
	render() {
		const {
			projectSubscriptions
		} = this.props;

		return (
			<div class="project-overview-active-subscriptions-container">
				{(projectSubscriptions && projectSubscriptions.size) ? (
					<ListComponent
						focused={true}
						itemCount={20}
						itemRenderer={this._renderEntry}
						listItems={projectSubscriptions}
					/>
				) : (
					<PlaceholderMessage
						message={Liferay.Language.get('there-are-no-active-subscriptions')}
					/>
				)}
			</div>
		);
	}

	_renderEntry = ({itemData, index}) => {
		const formattedFields = formatFields(
			itemData,
			[
				OPPORTUNITY_LINE_ITEMS_END_LOCAL_DATE,
				OPPORTUNITY_LINE_ITEMS_NAME,
				OPPORTUNITY_LINE_ITEMS_QUANTITY,
				OPPORTUNITY_LINE_ITEMS_START_LOCAL_DATE,
				OPPORTUNITY_LINE_ITEMS_TOTAL_PRICE
			]
		);

		const {
			lineItemType,
			productLevel,
			productSubTypeName
		} = splitLineItemName(formattedFields[OPPORTUNITY_LINE_ITEMS_NAME]);

		const subscriptionEnd = itemData.get(OPPORTUNITY_LINE_ITEMS_END_LOCAL_DATE);
		const subscriptionStart = itemData.get(OPPORTUNITY_LINE_ITEMS_START_LOCAL_DATE);

		const subscriptionTermLeft = Math.round(Moment(subscriptionEnd).diff(subscriptionStart, 'months', true) * 10) / 10;
		const subscriptionTermString = `${Moment(subscriptionStart).format('MM/DD/YYYY')} - ${Moment(subscriptionEnd).format('MM/DD/YYYY')}`;

		return [
			<div class="subscription" key={index}>
				<div class="header">
					<h2 class="quantity">
						{subLanguageKeyArray(
							Liferay.Language.get('x-x'),
							[<span class="quantity-count" key="quantity-count">{`${formattedFields[OPPORTUNITY_LINE_ITEMS_QUANTITY]}`}</span>]
						)}
					</h2>

					<h2 class="item-type">
						{lineItemType}
					</h2>

					<div class="subscription-level">
						<Tag
							elementClasses="level"
							options={{level: productLevel}}
							type={tagTypes.SUBSCRIPTION_LEVEL}
						/>

						<h2 class="level-label">
							{productLevel}
						</h2>
					</div>

					<h2 class="product-type">
						{productSubTypeName}
					</h2>
				</div>

				<div class="info">
					<div class="subscription-price">
						<h3 class="sales-price">
							{formatCurrency(
								itemData.get(OPPORTUNITY_LINE_ITEMS_TOTAL_PRICE) / itemData.get(OPPORTUNITY_LINE_ITEMS_QUANTITY)
							)}
						</h3>

						<h2 class="total-price">
							{subLanguageKey(
								Liferay.Language.get('slash-x'),
								[formattedFields[OPPORTUNITY_LINE_ITEMS_TOTAL_PRICE]]
							)}
						</h2>
					</div>

					<div class="subscription-term">
						<h3 class="term-left">
							{getPluralMessage(
								Liferay.Language.get('x-more-month'),
								Liferay.Language.get('x-more-months'),
								subscriptionTermLeft
							)}
						</h3>

						<h4 class="term">
							{subscriptionTermString}
						</h4>
					</div>
				</div>
			</div>
		];
	}
}

ProjectOverviewActiveSubscriptions.PROPS = {
	projectSubscriptions: Config.instanceOf(List)
};

export default ProjectOverviewActiveSubscriptions;