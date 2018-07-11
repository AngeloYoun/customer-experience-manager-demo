import createBaseActions from 'actions/requests';

export const NAME = 'OPPORTUNITY_LINE_ITEMS';

const controller = 'opportunity-line-items';

const base = createBaseActions(
	{
		controller,
		name: NAME
	}
);

const actionTypes = base.actionTypes;

const opportunityLineItemsActions = base.actions;

export {
	actionTypes,
	opportunityLineItemsActions
};