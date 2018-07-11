import JSXComponent, {Config} from 'metal-jsx';

import Avatar from 'components/avatar/Avatar';

export const userInfoSizes = {
	LARGE: 'large'
};

class UserInfo extends JSXComponent {
	render() {
		const {
			avatarHref,
			name,
			secondary,
			size
		} = this.props;

		return (
			<div class={`user-info-container ${size}`}>
				<Avatar
					content={this._getInitials(name)}
					elementClasses="avatar"
					href={avatarHref}
				/>

				<div class="info">
					<h3 class="name">
						{name}
					</h3>

					{secondary &&
						<h4 class="secondary">
							{secondary}
						</h4>
					}
				</div>
			</div>
		);
	}

	_getInitials = name => {
		const spaceDelineatedName = name.split(' ', 2);

		const firstLetter = spaceDelineatedName[0] ? spaceDelineatedName[0].charAt(0) : '';
		const lastLetter = spaceDelineatedName[1] ? spaceDelineatedName[1].charAt(0) : '';

		return `${firstLetter}${lastLetter}`;
	}
}

UserInfo.PROPS = {
	avatarHref: Config.string(),
	name: Config.string(),
	secondary: Config.string(),
	size: Config.string()
};

export default UserInfo;