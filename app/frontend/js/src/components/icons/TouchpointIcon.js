import JSXComponent, {Config} from 'metal-jsx';

import {fieldValue} from 'lib/field-formats';
import automationIcon from 'resources/touchpoint-automation';
import callIcon from 'resources/touchpoint-call';
import clickIcon from 'resources/touchpoint-click';
import downloadIcon from 'resources/touchpoint-download';
import emailIcon from 'resources/touchpoint-email';
import eventIcon from 'resources/touchpoint-event';
import webpageIcon from 'resources/touchpoint-webpage';

const {
	TOUCHPOINT_TYPE: {
		AUTOMATION,
		CALL,
		CLICK,
		DOWNLOAD,
		EMAIL,
		EVENT,
		WEBPAGE
	}
} = fieldValue;

const typeIcon = {
	[AUTOMATION]: automationIcon,
	[CALL]: callIcon,
	[CLICK]: clickIcon,
	[DOWNLOAD]: downloadIcon,
	[EMAIL]: emailIcon,
	[EVENT]: eventIcon,
	[WEBPAGE]: webpageIcon
}

class TouchpointIcon extends JSXComponent {
	render() {
		const {
			type
		} = this.props;

		return (
			<div class="touchpoint-icon-container">
				{typeIcon[type]}
			</div>
		);
	}
}

TouchpointIcon.PROPS = {
	type: Config.string().value(EMAIL)
};

export default TouchpointIcon;