import JSXComponent from 'metal-jsx';

import loadingSpinner from 'resources/dossiera-loading-spinner';

class LoadingSpinner extends JSXComponent {
	render() {
		return (
			<div class="loading-spinner-container">
				{loadingSpinner}
			</div>
		);
	}
}

export default LoadingSpinner;