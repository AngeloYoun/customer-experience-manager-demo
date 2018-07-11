import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {login, postLogin} from 'actions/login';
import Form from 'components/forms/Form';
import FormSubmit from 'components/forms/FormSubmit';
import TextInput from 'components/inputs/TextInput';
import Modal from 'components/modal/Modal';
import dossieraLogo from 'resources/dossiera-logo-icon';
import loadingEllipses from 'resources/loading-ellipses';

const LOGIN_FAILURE_INDICATOR = 'Authentication failed';

class LoginModal extends JSXComponent {
	attached() {
		document.addEventListener('keydown', this._suppressKeydown, true);
	}

	detached() {
		document.removeEventListener('keydown', this._suppressKeydown, true);
	}

	render() {
		const {
			email,
			failedAttempt,
			loggedIn,
			loggingIn,
			password
		} = this.state;

		const submitDisabled = !email || !password;

		return (
			<Modal
				closeAlert={this._closeAlert}
				elementClasses={`login-modal-container ${loggedIn ? 'login-success' : ''} ${failedAttempt ? 'login-failed' : ''}`}
				showHeader={false}
			>
				{dossieraLogo}

				{loggedIn ? (
					<h3 class="login-success-message">
						{Liferay.Language.get('login-successful')}
					</h3>
				) : (
					<h3 class="session-timeout-message">
						{Liferay.Language.get('sorry-your-session-has-expired')}

						<br />

						{Liferay.Language.get('please-reauthenticate-to-continue')}
					</h3>
				)}

				{failedAttempt && (
					<h3 class="failed-attempt-warning">
						{Liferay.Language.get('invalid-email-or-password')}
					</h3>
				)}

				<Form>
					<h3 class="input-label">
						{Liferay.Language.get('email')}
					</h3>

					<TextInput
						autofocus={true}
						elementClasses="large"
						initialValue={'@liferay.com'}
						onChange={this._handleEmailInput}
					/>

					<h3 class="input-label">
						{Liferay.Language.get('password')}
					</h3>

					<TextInput
						elementClasses="large"
						initialValue={''}
						onChange={this._handlePasswordInput}
						type="password"
					/>

					<FormSubmit
						disabled={submitDisabled}
						elementClasses={`login-button ${submitDisabled ? 'disabled' : ''}`}
						label={loggingIn ? loadingEllipses : Liferay.Language.get('login')}
						onClick={this._handleLogin}
					/>
				</Form>
			</Modal>
		);
	}

	_handleEmailInput = email => {
		this.setState(
			{
				email
			}
		);
	}

	_handleLogin = event => {
		const {
			postLogin
		} = this.props;

		const {
			email,
			password
		} = this.state;

		this.setState(
			{
				failedAttempt: false,
				loggingIn: true
			}
		);

		postLogin(
			{
				password,
				username: email
			}
		).then(
			({response}) => {
				window.setTimeout(
					() => {
						return response.includes(LOGIN_FAILURE_INDICATOR) ? this._handleLoginFailure() : this._handleLoginSuccess();
					},
					200
				);
			}
		);
	}

	_handleLoginFailure = () => {
		this.setState(
			{
				failedAttempt: true,
				loggingIn: false
			}
		);
	}

	_handleLoginSuccess = () => {
		const {
			login
		} = this.props;

		this.setState(
			{
				loggedIn: true,
				loggingIn: false
			}
		);

		window.setTimeout(
			() => {
				login();
			},
			1500
		);
	}

	_handlePasswordInput = password => {
		this.setState(
			{
				password
			}
		);
	}

	_redirect = () => {
		const {
			alertProps,
			closeAlert
		} = this.props;

		closeAlert(
			alertProps.get('id')
		);
	}

	_suppressKeydown = event => {
		return event.stopImmediatePropagation();
	}

	_toggleShowDetails = () => {
		this.setState(
			{
				showDetails: !this.state.showDetails
			}
		);
	}
}

LoginModal.PROPS = {
	hideModal: Config.func().required(),
	login: Config.func().required(),
	postLogin: Config.func().required()
};

LoginModal.STATE = {
	email: Config.string(),
	failedAttempt: Config.bool().value(false),
	loggedIn: Config.bool().value(false),
	loggingIn: Config.bool().value(false),
	password: Config.string()
};

export default connect(
	null,
	{
		login,
		postLogin
	}
)(LoginModal);