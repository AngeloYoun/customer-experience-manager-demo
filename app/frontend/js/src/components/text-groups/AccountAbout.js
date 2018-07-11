import {fromJS, Map} from 'immutable';
import {camelCase, lowerCase} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';
import gql from 'graphql-tag';

import {NAME as ACCOUNTS, accountsActions} from 'actions/accounts';
import fieldMap from 'lib/field-formats';

const {
	[ACCOUNTS]: accountFields
} = fieldMap;

const fields = [
	{
		cssClass: 'account-owner',
		label: Liferay.Language.get('account-owner'),
		valueFormatter: account => account.get(accountFields.OWNER)
	},
	{
		cssClass: 'industry',
		label: Liferay.Language.get('industry'),
		valueFormatter: account => account.get(accountFields.INDUSTRY)
	},
	{
		cssClass: 'address',
		label: Liferay.Language.get('address'),
		valueFormatter: account => account.get(accountFields.ADDRESS)
	},
	{
		cssClass: 'account-phone',
		label: Liferay.Language.get('account-phone'),
		valueFormatter: account => {
			const phone = account.get(accountFields.PHONE_NUMBER)

			return [
				(phone && <a class="link" href={`skype:${phone.replace(/ |\+/g, '')}?call`}>{phone}</a>)
			]
		}
	},
	{
		cssClass: 'description',
		label: Liferay.Language.get('description'),
		valueFormatter: account => account.get(accountFields.DESCRIPTION)
	}
];

class AccountAbout extends JSXComponent {
	created() {
		const {
			accountId
		} = this.props;

		this._querySub = window.Dossiera.apollo.watchQuery({
			query: gql(
				`query AccountAbout($accountId: String) {
					account(id: $accountId) {
						${accountFields.ID}
						${accountFields.OWNER}
						${accountFields.INDUSTRY}
						${accountFields.PHONE_NUMBER}
						${accountFields.DESCRIPTION}
					}
				}`
			),
			variables: {
				accountId
			}
		}).subscribe({
			next: ({data}) => {
				this.setState(
					{
						account: fromJS(data.account),
					}
				)
			}
		})
	}

	detached() {
		this._querySub.unsubscribe();
	}

	render() {
		const {
			account
		} = this.state;

		return (
			<div class="account-about-container">
				{fields.map(
					({cssClass, label, valueFormatter}) => (
						<div class={`field-group ${cssClass}`}>
							<h4 class="label">
								{label}
							</h4>

							<h3 class="value">
								{valueFormatter(account)}
							</h3>
						</div>
					)
				)}
			</div>
		);
	}
}

AccountAbout.PROPS = {
	accountId: Config.string().required()
};

AccountAbout.STATE = {
	account: Config.instanceOf(Map).value(Map())
}

export default AccountAbout;