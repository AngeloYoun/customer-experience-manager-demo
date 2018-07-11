import JSXComponent, {Config} from 'metal-jsx';

import Avatar from 'components/avatar/Avatar';
import CloseButton from 'components/buttons/CloseButton';

class Alert extends JSXComponent {
	render() {
		const {
			avatarHref,
			badge,
			children,
			closeAlert,
			content
		} = this.props;

		return (
			<div
				class="alert-container"
			>
				<Avatar
					badge={badge}
					content={content}
					elementClasses="alert-avatar"
					href={avatarHref}
				/>

				{closeAlert && (
					<CloseButton onClick={closeAlert} />
				)}

				{children}
			</div>
		);
	}
}

Alert.PROPS = {
	avatarHref: Config.string(),
	badge: Config.func(),
	closeAlert: Config.func(),
	content: Config.value(null)
};

export default Alert;