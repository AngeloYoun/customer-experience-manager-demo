import JSXComponent from 'metal-jsx';

import ProjectPhaseTag from 'components/tag/ProjectPhaseTag';
import SubscriptionLevelTag from 'components/tag/SubscriptionLevelTag';

export const tagTypes = {
	PROJECT_PHASE: 'PROJECT_PHASE',
	SUBSCRIPTION_LEVEL: 'SUBSCRIPTION_LEVEL'
};

class Tag extends JSXComponent {
	render() {
		const {options, type} = this.props;

		let component;

		if (type === tagTypes.PROJECT_PHASE) {
			component = <ProjectPhaseTag phase={options.phase} />;
		}
		else if (type === tagTypes.SUBSCRIPTION_LEVEL) {
			component = <SubscriptionLevelTag level={options.level} />;
		}

		return component;
	}
}

Tag.PROPS = {
	options: {
		value: ''
	},
	tag: {
		value: ''
	}
};

export default Tag;