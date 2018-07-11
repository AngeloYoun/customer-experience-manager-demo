import {OrderedMap, Map, List} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {remove, values} from 'lodash';
import Moment from 'moment';
import {polygonArea, linkHorizontal, scaleTime} from 'd3';
import {connect} from 'metal-redux';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as LESA_TICKETS} from 'actions/lesa-tickets';
import {loopActions} from 'actions/loop';
import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as PROJECTS} from 'actions/projects';
import {NAME as TOUCHPOINTS} from 'actions/touchpoints';
import fieldMap, {fieldValue} from 'lib/field-formats';
import GroupedModel from 'components/models/GroupedModel';
import TimelineMarker from 'components/timeline/TimelineMarker';
import LesaTicketModel from 'components/models/LesaTicketModel';
import OpportunityModel from 'components/models/OpportunityModel';
import TouchpointModel from 'components/models/TouchpointModel';
import {ITEM_HEIGHT, ITEM_WIDTH} from 'components/models/ActivityPoint';
import {requestActions} from 'lib/request';

const {
	[ACCOUNTS]: accountsFields,
	[LESA_TICKETS]: lesaTicketsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[PROJECTS]: projectsFields,
	[TOUCHPOINTS]: touchpointsFields
} = fieldMap;

const {
	LESA_TICKET_STATUS,
	TOUCHPOINT_STATUS
} = fieldValue;

const TYPE = 'TYPE';
const DATE = 'DATE';

const MARKER_VERTICAL_MARGIN = 32;
const MARKER_HORZ_MARGIN = 128;

const modelTypeMap = {
	[LESA_TICKETS]: ({activity, id, ...props}) => [
		<LesaTicketModel
			lesaTicket={activity}
			key={id}
			{...props}
		/>
	],
	[OPPORTUNITIES]: ({activity, id, ...props}) => [
		<OpportunityModel
			key={id}
			opportunity={activity}
			{...props}
		/>
	],
	[TOUCHPOINTS]: ({activity, id, ...props}) => [
		<TouchpointModel
			key={id}
			touchpoint={activity}
			{...props}
		/>
	],
	grouped: ({activity, id, ...props}) => [
		<GroupedModel
			key={id}
			activity={activity}
			{...props}
		/>
	]
};

class AccountActivitiesModel extends JSXComponent {
	syncAccountLesaTickets(accountLesaTickets) {
		const {
			accountOpportunities,
			accountTouchpoints
		} = this.props;

		const accountActivities = this._sortAndMapData(accountLesaTickets, accountOpportunities, accountTouchpoints);

		this.setState(
			{
				relations: this._mapRelations(accountActivities),
				sortedActivities: accountActivities
			}
		)
	}

	syncAccountOpportunities(accountOpportunities) {
		const {
			accountLesaTickets,
			accountTouchpoints
		} = this.props;

		const accountActivities = this._sortAndMapData(accountLesaTickets, accountOpportunities, accountTouchpoints);

		this.setState(
			{
				relations: this._mapRelations(accountActivities),
				sortedActivities: accountActivities
			}
		)
	}

	syncAccountTouchpoints(accountTouchpoints) {
		const {
			accountLesaTickets,
			accountOpportunities
		} = this.props;

		const accountActivities = this._sortAndMapData(accountLesaTickets, accountOpportunities, accountTouchpoints);

		this.setState(
			{
				relations: this._mapRelations(accountActivities),
				sortedActivities: accountActivities
			}
		)
	}

