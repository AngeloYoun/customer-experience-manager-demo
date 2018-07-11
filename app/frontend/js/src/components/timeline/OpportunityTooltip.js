import {List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {getProjectTimelineOpportunity} from 'actions/project-timeline-opportunity';
import OpportunitySummary from 'components/text-groups/OpportunitySummary';
import TooltipHandler from 'components/timeline/TooltipHandler';

class OpportunityTooltip extends JSXComponent {
	render() {
		const {
			getProjectTimelineOpportunity,
			opportunities,
			opportunityElements
		} = this.props;

		const {
			opportunityKey
		} = this.state;

		const opportunity = opportunities ? opportunities.get(opportunityKey) : null;

		if (opportunityKey && !opportunity) {
			getProjectTimelineOpportunity(
				{
					entityId: opportunityKey
				}
			);
		}

		return (
			<TooltipHandler
				bindTooltip={this._bindTooltip}
				targetElements={opportunityElements}
				tooltipSize={{
					marginHorz: 120,
					marginVert: 200,
					width: 500
				}}
				xPosRelativeToCursor={false}
				yPosRelativeToCursor={true}
			>
				{opportunity &&
					<OpportunitySummary
						key="tooltip-content"
						opportunity={opportunity}
					/>
				}
			</TooltipHandler>
		);
	}

	_bindTooltip = ({hideCallback, moveCallback, showCallback}) => {
		const {
			opportunityElements
		} = this.props;

		if (opportunityElements && opportunityElements.size) {
			opportunityElements.forEach(
				component => {
					const node = component.element;

					if (node) {
						node.addEventListener(
							'mouseenter',
							event => {
								this.setState(
									{
										opportunityKey: event.target.dataset.opportunityKey
									}
								);

								showCallback(event);
							}
						);

						node.addEventListener(
							'mouseleave',
							hideCallback
						);

						node.addEventListener(
							'mousemove',
							moveCallback
						);
					}
				}
			);
		}
	}
}

OpportunityTooltip.PROPS = {
	opportunities: Config.instanceOf(Map),
	opportunityElements: Config.instanceOf(List)
};

OpportunityTooltip.STATE = {
	opportunityKey: Config.string()
};

export default connect(
	(state, {opportunityKey}) => (
		{
			opportunities: state.getIn(['projectTimelineOpportunity', 'data'])
		}
	),
	{
		getProjectTimelineOpportunity
	}
)(OpportunityTooltip);