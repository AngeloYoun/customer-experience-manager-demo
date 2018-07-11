import {List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import {checkIfPropsChanged} from 'lib/util';

const CSS_SCROLL_MARGIN = 60;

const KEY_CODE_CARRIAGE_RETURN = 13;

const KEY_CODE_DOWN_ARROW = 40;

const KEY_CODE_UP_ARROW = 38;

class ListComponent extends JSXComponent {
	detached() {
		document.removeEventListener('keydown', this._handleKeypress);
	}

	render() {
		const {
			itemRenderer,
			listItems
		} = this.props;

		const {
			selectedIndex
		} = this.state;

		return (
			<div
				class="list-container"
				key="list-container"
			>
				{listItems.map(
					(itemData, index) => itemRenderer(
						{
							index,
							itemData,
							list: listItems,
							selected: selectedIndex === index
						}
					)
				).toJS()}
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return nextState ? true : checkIfPropsChanged(
			[
				'focused',
				'itemRenderer',
				'listItems'
			],
			nextProps
		);
	}

	syncFocused(focused) {
		if (focused) {
			document.addEventListener('keydown', this._handleKeypress);

			this.state.selectedIndex = 0;
		}
		else {
			document.removeEventListener('keydown', this._handleKeypress);
		}
	}

	_handleKeypress = event => {
		const {
			listItems
		} = this.props;

		const {
			selectedIndex
		} = this.state;

		const container = this.element;
		const selectedElement = container.childNodes[selectedIndex];

		const keyCode = event.keyCode;

		if (selectedElement) {
			if (keyCode === KEY_CODE_DOWN_ARROW) {
				this._scrollDown(container, event, listItems, selectedElement, selectedIndex);
			}
			else if (keyCode === KEY_CODE_UP_ARROW) {
				this._scrollUp(container, event, listItems, selectedElement, selectedIndex);
			}
			else if (keyCode === KEY_CODE_CARRIAGE_RETURN) {
				selectedElement.click();
			}
		}
	}

	_isItemVisibleOnScrollDown(container, selectedElement) {
		const containerBoundingRect = container.getBoundingClientRect();

		const boundingRect = selectedElement.getBoundingClientRect();

		const elementHeight = selectedElement.offsetHeight;

		return containerBoundingRect.bottom > (boundingRect.bottom + elementHeight);
	}

	_isItemVisibleOnScrollUp(container, selectedElement) {
		const containerBoundingRect = container.getBoundingClientRect();

		const boundingRect = selectedElement.getBoundingClientRect();

		const elementHeight = selectedElement.offsetHeight;

		return containerBoundingRect.top < (boundingRect.top - elementHeight);
	}

	_scrollDown = (container, event, listItems, selectedElement, selectedIndex) => {
		if (selectedIndex < listItems.size - 1) {
			event.preventDefault();

			if (!this._isItemVisibleOnScrollDown(container, selectedElement)) {
				container.scrollTop = selectedElement.offsetTop + 2 * selectedElement.offsetHeight + CSS_SCROLL_MARGIN - container.offsetHeight;
			}

			this.setState(
				{
					selectedIndex: selectedIndex + 1
				}
			);
		}
	}

	_scrollUp = (container, event, listItems, selectedElement, selectedIndex) => {
		if (selectedIndex > 0) {
			event.preventDefault();

			if (!this._isItemVisibleOnScrollUp(container, selectedElement)) {
				container.scrollTop = selectedElement.offsetTop - selectedElement.offsetHeight - CSS_SCROLL_MARGIN;
			}

			this.setState(
				{
					selectedIndex: selectedIndex - 1
				}
			);
		}
	}
}

ListComponent.PROPS = {
	focused: Config.bool().value(false),
	itemRenderer: Config.func().required(),
	listItems: Config.instanceOf(List).required()
};

ListComponent.STATE = {
	selectedIndex: Config.number()
};

export default ListComponent;