	render() {
		const {
			account,
			centerTimelineTo,
			clientWidth,
			contacts,
			getLoop,
			loop,
			height,
			horzScale,
			selectedId,
			toggleSidebar,
			width
		} = this.props;

		const {
			relations,
			sortedActivities,
			tooltip
		} = this.state;

		const vertScale = scaleTime().range(
			[0, height]
		).domain(
			[height, 0]
		);

		const collisionMap = [];

		const selectedRelations = relations.get(selectedId) || Map();

		const coordMap = {};

		const showRelation = false;

		const markerCollisionMap = [];
		const markers = [];
		const indicators = [];

		const addIndicator = this._addIndicator(indicators);
		const addMarker = this._addMarker(markers);
		const getScaleTimeValue = this._getScaleTimeValue(horzScale);

		const filteredActivities = sortedActivities.filter(
			activity => {
				const x = getScaleTimeValue(activity.get(DATE));

				return x > 0 && x < clientWidth
			}
		);

		if (!selectedId) {
			this._fillEventMarkers(addMarker, getScaleTimeValue);
		}

		// const groupMap = {};

		// const sortedAndGroupedActivities = filteredActivities.groupBy(
		// 	activity => {
		// 		const activityType = activity.get(TYPE)

		// 		const status = activity.get('status') || '';
		// 		const stage = activity.get('stage') || '';
		// 		const type = activity.get('type') || '';
		// 		const severity = activity.get('severity') || '';

		// 		const date = activity.get(DATE);

		// 		const x = getScaleTimeValue(date);

		// 		const relativeX = x / clientWidth * 100;

		// 		const id = `${stage}_${status}_${type}_${activityType}_${severity}_`

		// 		const prevX = groupMap[id];

		// 		groupMap[id] = (prevX && (relativeX - prevX) < 4) ? prevX : relativeX

		// 		return `${id}${groupMap[id]}`
		// 	}
		// )

		return (
			<div class="account-activities-model-container">
				{filteredActivities.map(
					activity => {
						// const grouped = activity.size > 1;

						// const firstActivity = activity.get(0);

						// activity = grouped ? activity : activity.get(0);

						let retVal = '';

						const id = activity.get('id');

						const selected = id === selectedId;

						const related = selectedRelations.includes(id) && !selected;

						if (!selectedId || (selected || related)) {
							const type = activity.get(TYPE);

							const date = activity.get(DATE);

							const x = getScaleTimeValue(date);


							const baseY = this._checkCollision(collisionMap, 0, x, ITEM_WIDTH);

							collisionMap[baseY] = x;

							const y = vertScale(baseY * ITEM_HEIGHT) - ITEM_HEIGHT;

							coordMap[id] = {x, y};

							retVal = modelTypeMap[type](
								{
									activity,
									contacts,
									elementClasses: !selectedId || (selected || related) ? '' : 'hide',
									id,
									loop,
									getLoop,
									selected,
									related,
									addMarker,
									addIndicator,
									handleActivityMouseEnter: this._handleActivityMouseEnter(x, y),
									handleActivityMouseLeave: this._handleActivityMouseLeave(x, y),
									handleSelectActivity: this._handleSelectActivity(id, date, type),
									getScaleTimeValue,
									x,
									y
								}
							);
						}
						return retVal;
					}
				).toJS()}

				{indicators}

				{markers.sort(
					(itemA, itemB) => itemA.x - itemB.x
				).map(
					({content, x}, index) => {
						const baseY = this._checkMarkerCollision(markerCollisionMap, 0, x, MARKER_HORZ_MARGIN);

						markerCollisionMap[baseY] = x;

						const y = vertScale(baseY * MARKER_VERTICAL_MARGIN) - MARKER_VERTICAL_MARGIN;

						return (
							<TimelineMarker
								xPosition={x}
								height={y}
								key={`${index}-${x}`}
							>
								{content}
							</TimelineMarker>
						)
					}
				)}

				{showRelation && !selected && (
					<svg class="relations">
						{relations.map(
							(relation, groupIndex) => relation.map(
								(id, index) => (
									index > 0 ? (
										<path
											class={`relation-path group-${groupIndex}`}
											d={linkHorizontal().x(d => d.x).y(d => d.y + (ITEM_HEIGHT / 2))({source: coordMap[relation.get(index - 1)], target: coordMap[id]})}
										/>
									) : ''
								)
							)
						).toJS()}
					</svg>
				)}

				<div
					class={`account-activities-tooltip ${tooltip.get('active') ? 'active' : ''}`}
					style={{
						position: 'absolute',
						transform: `translate(${tooltip.get('x')}px, ${tooltip.get('y')}px)`
					}}
					key="tooltip"
				>
					{tooltip.get('content')}
				</div>
			</div>
		)
	}

