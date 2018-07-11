import {List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

class NavTabs extends JSXComponent {
	render() {
		const {
			onClick,
			selected,
			tabs
		} = this.props;

		return (
			<div class="nav-tabs-container">
				{tabs.map(
					tab => (
						<h4
							class={`tab ${tab.get('key') === selected ? 'selected' : ''}`}
							onClick={onClick(
								tab.get('key')
							)}
						>
							{tab.get('label')}
						</h4>
					)
				).toJS()}
			</div>
		);
	}
}

NavTabs.PROPS = {
	tabs: Config.instanceOf(List),
	selected: Config.string()
}

export default NavTabs;