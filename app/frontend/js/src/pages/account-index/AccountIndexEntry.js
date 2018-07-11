import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import fieldMap from 'lib/field-formats';
import {formatFields} from 'lib/util';
import ActiveTag from 'components/tag/ActiveTag';

const {
	ACCOUNT_ACTIVE_SUBSCRIPTION,
	ACCOUNT_INDUSTRY,
	ACCOUNT_KEY,
	ACCOUNT_MODIFIED_DATE,
	ACCOUNT_NAME,
	ACCOUNT_TYPE
} = fieldMap;

class AccountIndexEntry extends JSXComponent {
	detached() {
		document.removeEventListener('keydown', this._onKeypress);
	}

	render() {
		const {
			account,
			highlight,
			selected
		} = this.props;

		const formattedFields = formatFields(
			account,
			[
				ACCOUNT_ACTIVE_SUBSCRIPTION,
				ACCOUNT_INDUSTRY,
				ACCOUNT_KEY,
				ACCOUNT_MODIFIED_DATE,
				ACCOUNT_NAME,
				ACCOUNT_TYPE
			]
		);

		let accountName = formattedFields[ACCOUNT_NAME];

		if (highlight) {
			accountName = this._highlightMatch(accountName, highlight);
		}

		const selectedClass = selected ? 'selected' : '';

		return (
			<div class={`account-index-entry-container ${selectedClass}`}>
				<a
					class="link"
					href={`${window.Dossiera.URLS.PORTLET_URL}account/${formattedFields[ACCOUNT_KEY]}`}
				>
					<div class="account-title">
						<h2 class="account-name">
							{accountName}
						</h2>

						<h4 class="account-industry">
							{formattedFields[ACCOUNT_TYPE]}
						</h4>
					</div>

					<div class="account-info">
						<div class="info-item active-subscription">
							<ActiveTag
								hideInactive={true}
								status={formattedFields[ACCOUNT_ACTIVE_SUBSCRIPTION]}
							/>
						</div>

						<div class="info-item industry">
							<h4 class="label">
								{Liferay.Language.get('industry')}
							</h4>

							<h3 class="info">
								{formattedFields[ACCOUNT_INDUSTRY]}
							</h3>
						</div>

						<div class="info-item last-modified">
							<h4 class="label">
								{Liferay.Language.get('last-modified')}
							</h4>

							<h3 class="info">
								{formattedFields[ACCOUNT_MODIFIED_DATE]}
							</h3>
						</div>
					</div>
				</a>
			</div>
		);
	}

	syncSelected(selected) {
		if (selected) {
			document.addEventListener('keydown', this._onKeypress);
		}
		else {
			document.removeEventListener('keydown', this._onKeypress);
		}
	}

	_highlightMatch(string, match) {
		const matchIndex = string.toLowerCase().indexOf(match);

		const matchEndIndex = matchIndex + match.length;

		const highlight = string.substring(matchIndex, matchEndIndex);
		const matchPrefix = string.substring(0, matchIndex);
		const matchSuffix = string.substring(matchEndIndex);

		return [<span key={match}>{matchPrefix}<em class="highlight">{highlight}</em>{matchSuffix}</span>];
	}

	_onKeypress = event => {
		const key = event.key;

		if (key === 'Enter') {
			this.element.getElementsByClassName('link')[0].click();
		}
	}
}

AccountIndexEntry.PROPS = {
	account: Config.instanceOf(Map),
	highlight: Config.string(),
	selected: Config.value(false)
};

export default AccountIndexEntry;