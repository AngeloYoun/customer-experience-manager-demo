import {isNil} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';

import ActionButton from 'components/buttons/ActionButton';
import PlaceholderMessage from 'components/text-groups/PlaceholderMessage';

class ErrorMessage extends JSXComponent {
	render() {
		const {
			errorMessage,
			refetchData
		} = this.props;

		return (
			<PlaceholderMessage
				elementClasses="error-message-container"
			>
				<h3 class="sorry">
					{Liferay.Language.get('sorry')}
				</h3>

				<h3 class="error-message">
					{errorMessage}
				</h3>

				{!isNil(refetchData) && (
					<ActionButton
						buttonLabel={Liferay.Language.get('please-try-again')}
						onClick={refetchData}
					/>
				)}
			</PlaceholderMessage>
		);
	}
}

ErrorMessage.PROPS = {
	errorMessage: Config.string().value(
		Liferay.Language.get('something-went-wrong-while-trying-to-get-your-data')
	),
	refetchData: Config.func()
};

export default ErrorMessage;