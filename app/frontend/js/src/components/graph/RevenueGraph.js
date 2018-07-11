import {fromJS, List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import Graph from 'components/graph/Graph';
import {checkIfPropsChanged} from 'lib/util';

const GRAPH_GROUP_PAST = 'past';

const GRAPH_GROUP_PROJECTED = 'projected';

class RevenueGraph extends JSXComponent {
	render() {
		const {
			endDate,
			highestRevenue,
			pastRevenue,
			projectedRevenue,
			revenueGraphHeight,
			startDate
		} = this.props;

		const timelineEndDate = Moment(endDate);
		const timelineStartDate = Moment(startDate);

		const data = new List().concat(
			pastRevenue.map(
				revenueEntry => this._formatRevenue(GRAPH_GROUP_PAST)(revenueEntry.toJS())
			),
			projectedRevenue.map(
				revenueEntry => this._formatRevenue(GRAPH_GROUP_PROJECTED)(revenueEntry.toJS())
			)
		);

		return (
			<Graph
				data={data}
				groups={List(
					[
						{
							className: 'past-group',
							content: 'revenue',
							id: GRAPH_GROUP_PAST
						},
						{
							className: 'projected-group',
							content: 'projected',
							id: GRAPH_GROUP_PROJECTED
						}
					]
				)}
				options={this._configureGraphOptions(
					{
						highestRevenue,
						revenueGraphHeight,
						timelineEndDate,
						timelineStartDate
					}
				)}
			/>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			[
				'endDate',
				'highestRevenue',
				'pastRevenue',
				'projectedRevenue',
				'startDate'
			],
			nextProps
		);
	}

	_configureGraphOptions = ({highestRevenue, revenueGraphHeight, timelineEndDate, timelineStartDate}) => fromJS(
		{
			dataAxis: {
				left: {
					range: {
						max: (highestRevenue > 0) ? highestRevenue : 1,
						min: 0
					}
				},
				visible: false
			},
			drawPoints: {
				size: 1,
				style: 'circle'
			},
			end: timelineEndDate.valueOf(),
			height: revenueGraphHeight,
			legend: {
				enabled: false
			},
			showMajorLabels: false,
			showMinorLabels: false,
			start: timelineStartDate.valueOf(),
			stepped: true
		}
	);

	_formatRevenue = group => ({amount, date}) => {
		return Map(
			{
				group,
				id: `${group}-${date.format('YYYY-MM-DD')}`,
				x: date,
				y: amount
			}
		);
	}
}

RevenueGraph.PROPS = {
	endDate: Config.string().required(),
	highestRevenue: Config.number().value(0),
	pastRevenue: Config.instanceOf(List),
	projectedRevenue: Config.instanceOf(List),
	revenueGraphHeight: Config.number().required(),
	startDate: Config.string().required()
};

export default RevenueGraph;