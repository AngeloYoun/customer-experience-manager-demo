import {List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import ListComponent from 'components/list/List';
import PlaceholderMessage from 'components/text-groups/PlaceholderMessage';

import caretDownIcon from 'resources/caret-down-icon';
import caretUpIcon from 'resources/caret-up-icon';

class Table extends JSXComponent {
	created() {
		const {
			defaultOrderByAscending,
			defaultOrderByColumnKey
		} = this.props;

		this.state.orderByAscending = defaultOrderByAscending;
		this.state.orderByColumnKey = defaultOrderByColumnKey;
	}

	render() {
		const {
			columns,
			focused,
			noDataMessage
		} = this.props;

		let {
			rowItems
		} = this.props;

		const {
			orderByAscending,
			orderByColumnKey
		} = this.state;

		const orderByColumn = columns.find(
			column => column.has('comparator') && column.get('key') == orderByColumnKey
		);

		rowItems = orderByColumn ? rowItems.sort(orderByColumn.get('comparator')) : rowItems;

		rowItems = orderByAscending ? rowItems.reverse() : rowItems;

		return (
			<div class="table-container">
				<div class="table-head">
					{columns.map(
						column => this._renderTableHeadCell(
							column,
							orderByAscending,
							orderByColumnKey
						)
					)}
				</div>

				<div class="table-body">
					{rowItems.size ? (
						<ListComponent
							focused={focused}
							itemRenderer={this._renderTableRow}
							listItems={rowItems}
						/>
					) : (
						<PlaceholderMessage
							message={noDataMessage}
						/>
					)}
				</div>
			</div>
		);
	}

	_handleOrderByColumn = event => {
		const key = event.target.dataset.key;

		if (key == this.state.orderByColumnKey) {
			this.state.orderByAscending = !this.state.orderByAscending;
		}
		else {
			this.state.orderByColumnKey = key;
		}
	}

	_renderTableCell = (key, renderer, itemData) => (
		<div class={`table-cell column-${key}`}>
			{renderer(itemData)}
		</div>
	)

	_renderTableHeadCell = (column, orderByAscending, orderByColumnKey) => {
		const key = column.get('key');
		const label = column.get('label');

		const sortable = column.has('comparator');

		return (
			<div
				class={`table-head-cell column-${key} ${sortable ? 'sortable' : ''}`}
				data-key={key}
				onClick={sortable ? this._handleOrderByColumn : f => f}
			>
				{label}

				{orderByColumnKey === key &&
					(orderByAscending ? caretUpIcon : caretDownIcon)
				}
			</div>
		);
	}

	_renderTableRow = ({index, itemData, selected}) => (
		<div
			class={`table-row ${selected ? 'selected' : ''}`}
			key={index}
		>
			<a
				class="link"
				href={this.props.renderRowURL(itemData)}
			>
				{this.props.columns.map(
					column => this._renderTableCell(
						column.get('key'),
						column.get('renderer'),
						itemData
					)
				)}
			</a>
		</div>
	);
}

Table.PROPS = {
	columns: Config.instanceOf(List).required(),
	defaultOrderByAscending: Config.bool().value(false),
	defaultOrderByColumnKey: Config.string(),
	focused: Config.bool().value(false),
	noDataMessage: Config.string().value(Liferay.Language.get('there-are-no-entries-for-this-table'))
};

Table.STATE = {
	orderByAscending: Config.bool(),
	orderByColumnKey: Config.string()
};

export default Table;