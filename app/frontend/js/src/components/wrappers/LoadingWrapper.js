import JSXComponent, {Config} from 'metal-jsx';

import LoadingSpinner from 'components/loading-spinner/LoadingSpinner';
import loadingEllipses from 'resources/loading-ellipses';

class LoadingWrapper extends JSXComponent {
	render() {
		const {
			children,
			dataLoaded,
			inline
		} = this.props;

		const loader = inline ? loadingEllipses : <LoadingSpinner />

		return dataLoaded ? children : loader;
	}
}

LoadingWrapper.PROPS = {
	dataLoaded: Config.bool().value(true),
	inline: Config.bool().value(false)
};

export default LoadingWrapper;