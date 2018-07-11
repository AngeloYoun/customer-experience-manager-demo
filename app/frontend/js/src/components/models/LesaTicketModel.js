import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {groupBy} from 'lodash';
import Moment from 'moment';
import {connect} from 'metal-redux';

import {NAME as LESA_TICKETS} from 'actions/lesa-tickets';
import fieldMap, {fieldValue} from 'lib/field-formats';
import LesaTicketIcon from 'components/icons/LesaTicketIcon';
import DataHandler from 'components/wrappers/DataHandler';
import Avatar from 'components/avatar/Avatar';
import ActivityPoint, {activityStatuses} from 'components/models/ActivityPoint';
import InlineInfo from 'components/text-groups/InlineInfo';
import {getLoopNameFromEmail} from 'lib/util';

const {
	[LESA_TICKETS]: lesaTicketsFields
} = fieldMap;

const {
	LESA_TICKET_STATUS
} = fieldValue;

class LesaTicketModel extends JSXComponent {
	render() {
		const {
			addIndicator,
			addMarker,
			contacts,
			getLoop,
			getScaleTimeValue,
			handleActivityMouseEnter,
			handleActivityMouseLeave,
			handleSelectActivity,
			loop,
			related,
			selected,
			lesaTicket,
			x,
			y
		} = this.props;

		const severity = lesaTicket.get(lesaTicketsFields.SEVERITY);
		const id = lesaTicket.get(lesaTicketsFields.ID);

		const closed = lesaTicket.get(lesaTicketsFields.STATUS) === LESA_TICKET_STATUS.CLOSED;
		const status = closed ? (
			activityStatuses.POSITIVE
		) : (
			activityStatuses.NEUTRAL
		);

		const dateClosed = lesaTicket.get(lesaTicketsFields.ISSUE_CLOSED_DATE);
		const reportDate = lesaTicket.get(lesaTicketsFields.ISSUE_REPORT_DATE);

		const comments = lesaTicket.get(lesaTicketsFields.COMMENTS);

		if (selected) {
			const reportDateX = getScaleTimeValue(reportDate);

			addMarker(
				{
					x: reportDateX,
					content: (
						<div class="comment-marker">
							<h4 class="label">{`Date Reported`}</h4>
						</div>
					)
				}
			);

			let dateClosedX;

			if (dateClosed) {
				dateClosedX = getScaleTimeValue(dateClosed);
				addMarker(
					{
						x: dateClosedX,
						content: (
							<div class="comment-marker">
								<h4 class="label">{`Date Closed`}</h4>
							</div>
						)
					}
				);
			}

			const commentsByAuthors = comments.groupBy(
				comment => comment.get('author')
			);

			commentsByAuthors.forEach(
				comments => this._groupComments(comments).forEach(
					(groupedComments, x) => {
						const author = groupedComments.getIn([0, 'author']);

						const employeeComment = author.includes('@liferay');

						const name = employeeComment ? `${loop.getIn([author, 'firstName'])} ${loop.getIn([author, 'lastName'])}` : contacts.getIn([author, 'name'])

						const commentType = employeeComment ? 'Liferay' : 'Client'

						addMarker(
							{
								x,
								content: (
									<div class="comment-marker">
										{groupedComments.size > 1 ? (
											<h5 class="label">{`${groupedComments.size} Comments by `}</h5>
										) : (
											<h5 class="label">{'Comment by '}</h5>
										)}

										{employeeComment ? (
											<DataHandler
												dataConfigs={fromJS(
													[
														{
															action: getLoop,
															dataExists: loop && loop.get(author),
															requestParams: {
																wedeploy: false,
																path: ['people', `_${getLoopNameFromEmail(author)}`]
															},
															waitForData: true
														}
													]
												)}
												inline={true}
											>
												<Avatar
													elementClasses="user-avatar"
													liferayLogo={true}
													href={`https://loop.liferay.com${loop.getIn([author, 'profileImageData', 'imageURL_web'])}`}
												/>
											</DataHandler>
										) : (
											<Avatar
												elementClasses="user-avatar"
												content={name.replace(/\W*(\w)\w*/g, '$1').toUpperCase()}
											/>
										)}
									</div>
								)
							}
						)
					}
				)
			)

			const today = Moment();
			const todayX = getScaleTimeValue(today);

			const relativeCloseDateX = closed ? dateClosedX - reportDateX : todayX - reportDateX;

			addIndicator(
				<svg
					class="open-duration"
					height="1"
					style={{transform: `translate(${reportDateX}px, 160px)`}}
				>
					<text
						class="label"
						x={relativeCloseDateX - 4}
						y="-4"
					>
						{closed ? `Closed in ${Moment(dateClosed).to(reportDate, true)}` : `Open for ${today.to(reportDate, true)}`}
					</text>

					<line
						class="guide"
						x1="0%"
						y1="1"
						x2={relativeCloseDateX}
						y2="1"
					/>
				</svg>
			)
		}

		const critical = !closed && (Moment().diff(reportDate, 'days') > 7);

		return (
			<ActivityPoint
				key={`activity-${id}`}
				elementClasses={`${selected ? 'selected' : ''} ${critical ? 'critical' : ''}`}
				status={status}
				x={x}
				y={y}
				onClick={handleSelectActivity(
					reportDate,
					dateClosed || (comments ? comments.maxBy(comment => Moment(comment.get('date')).valueOf()).get('date') : Moment())
				)}
				onMouseEnter={handleActivityMouseEnter(
					<div class="tooltip-content">
							<h5 class="type">
								{'LESA Ticket'}
							</h5>

							<h3 class="summary">
								{lesaTicket.get(lesaTicketsFields.SUMMARY)}
							</h3>

							<div class="meta">
								<InlineInfo
									elementClasses={`severity severity-${severity.toLowerCase()}`}
									label={Liferay.Language.get('severity')}
									value={severity}
								/>

								<InlineInfo
									elementClasses={`component`}
									label={Liferay.Language.get('component')}
									value={lesaTicket.get(lesaTicketsFields.COMPONENT)}
								/>
							</div>

							<h4 class="status">
								{lesaTicket.get(lesaTicketsFields.STATUS) === LESA_TICKET_STATUS.CLOSED ? (
									`Issue ${lesaTicket.get(lesaTicketsFields.RESOLUTION).toLowerCase()} on ${Moment(dateClosed).format('MMM DD, YYYY')}.`
								) : (`Issue reported on ${Moment(reportDate).format('MMM DD, YYYY')}.`)}
							</h4>
					</div>
				)}
				onMouseLeave={handleActivityMouseLeave}
			>
				<LesaTicketIcon
					key={id}
					severity={severity}
				/>
			</ActivityPoint>
		);
	}

	_groupComments = comments => {
		const {
			getScaleTimeValue
		} = this.props;

		let groupedDateX;

		return comments.groupBy(
			(comment, key, comments) => {
				const commentDateX = getScaleTimeValue(comment.get('date'));

				let prevCommentDateX = commentDateX;

				if (key === 0) {
					groupedDateX = commentDateX;
				}
				else {
					prevCommentDateX = getScaleTimeValue(comments.get(key - 1).get('date'));
				}

				groupedDateX = groupedDateX + 10 > commentDateX ? groupedDateX : commentDateX;

				return groupedDateX;
			}
		)
	}
}

LesaTicketModel.PROPS = {
	addIndicator: Config.func().required(),
	addMarker: Config.func().required(),
	contacts: Config.instanceOf(Map).required(),
	getScaleTimeValue: Config.func().required(),
	loop: Config.instanceOf(Map).required(),
	handleSelectActivity: Config.func().required(),
	lesaTicket: Config.instanceOf(Map).required(),
	related: Config.bool().value(false),
	selected: Config.bool().value(false),
	x: Config.number().required(),
	y: Config.number().required()
};

LesaTicketModel.SYNC_UPDATES = true;

export default LesaTicketModel;