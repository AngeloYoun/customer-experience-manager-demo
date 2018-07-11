import {List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import {checkIfPropsChanged} from 'lib/util';
import Avatar from 'components/avatar/Avatar';
import dossieraLogoWhiteIcon from 'resources/dossiera-logo-white-icon';

class PageHeader extends JSXComponent {
	render() {
		const {
			avatarHref,
			label,
			title
		} = this.props;

		return (
			<div class="page-header-container">
				{avatarHref && (
					<Avatar
						elementClasses="header-avatar"
						href={avatarHref}
						{...this.otherProps()}
					/>
				)}

				<div class="page-header">
					{label && (
						<h4 class="label">
							{label}
						</h4>
					)}

					<h1 class={`title ${label ? '' : 'no-label'}`}>
						{title}
					</h1>
				</div>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			[
				'title',
				'label',
				'path'
			],
			nextProps
		);
	}
}

PageHeader.PROPS = {
	avatarHref: Config.string(),
	label: Config.string(),
	title: Config.string().required()
};

export default PageHeader;