	_handleActivityMouseEnter = (x, y) => content => () => {
		this.setState(
			{
				tooltip: Map({
					active: true,
					content,
					x,
					y
				})
			}
		)
	}

	_handleActivityMouseLeave = (x, y) => () => {
		const {
			tooltip
		} = this.state;

		this.setState(
			{
				tooltip: tooltip.set('active', false)
			}
		)
	}

	_addIndicator = indicators => item => indicators.push(item);

	_addMarker = markers => ({content, x}) => {
		markers.push(
			{
				content,
				x
			}
		);
	}

	_fillEventMarkers = (addMarker, getScaleTimeValue) => {
		const {
			account,
			accountProjects
		} = this.props;

		const createdDate = account.get(accountsFields.CREATED_DATE);

		if (createdDate) {
			addMarker(
				{
					x: getScaleTimeValue(account.get(accountsFields.CREATED_DATE)),
					content: (
						<div>
							<h4 class="marker-label-text-primary">
								{'Account Created'}
							</h4>
						</div>
					)
				}
			)

			// accountProjects.forEach(
			// 	project => {
			// 		addMarker(
			// 			{
			// 				x: getScaleTimeValue(project.get(projectsFields.CREATED_DATE)),
			// 				content: (
			// 					<div>
			// 						<h4 class="marker-label-text-primary">
			// 							{project.get(projectsFields.NAME)}
			// 						</h4>

			// 						<h4 class="label">
			// 							{'Project Started'}
			// 						</h4>
			// 					</div>
			// 				)
			// 			}
			// 		)
			// 	}
			// );
		}
	}

	_getPrecedingOpportunityRelations = (opportunity, accountActivities) => {
		const precedingId = opportunity ? opportunity.get(opportunitiesFields.PRECEDING_OPPORTUNITY) : null;

		return precedingId ? this._getPrecedingOpportunityRelations(
			accountActivities.get(precedingId),
			accountActivities
		).push(precedingId) : new List();
	}

	_getRenewalOpportunityRelations = (opportunity, accountActivities) => {
		const renewalId = opportunity ? opportunity.get(opportunitiesFields.RENEWAL_OPPORTUNITY) : null;

		return renewalId ? this._getRenewalOpportunityRelations(
			accountActivities.get(renewalId),
			accountActivities
		).push(renewalId) : new List();
	}

	_mapOpportunityRelations = (opportunity, relations, accountActivities) => {
		const precedingOpportunities = this._getPrecedingOpportunityRelations(opportunity, accountActivities)

		const renewalOpportunties = this._getRenewalOpportunityRelations(opportunity, accountActivities)

		return relations.set(
			opportunity.get(opportunitiesFields.ID),
			new List().concat(
				precedingOpportunities,
				renewalOpportunties,
				opportunity.get(opportunitiesFields.TOUCHPOINTS)
			)
		);
	}

	_mapTouchpointRelations = (touchpoint, relations, accountActivities) => {
		return relations.set(
			touchpoint.get(touchpointsFields.ID),
			new List([
				touchpoint.get(touchpointsFields.OPPORTUNITY)
			])
		)
	}

	_mapRelations = accountActivities => {
		return (
			accountActivities.reduce(
				(relations, activity) => {
					const type = activity.get(TYPE);

					if (type === OPPORTUNITIES) {
						relations = this._mapOpportunityRelations(activity, relations, accountActivities);
					}
					else if (type === TOUCHPOINTS) {
						relations = this._mapTouchpointRelations(activity, relations, accountActivities);
					}

					return relations;
				},
				new Map()
			)
		);
	}

