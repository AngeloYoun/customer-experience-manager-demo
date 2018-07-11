import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import OpportunityIcon from 'components/icons/OpportunityIcon';
import {fieldValue} from 'lib/field-formats';

const {OPPORTUNITY_STAGE} = fieldValue;

class OpportunityPoint extends JSXComponent {
	render() {
		const {
			opportunityKey,
			type
		} = this.props;

		return (
			<div
				class="opportunity-point-container"
				onMouseEnter={this.handleShowTooltip}
				onMouseLeave={this.handleHideTooltip}
				data-opportunity-key={opportunityKey}
				key={opportunityKey}
			>
				<OpportunityIcon type={type} />
			</div>
		);
	}
}

OpportunityPoint.PROPS = {
	opportunityKey: Config.string(),
	type: Config.string()
};

export default OpportunityPoint;