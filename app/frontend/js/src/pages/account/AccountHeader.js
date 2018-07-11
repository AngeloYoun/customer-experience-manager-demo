import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import PageHeader from 'components/page-header/PageHeader';
import fieldMap from 'lib/field-formats';
import {checkIfPropsChanged, formatFields} from 'lib/util';

const {
	ACCOUNT_INDUSTRY,
	ACCOUNT_NAME,
	ACCOUNT_TYPE
} = fieldMap;

class AccountHeader extends JSXComponent {
	render() {
		const {
			account
		} = this.props;

		const formattedFields = formatFields(
			account,
			[
				ACCOUNT_INDUSTRY,
				ACCOUNT_NAME,
				ACCOUNT_TYPE
			]
		);

		const currentLocation = fromJS(
			{
				label: Liferay.Language.get('account'),
				name: formattedFields[ACCOUNT_NAME]
			}
		);

		const info = fromJS(
			[
				{
					label: Liferay.Language.get('type'),
					value: formattedFields[ACCOUNT_TYPE]
				},
				{
					label: Liferay.Language.get('industry'),
					value: formattedFields[ACCOUNT_INDUSTRY]
				}
			]
		);

		return (
			<PageHeader
				currentLocation={currentLocation}
				info={info}
			/>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			['account'],
			nextProps
		);
	}
}

AccountHeader.PROPS = {
	account: Config.instanceOf(Map)
};

export default AccountHeader;