import JSXComponent, {Config} from 'metal-jsx';

import caretDownIcon from 'resources/caret-down-icon';
import caretUpIcon from 'resources/caret-up-icon';

class CollapsableContainer extends JSXComponent {
	attached() {
		this.state.collapsed = this.props.startCollapsed;
	}

	render() {
		const {
			children,
			title
		} = this.props;

		const {
			collapsed
		} = this.state;

		return (
			<div class="collapsable-container">
				<div
					class="header"
					onClick={this._handleCollapse}
				>
					<h3 class="title">
						{title}
					</h3>

					<div class="collapse-icon">
						{collapsed ? (
							caretUpIcon
						) : (
							caretDownIcon
						)}
					</div>
				</div>

				<div
					class={`collapse-group ${collapsed ? 'collapsed' : ''}`}
				>
					{children}
				</div>
			</div>
		);
	}

	_handleCollapse = () => {
		this.setState(
			{
				collapsed: !this.state.collapsed
			}
		);
	}
}

CollapsableContainer.PROPS = {
	startCollapsed: Config.bool().value(false),
	title: Config.string().required()
}

CollapsableContainer.STATE = {
	collapsed: Config.bool()
}

export default CollapsableContainer;