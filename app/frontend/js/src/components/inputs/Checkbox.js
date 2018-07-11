import JSXComponent, {Config} from 'metal-jsx';

import checkmark from 'resources/checkmark.js'

class Checkbox extends JSXComponent {
	render() {
		const {
			active: activeOverride,
			children,
			label
		} = this.props;

		const {
			active: activeInternal
		} = this.state;

		const active = activeOverride || activeInternal;

		return (
			<div
				class="checkbox-container"
				onClick={this._handleOnClick}
				{...this.otherProps}
			>
				<div class={`checkbox ${active ? 'active' : 'inactive'}`}>
					{checkmark}
				</div>

				{children && (
					<h3 class="label">{children}</h3>
				)}
			</div>
		);
	}

	_handleOnClick = event => {
		const {
			active: activeOverride,
			onClick
		} = this.props;

		const {
			active: activeInternal
		} = this.state;

		const active = (activeOverride || activeInternal);

		this.setState(
			{
				active: !active
			}
		);

		if (onClick) {
			onClick(event, active);
		}
	}
}

Checkbox.PROPS = {
	active: Config.bool(),
	label: Config.string(),
	onClick: Config.func()
};

Checkbox.STATE = {
	active: Config.bool().value(false)
}

export default Checkbox;