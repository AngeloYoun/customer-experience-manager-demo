import JSXComponent, {Config} from 'metal-jsx';

class ActiveTag extends JSXComponent {
	render() {
		const {
			hideInactive,
			status
        } = this.props;

		return (
			<div class={`active-tag-container ${hideInactive ? 'hide-inactive' : ''} ${status ? 'active' : 'inactive'}`}>
				{status ? Liferay.Language.get('active') : Liferay.Language.get('inactive')}
			</div>
		);
	}
}

ActiveTag.PROPS = {
	hideInactive: Config.bool().value(false),
	status: Config.bool().required()
};

export default ActiveTag;