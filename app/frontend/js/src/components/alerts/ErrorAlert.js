import {Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import Alert from 'components/alerts/Alert';
import ActionButton from 'components/buttons/ActionButton';
import {getPluralMessage} from 'lib/util';
import errorIcon from 'resources/error-icon';

class ErrorAlert extends JSXComponent {
	render() {
		const {
			alertProps
		} = this.props;

		const {
			showDetails
		} = this.state;

		const errors = alertProps.get('errors');

		return (
			<Alert
				avatarHref={`${window.Dossiera.URLS.IMAGES_URL}error_avatar.png`}
				badge={errorIcon}
				closeAlert={this._closeAlert}
				elementClasses="error-alert-container"
			>
				<h3 class="alert-message">
					{Liferay.Language.get('something-blew-up')}
				</h3>

				<div class="error">
					<h3 class="error-count-message">
						{getPluralMessage(
							Liferay.Language.get('x-error-occured'),
							Liferay.Language.get('x-errors-occured'),
							errors.size,
							<h2 class="error-count">{errors.size}</h2>
						)}
					</h3>

					<h4
						class="show-details"
						onClick={this._toggleShowDetails}
					>
						{showDetails ? Liferay.Language.get('hide-details') : Liferay.Language.get('show-details')}
					</h4>
				</div>

				{showDetails && (
					<div class="error-details">
						<h5 class="error-messages">{errors.join('\n')}</h5>
					</div>
				)}

				<div class="buttons">
					<ActionButton
						buttonLabel={Liferay.Language.get('ok')}
						elementClasses="ok-button"
						onClick={this._closeAlert}
					/>

					<ActionButton
						buttonLabel={Liferay.Language.get('report')}
						elementClasses="report-button"
						onClick={this._report}
					/>
				</div>
			</Alert>
		);
	}

	_closeAlert = () => {
		const {
			alertProps,
			closeAlert
		} = this.props;

		closeAlert(
			alertProps.get('id')
		);
	}

	_report = () => {
		window.open(
			`${window.Dossiera.URLS.LOOP_URL}/web/guest/home/-/loop/topics/_DossieraAppFeedback`
		);
	}

	_toggleShowDetails = () => {
		this.setState(
			{
				showDetails: !this.state.showDetails
			}
		);
	}
}

ErrorAlert.PROPS = {
	alertProps: Config.instanceOf(Map).required(),
	closeAlert: Config.func().required()
};

ErrorAlert.STATE = {
	showDetails: Config.bool().value(false)
};

export default ErrorAlert;