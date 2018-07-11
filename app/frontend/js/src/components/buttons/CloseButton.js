import JSXComponent from 'metal-jsx';

import Button from 'components/buttons/Button';
import xIcon from 'resources/x-icon';

class CloseButton extends JSXComponent {
	render() {
		return (
			<Button
				elementClasses="close-button-container"
				{...this.otherProps()}
			>
				{xIcon}
			</Button>
		);
	}
}

export default CloseButton;