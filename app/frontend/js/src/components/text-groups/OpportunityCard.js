import {Map, fromJS} from 'immutable';
import Moment from 'moment';
import JSXComponent, {Config} from 'metal-jsx';
import gql from 'graphql-tag';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as PROJECTS} from 'actions/projects';
import OpportunityIcon from 'components/icons/OpportunityIcon';
import fieldMap from 'lib/field-formats';
import {formatCurrency, subLanguageKey, subLanguageKeyArray} from 'lib/util';

const {
	[ACCOUNTS]: accountsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[PROJECTS]: projectsFields
} = fieldMap;

class OpportunityCard extends JSXComponent {
	created() {
		const {
			opportunityId
		} = this.props;

		this._querySub = window.Dossiera.apollo.watchQuery({
			query: gql(
				`query OpportunityCard($opportunityId: String) {
					opportunity(id: $opportunityId) {
						${opportunitiesFields.LIST_PRICE_TOTAL}
						${opportunitiesFields.ACCOUNT} {
							${accountsFields.NAME}
							${accountsFields.ID}
						}
						${opportunitiesFields.ID}
						${opportunitiesFields.NAME}
						${opportunitiesFields.TYPE}
						${opportunitiesFields.CURRENCY_ISO_CODE}
						${opportunitiesFields.CLOSE_DATE}
						${opportunitiesFields.PROJECT} {
							${accountsFields.NAME}
							${accountsFields.ID}
						}
					}
				}`
			),
			variables: {
				opportunityId
			}
		}).subscribe({
			next: ({data}) => {
				this.setState(
					{
						opportunity: fromJS(data.opportunity),
					}
				)
			}
		})
	}

	detached() {
		this._querySub.unsubscribe();
	}

	render () {
		const {
			opportunity
		} = this.state;

		if (opportunity) {
			const account = opportunity.get(opportunitiesFields.ACCOUNT)

			const project = opportunity.get(opportunitiesFields.PROJECT);

			const accountName = account ? account.get(accountsFields.NAME) : '';

			const projectName = project ? project.get(projectsFields.NAME) : '';

			return (
				<a href={`${window.Dossiera.URLS.HOST_URL}/accounts/${account.get(accountsFields.ID)}/opportunities/${opportunity.get(opportunitiesFields.ID)}`}>
					<div class="opportunity-card-container">
						<div class="title">
							<h3 class="name">
								{opportunity.get(opportunitiesFields.NAME).replace(/(?:.*?-){2}(.*?$)/, (match, name) => name)}

								<OpportunityIcon type={opportunity.get(opportunitiesFields.TYPE)} />
							</h3>

							{account && project && (
								<h4 class="opportunity-path">
									{subLanguageKeyArray(
										Liferay.Language.get('x-/-x'),
										[
											<a class="account link" href={`${window.Dossiera.URLS.HOST_URL}/accounts/${account.get(accountsFields.ID)}`}>
												{accountName}
											</a>,
											<a class="project link" href={`${window.Dossiera.URLS.HOST_URL}/accounts/${account.get(accountsFields.ID)}/projects/${project.get(projectsFields.ID)}`}>
												{projectName}
											</a>
										]
									)}
								</h4>
							)}

							<h4 class="closing-in">
								{subLanguageKey(
									Liferay.Language.get('closing-in-x'),
									[Moment(opportunity.get(opportunitiesFields.CLOSE_DATE)).fromNow(true)]
								)}
							</h4>
						</div>

						<div class="meta">
							<h4 class="amount">
								{formatCurrency(
									opportunity.get(opportunitiesFields.LIST_PRICE_TOTAL),
									opportunity.get(opportunitiesFields.CURRENCY_ISO_CODE)
								)}
							</h4>
						</div>
					</div>
				</a>
			)
		}
	}
}

OpportunityCard.PROPS = {
	opportunityId: Config.string().required()
};

OpportunityCard.STATE = {
	opportunity: Config.instanceOf(Map)
};

export default OpportunityCard;