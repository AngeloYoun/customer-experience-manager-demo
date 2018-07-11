import JSXComponent, {Config} from 'metal-jsx';

import {fieldValue} from 'lib/field-formats';
import ticketIcon from 'resources/ticket';

const {
	LESA_TICKET_SEVERITY: {
		CRITICAL,
		MAJOR,
		MINOR
	}
} = fieldValue;

class LesaTicketIcon extends JSXComponent {
	render() {
		const {
			severity
		} = this.props;

		return (
			<div class={`lesa-ticket-icon-container ${severity.toLowerCase()}`}>
				{ticketIcon}
			</div>
		);
	}
}

LesaTicketIcon.PROPS = {
	severity: Config.string().required()
};

export default LesaTicketIcon;