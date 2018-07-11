import JSXComponent, {Config} from 'metal-jsx';

import {fieldValue} from 'lib/field-formats';
import renewalIcon from 'resources/opportunity-renewal';
import professionalServicesIcon from 'resources/opportunity-professional-services';
import newProjectIcon from 'resources/opportunity-new-project';
import newBusinessIcon from 'resources/opportunity-new-business';
import existingBusinessIcon from 'resources/opportunity-existing-business';
import otherIcon from 'resources/opportunity-other';

const {
	OPPORTUNITY_TYPE: {
		EXISTING_BUSINESS,
		NEW_BUSINESS,
		NEW_PROJECT_EXISTING_BUSINESS,
		PROFESSIONAL_SERVICES,
		RENEWAL,
		TRAINING
	}
} = fieldValue;

const OTHER = 'OTHER';

const typeIcon = {
	[EXISTING_BUSINESS]: existingBusinessIcon,
	[NEW_BUSINESS]: newBusinessIcon,
	[NEW_PROJECT_EXISTING_BUSINESS]: newProjectIcon,
	[OTHER]: otherIcon,
	[PROFESSIONAL_SERVICES]: professionalServicesIcon,
	[RENEWAL]: renewalIcon
}

class OpportunityIcon extends JSXComponent {
	render() {
		const {
			type
		} = this.props;

		return (
			<div class="opportunity-icon-container">
				{typeIcon[type]}
			</div>
		);
	}
}

OpportunityIcon.PROPS = {
	type: Config.string().value(OTHER)
};

export default OpportunityIcon;