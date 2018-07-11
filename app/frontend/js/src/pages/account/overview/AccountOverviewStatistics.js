import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import fieldMap from 'lib/field-formats';
import {formatFields, subLanguageKey} from 'lib/util';

const {
	ACCOUNT_STATS_OPPORTUNITIES_CLOSED_WON,
	ACCOUNT_STATS_TIME_AS_CUSTOMER,
	OPPORTUNITIES_AMOUNT_ANNUAL,
	OPPORTUNITIES_AMOUNT_LIFETIME,
	OPPORTUNITIES_CLOSED_LOST_AMOUNT,
	OPPORTUNITIES_CLOSED_LOST_COUNT,
	OPPORTUNITIES_CLOSED_WON_COUNT,
	OPPORTUNITIES_OPEN_AMOUNT,
	OPPORTUNITIES_OPEN_COUNT
} = fieldMap;

class AccountOverviewStatistics extends JSXComponent {
	render() {
		const {
			accountStatistics
		} = this.props;

		const formattedFields = formatFields(
			accountStatistics,
			[
				OPPORTUNITIES_AMOUNT_ANNUAL,
				OPPORTUNITIES_AMOUNT_LIFETIME,
				OPPORTUNITIES_CLOSED_LOST_AMOUNT,
				OPPORTUNITIES_CLOSED_LOST_COUNT,
				ACCOUNT_STATS_OPPORTUNITIES_CLOSED_WON,
				OPPORTUNITIES_CLOSED_WON_COUNT,
				OPPORTUNITIES_OPEN_AMOUNT,
				OPPORTUNITIES_OPEN_COUNT,
				ACCOUNT_STATS_TIME_AS_CUSTOMER
			]
		);

		return (
			<div class="account-overview-statistics-container">
				<div class="info-item lifetime-value">
					<h3 class="label">
						{Liferay.Language.get('lifetime-value')}
					</h3>

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
					<h3 class="label">
						{Liferay.Language.get('open-opportunities')}
					</h3>

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
					<h3 class="label">
						{Liferay.Language.get('lost-opportunities')}
					</h3>

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
					<h3 class="label">
						{Liferay.Language.get('bookings-in-the-last-12-months')}
					</h3>

					<h2 class="info">
						{formattedFields[OPPORTUNITIES_AMOUNT_ANNUAL]}
					</h2>
				</div>
			</div>
		);
	}
}

AccountOverviewStatistics.PROPS = {
	accountStatistics: Config.instanceOf(Map)
};

export default AccountOverviewStatistics;