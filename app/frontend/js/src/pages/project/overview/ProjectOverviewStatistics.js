import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import fieldMap from 'lib/field-formats';
import {formatFields, subLanguageKey} from 'lib/util';

const {
	OPPORTUNITIES_AMOUNT_ANNUAL,
	OPPORTUNITIES_AMOUNT_LIFETIME,
	OPPORTUNITIES_CLOSED_LOST_AMOUNT,
	OPPORTUNITIES_CLOSED_LOST_COUNT,
	OPPORTUNITIES_CLOSED_WON_COUNT,
	OPPORTUNITIES_OPEN_AMOUNT,
	OPPORTUNITIES_OPEN_COUNT
} = fieldMap;

class ProjectOverviewStatistics extends JSXComponent {
	render() {
		const projectStatistics = this.props.projectStatistics;

		const formattedFields = formatFields(
			projectStatistics,
			[
				OPPORTUNITIES_AMOUNT_ANNUAL,
				OPPORTUNITIES_AMOUNT_LIFETIME,
				OPPORTUNITIES_CLOSED_LOST_AMOUNT,
				OPPORTUNITIES_CLOSED_LOST_COUNT,
				OPPORTUNITIES_CLOSED_WON_COUNT,
				OPPORTUNITIES_OPEN_AMOUNT,
				OPPORTUNITIES_OPEN_COUNT
			]
		);

		return (
			<div class="project-overview-statistics-container">
				<div class="info-item lifetime-value">
					<h4 class="label">
						{Liferay.Language.get('lifetime-value')}
					</h4>

					<h2 class="info">
						{formattedFields[OPPORTUNITIES_AMOUNT_LIFETIME]}
					</h2>

					<h4 class="meta">
						<div class="icon opportunity-close-won" />

						{subLanguageKey(
							Liferay.Language.get('x-closed-won-opportunities'),
							[formattedFields[OPPORTUNITIES_CLOSED_WON_COUNT]]
						)}
					</h4>
				</div>

				<div class="info-item open-opportunities">
					<h4 class="label">
						{Liferay.Language.get('open-opportunities')}
					</h4>

					<h2 class="info">
						{formattedFields[OPPORTUNITIES_OPEN_AMOUNT]}
					</h2>

					<h4 class="meta">
						<div class="icon opportunity-open" />

						{subLanguageKey(
							Liferay.Language.get('x-open-opportunities'),
							[formattedFields[OPPORTUNITIES_OPEN_COUNT]]
						)}
					</h4>
				</div>

				<div class="info-item open-opportunities">
					<h4 class="label">
						{Liferay.Language.get('lost-opportunities')}
					</h4>

					<h2 class="info">
						{formattedFields[OPPORTUNITIES_CLOSED_LOST_AMOUNT]}
					</h2>

					<h4 class="meta">
						<div class="icon opportunity-close-lost" />

						{subLanguageKey(
							Liferay.Language.get('x-closed-lost-opportunities'),
							[formattedFields[OPPORTUNITIES_CLOSED_LOST_COUNT]]
						)}
					</h4>
				</div>

				<div class="annual-revenue info-item">
					<h4 class="label">
						{Liferay.Language.get('annual-revenue')}
					</h4>

					<h2 class="info">
						{formattedFields[OPPORTUNITIES_AMOUNT_ANNUAL]}
					</h2>
				</div>
			</div>
		);
	}
}

ProjectOverviewStatistics.PROPS = {
	projectStatistics: Config.instanceOf(Map)
};

export default ProjectOverviewStatistics;