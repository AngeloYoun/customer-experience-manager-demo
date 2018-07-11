import {fieldValue} from 'lib/field-formats';

const {
	GOLD,
	PLATINUM,
	SILVER
} = fieldValue.SUBSCRIPTION_LEVEL;

function SubscriptionLevelTag({level}) {
	let levelClass = 'no-level';

	if (level === GOLD) {
		levelClass = 'gold';
	}
	else if (level === PLATINUM) {
		levelClass = 'platinum';
	}
	else if (level === SILVER) {
		levelClass = 'silver';
	}

	return (
		<div class={`subscription-level-tag-container ${levelClass}`} />
	);
}

export default SubscriptionLevelTag;