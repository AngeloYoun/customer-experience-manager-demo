import {fieldValue} from 'lib/field-formats';

function ProjectPhaseTag({phase}) {
	const {
		IN_DEVELOPMENT,
		LIVE_ADDITIONAL_DEVELOPMENT,
		LIVE_MAINTANANCE,
		LIVE_UPGRADE,
		NO_LONGER_MAINTAINING
	} = fieldValue.PROJECT_PHASE;

	let phaseClass = 'no-status';
	let phaseLabel = '--';

	if (phase === IN_DEVELOPMENT) {
		phaseClass = 'development';
		phaseLabel = Liferay.Language.get('development');
	}
	else if (phase === LIVE_ADDITIONAL_DEVELOPMENT || phase === LIVE_MAINTANANCE || phase === LIVE_UPGRADE) {
		phaseClass = 'live';
		phaseLabel = Liferay.Language.get('live');
	}
	else if (phase === NO_LONGER_MAINTAINING) {
		phaseClass = 'discontinued';
		phaseLabel = Liferay.Language.get('discontinued');
	}

	return (
		<div class={`project-phase-tag-container ${phaseClass}`}>
			<h5 class="project-phase-label">{phaseLabel}</h5>
		</div>
	);
}

export default ProjectPhaseTag;