import {List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

export const DATE = '_DATE';

class TimelineVertical extends JSXComponent {
	render() {
		const {
			itemRenderers,
			items
		} = this.props;

		const itemsByUniqueDay = items.groupBy(
			item => Moment(
				item.get(DATE)
			).format('YYYY-MM-DD')
		);

		const sortedItems = itemsByUniqueDay.sortBy(
			(item, date) => -Moment(date).valueOf()
		)

		return (
			<div class="timeline-vertical-container">
				<div class="items">
					{sortedItems.map(
						(items, date) => {
							const sortedItems = items.sortBy(
								item => item.get(DATE)
							);

							return (
								<div class="timeline-date-group">
									<div class="activity-date">
										<h3 class="date">{Moment(date).format('MMMM Do YYYY')}</h3>
									</div>

									{sortedItems.map(
										(item, index) => (
											<div class="timeline-item" key={index}>
												{itemRenderers(item)}
											</div>
										)
									).toJS()}
								</div>
							)
						}
					).toJS()}
				</div>
			</div>
		);
	}
}

TimelineVertical.SYNC_UPDATES = true;

TimelineVertical.PROPS = {
	itemRenderers: Config.func().required(),
	items: Config.instanceOf(List).required(),
};

export default TimelineVertical;