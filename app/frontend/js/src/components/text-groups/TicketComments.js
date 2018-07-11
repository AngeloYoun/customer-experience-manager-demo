import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';
import {connect} from 'metal-redux';

import {loopActions} from 'actions/loop';
import {NAME as LESA_TICKETS} from 'actions/lesa-tickets';
import DataHandler from 'components/wrappers/DataHandler';
import Avatar from 'components/avatar/Avatar';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {checkIfPropsChanged, getLoopNameFromEmail, formatCurrency, subLanguageKey, subLanguageKeyArray} from 'lib/util';
import {requestActions} from 'lib/request';

const NON_SUBSCRIPTION_GROUP_KEY = 'nonSubscription';

const {
	[LESA_TICKETS]: lesaTicketsFields
} = fieldMap;

const {
	LESA_TICKET_STATUS
} = fieldValue;

class TicketComments extends JSXComponent {
	render() {
		const {
			accountContacts,
			getLoop,
			loop,
			lesaTicket
		} = this.props;

		const comments = lesaTicket.get(lesaTicketsFields.COMMENTS);

		return (
			<div class="ticket-comments-container">
				{comments.map(
					comment => {
						const author = comment.get('author');

						return author.includes('@liferay') ? (
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
							>
								{loop && (
									<div class="comment-container">
										<Avatar
											elementClasses="user-avatar"
											liferayLogo={true}
											href={`https://loop.liferay.com${loop.getIn([author, 'profileImageData', 'imageURL_web'])}`}
										/>

										<div class="comment-body">
											<div class="comment-header">
												<h4 class="comment-author">
													{`${loop.getIn([author, 'firstName'])} ${loop.getIn([author, 'lastName'])}`}
												</h4>

												<h5 class="comment-date">
													{`${Moment(comment.get('date')).toNow(true)} ago`}
												</h5>
											</div>

											<h4 class="comment">
												{comment.get('comment')}
											</h4>
										</div>
									</div>
								)}
							</DataHandler>
						) : (
							<div class="comment-container">
								<Avatar
									elementClasses="user-avatar"
									content={accountContacts.getIn([author, 'name']).replace(/\W*(\w)\w*/g, '$1').toUpperCase()}
								/>

								<div class="comment-body">
									<div class="comment-header">
										<h4 class="comment-author">
											{accountContacts.getIn([author, 'name'])}
										</h4>

										<h5 class="comment-date">
											{`${Moment(comment.get('date')).toNow(true)} ago`}
										</h5>
									</div>

									<h4 class="comment">
										{comment.get('comment')}
									</h4>
								</div>
							</div>
						)
					}
				).toJS()}
			</div>
		);
	}
}

TicketComments.PROPS = {
	accountContacts:  Config.instanceOf(Map).required(),
	getLoop: Config.func().required(),
	loop: Config.instanceOf(Map),
	lesaTicket: Config.instanceOf(Map).required()
};

export default connect(
	state => (
		{
			loop: state.getIn(['loop', 'data'])
		}
	),
	{
		getLoop: loopActions[requestActions.GET]
	}
)(TicketComments);