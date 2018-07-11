import JSXComponent, {Config} from 'metal-jsx';

import CloseButton from 'components/buttons/CloseButton';

class Modal extends JSXComponent {
	render() {
		const {
			children,
			hideModal,
			showHeader,
			titleRenderer
		} = this.props;

		return (
			<div
				class={'modal-container'}
			>
				<div
					class={`scrim ${hideModal ? '' : 'no-hide'}`}
					onClick={hideModal}
				/>

				<div class="modal">
					{showHeader && (
						<div class="modal-header">
							<h2 class="modal-title">
								{titleRenderer()}
							</h2>

							{hideModal && (
								<CloseButton
									onClick={hideModal}
								/>
							)}
						</div>
					)}

					{children}
				</div>
			</div>
		);
	}
}

Modal.PROPS = {
	children: Config.array(),
	hideModal: Config.func(),
	showHeader: Config.bool().value(true),
	titleRenderer: Config.func()
};

export default Modal;