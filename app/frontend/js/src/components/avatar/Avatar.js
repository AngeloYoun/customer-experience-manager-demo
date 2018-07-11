import JSXComponent, {Config} from 'metal-jsx';

import liferayLogoIcon from 'resources/liferay-logo-icon';

class Avatar extends JSXComponent {
	render() {
		const {
			badge,
			content,
			liferayLogo,
			href
		} = this.props;

		return (
			<div class="avatar-container">
				<span class="avatar-content">
					{content}
				</span>

				<div class="avatar" style={{backgroundImage: `url(${href})`}} />

				{badge && (
					<div class="badge">{badge}</div>
				)}

				{liferayLogo && (
					<div class="liferay-logo">{liferayLogoIcon}</div>
				)}
			</div>
		);
	}
}

Avatar.PROPS = {
	badge: Config.func(),
	content: Config.value(null),
	liferayLogo: Config.value(false),
	href: Config.string()
};

export default Avatar;