	_handleSelectActivity = (id, date, type) => (startDate, endDate) => event => {
		const {
			accountOpportunities,
			setViewTo,
			selectedId,
			toggleSidebar
		} = this.props;

		const {
			sortedActivities
		} = this.state;

		event.stopPropagation();

		const deselect = selectedId === id;

		const newSelectedId = selectedId === id ? '' : id;

		toggleSidebar(
			sortedActivities.find(
				item => item.get('id') === deselect ? '' : id
			),
			type
		);

		if (!deselect) {
			setViewTo(startDate, endDate);
		}
		else {
			setViewTo();
		}
	}

	_getScaleTimeValue = horzScale => value => horzScale(Moment(value).valueOf());

	_getDate = opportunity => Moment(opportunity.get(opportunitiesFields.CLOSE_DATE)).valueOf()

	_checkCollision = (collisionMap, y, x, itemWidth) => {
		return ((collisionMap[y] + itemWidth) > x) ? this._checkCollision(collisionMap, y + 1, x, itemWidth) : y
	}

	_checkMarkerCollision = (collisionMap, y, x, markerMargin) => {
		return ((collisionMap[y] + markerMargin) > x) ? this._checkMarkerCollision(collisionMap, y + 1, x, markerMargin) : y
	}

	_sortAndMapData = (accountLesaTickets, accountOpportunities, accountTouchpoints) => {
		return accountOpportunities.map(
			opportunity => opportunity.merge(
				Map(
					{
						[DATE]: Moment(opportunity.get(opportunitiesFields.CLOSE_DATE)).valueOf(),
						[TYPE]: OPPORTUNITIES
					}
				)
			)
		).concat(
			accountTouchpoints.map(
				touchpoint => touchpoint.merge(
					Map(
						{
							[DATE]: touchpoint.get(touchpointsFields.STATUS) === TOUCHPOINT_STATUS.COMPLETED ? (
								Moment(touchpoint.get(touchpointsFields.COMPLETED_DATE)).valueOf()
							 ) : (
								Moment(touchpoint.get(touchpointsFields.DUE_DATE)).valueOf()
							 ),
							[TYPE]: TOUCHPOINTS
						}
					)
				)
			).concat(
				accountLesaTickets.map(
					lesaTicket => lesaTicket.merge(
						Map(
							{
								[DATE]: lesaTicket.get(lesaTicketsFields.STATUS) === LESA_TICKET_STATUS.CLOSED ? (
									Moment(lesaTicket.get(lesaTicketsFields.ISSUE_CLOSED_DATE)).valueOf()
								) : (
									Moment(lesaTicket.get(lesaTicketsFields.ISSUE_REPORT_DATE)).valueOf()
								),
								[TYPE]: LESA_TICKETS
							}
						)
					)
				)
			)
		).sortBy(
			entry => {
				return entry.get(DATE)
			}
		);
	}
}

AccountActivitiesModel.PROPS = {
	account: Config.instanceOf(Map).required(),
	accountLesaTickets: Config.instanceOf(List).value(List()),
	accountProjects: Config.instanceOf(List).value(List()),
	accountTouchpoints: Config.instanceOf(List).value(List()),
	accountOpportunities: Config.instanceOf(List).value(List()),
	centerTimelineTo: Config.func().required(),
	contacts: Config.instanceOf(Map).value(Map()),
	loop: Config.instanceOf(Map).value(Map()),
	height: Config.number().required(),
	horzScale: Config.func().required(),
	width: Config.number().required()
};

AccountActivitiesModel.STATE = {
	relations: Config.instanceOf(Map).value(Map()),
	sortedActivities: Config.instanceOf(List).value(List()),
	tooltip: Config.instanceOf(Map).value(Map())
}

AccountActivitiesModel.SYNC_UPDATES = true;

export default AccountActivitiesModel;