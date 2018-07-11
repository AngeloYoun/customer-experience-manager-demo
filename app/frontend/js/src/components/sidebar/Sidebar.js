import {fromJS, List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import {loopActions} from 'actions/loop';
import {checkIfPropsChanged, getLoopNameFromEmail} from 'lib/util';
import Avatar from 'components/avatar/Avatar';
import accountsIcon from 'resources/accounts-icon';
import DataHandler from 'components/wrappers/DataHandler';
import dossieraLogoWhiteIcon from 'resources/dossiera-logo-white-icon';
import homeIcon from 'resources/home-icon';
import settingsIcon from 'resources/settings-icon';
import {requestActions} from 'lib/request';

export const locationsMap = {
	ACCOUNTS: 'accounts',
	ADMIN: 'admin',
	HOME: 'home'
}

const iconsMap = {
	[locationsMap.ACCOUNTS]: accountsIcon,
	[locationsMap.ADMIN]: settingsIcon,
	[locationsMap.HOME]: homeIcon
}

class Sidebar extends JSXComponent {
	render() {
		const {
			loop,
			selected
		} = this.props;

		const currentUserEmail = 'brian.kim@liferay.com';

		return (
			<div class="sidebar-container">
				<a href={`${window.Dossiera.URLS.HOST_URL}/${locationsMap.HOME}`}>
					<div class="logo">
						{dossieraLogoWhiteIcon}
					</div>
				</a>

				<div class="side-navigation">
					{this._renderIconLink(locationsMap.HOME, selected)}

					{this._renderIconLink(locationsMap.ACCOUNTS, selected)}
				</div>

				<div class="controls">
					{this._renderIconLink(locationsMap.ADMIN, selected)}

					{loop && (
						<a href={`${window.Dossiera.URLS.HOST_URL}/c/portal/logout`}>
							<Avatar
								elementClasses="user-avatar on-dark"
								href={`https://loop.liferay.com${loop.getIn([currentUserEmail, 'profileImageData', 'imageURL_web'])}`}
							/>
						</a>
					)}
				</div>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			[
				'loop',
				'selected'
			],
			nextProps
		);
	}

	_renderIconLink = (key, selected) => (
		<a
			class={`sidebar-icon ${key === selected ? 'active' : ''}`}
			href={`${window.Dossiera.URLS.HOST_URL}/${key}`}
		>
			{iconsMap[key]}
		</a>
	);
}

Sidebar.PROPS = {
	loop: Config.instanceOf(Map),
	selected: Config.string().required()
};

export default Sidebar;