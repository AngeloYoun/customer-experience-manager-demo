import {fromJS, List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';
import Moment from 'moment';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as PROJECTS, projectsActions} from 'actions/projects';
import {NAME as CONTACTS, contactsActions} from 'actions/contacts';
import {NAME as OPPORTUNITIES, opportunitiesActions} from 'actions/opportunities';
import {NAME as TOUCHPOINTS, touchpointsActions} from 'actions/touchpoints';
import InputGroup from 'components/inputs/InputGroup';
import DataHandler from 'components/wrappers/DataHandler';
import PlaceholderMessage from 'components/text-groups/PlaceholderMessage';
import SelectInput from 'components/inputs/SelectInput';
import MultiSelectInput from 'components/inputs/MultiSelectInput';
import TextArea from 'components/inputs/TextArea';
import TextInput from 'components/inputs/TextInput';
import DatePicker from 'components/inputs/DatePicker';
import ProjectCard from 'components/text-groups/ProjectCard';
import OpportunityCard from 'components/text-groups/OpportunityCard';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {requestActions, requestModifiers} from 'lib/request';
import {formatFields, mapAvailableKeys} from 'lib/util';

const {
	[ACCOUNTS]: accountsFields,
	[CONTACTS]: contactsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[PROJECTS]: projectsFields,
	[TOUCHPOINTS]: touchpointsFields
} = fieldMap;

const {
	TOUCHPOINT_STATUS,
	TOUCHPOINT_TYPE
} = fieldValue;

const {
	GET
} = requestActions;

const {
	ANY
} = requestModifiers

const CREATABLE_TOUCHPOINTS = List([
	TOUCHPOINT_TYPE.CALL,
	TOUCHPOINT_TYPE.EMAIL
]);

const TOUCHPOINT_STATUS_LIST = Map(TOUCHPOINT_STATUS).toList();

class CreateTouchpoint extends JSXComponent {
	created() {
		const {
			account,
			opportunities,
			setData
		} = this.props;

		this._setDefaultData(account, opportunities, setData)
		this._today = Moment().toDate();
	}

	render() {
		const {
			account,
			contacts,
			data,
			opportunities,
			getContacts,
			getProjects,
			getOpportunities,
			modalProps,
			projects,
			handleInput,
			hideModal
		} = this.props;

		const accountContactKeys = account.get(accountsFields.CONTACTS);
		const accountOpportunitiesKeys = account.get(accountsFields.OPPORTUNITIES);
		const accountProjectsKeys = account.get(accountsFields.PROJECTS);

		const status = data.get(touchpointsFields.STATUS);

		const accountContacts = mapAvailableKeys(
			accountContactKeys,
			contacts
		);

		const accountOpportunities = mapAvailableKeys(
			accountOpportunitiesKeys,
			opportunities
		);

		const accountProjects = mapAvailableKeys(
			accountProjectsKeys,
			projects
		);

		if (data.size) {
			return (
				<div class="create-touchpoint-container">
					<InputGroup label="Touchpoint Type">
						<SelectInput
							elementClasses="touchpoint-type"
							data={CREATABLE_TOUCHPOINTS}
							onChange={handleInput(touchpointsFields.TYPE)()}
							renderer={entry => (
								<h3 class="value">
									{entry}
								</h3>
							)}
							selectedIndex={CREATABLE_TOUCHPOINTS.indexOf(
								data.get(touchpointsFields.TYPE)
							)}
						/>
					</InputGroup>

					<InputGroup label="Status">
						<SelectInput
							elementClasses="touchpoint-status"
							data={TOUCHPOINT_STATUS_LIST}
							onChange={handleInput(touchpointsFields.STATUS)()}
							renderer={entry => (
								<h3 class="value">
									{entry}
								</h3>
							)}
							selectedIndex={TOUCHPOINT_STATUS_LIST.indexOf(
								data.get(touchpointsFields.STATUS)
							)}
						/>
					</InputGroup>

					<InputGroup label="Related Opportunity">
						<DataHandler
							dataConfigs={fromJS([
								{
									action: getOpportunities,
									dataExists: accountOpportunities.size === accountOpportunitiesKeys.size,
									requestParams: {
										modifiers: [
											{
												key: ANY,
												args: [opportunitiesFields.ACCOUNT, account.get(accountsFields.ID)]
											}
										]
									}
								}
							])}
							inline={true}
						>
							{accountOpportunities && (
								<SelectInput
									elementClasses="related-opportunity"
									onChange={opportunity => {
										handleInput(touchpointsFields.OPPORTUNITY)(opportunity => opportunity.get(opportunitiesFields.ID))(opportunity);
										handleInput(touchpointsFields.PROJECT)(opportunity => opportunity.get(opportunitiesFields.PROJECT))(opportunity);
									}}
									data={accountOpportunities.toList()}
									renderer={opportunity => (
										<OpportunityCard
											accounts={Map({
												[account.get(accountsFields.ID)]: account
											})}
											opportunity={opportunity}
											projects={projects}
										/>
									)}
									selectedIndex={accountOpportunities.toList().findKey(
										opportunity => opportunity.get(opportunitiesFields.ID) === data.get(touchpointsFields.OPPORTUNITY)
									) || 0}
								/>
							)}
						</DataHandler>
					</InputGroup>

					<InputGroup label="Related Project">
						<DataHandler
							dataConfigs={fromJS([
								{
									action: getProjects,
									dataExists: accountProjects.size === accountProjectsKeys.size,
									requestParams: {
										modifiers: [
											{
												key: ANY,
												args: [projectsFields.ACCOUNT, account.get(accountsFields.ID)]
											}
										]
									}
								}
							])}
							inline={true}
						>
							{accountProjects && (
								<SelectInput
									elementClasses="related-project"
									onChange={handleInput(touchpointsFields.PROJECT)(project => project.get(projectsFields.ID))}
									data={accountProjects.toList()}
									renderer={project => (
										<ProjectCard
											project={project}
											accounts={Map({
												[account.get(accountsFields.ID)]: account
											})}
										/>
									)}
									selectedIndex={accountProjects.toList().findKey(
										project => project.get(projectsFields.ID) === data.get(touchpointsFields.PROJECT)
									) || 0}
								/>
							)}
						</DataHandler>
					</InputGroup>

					<InputGroup label="Related Contacts">
						<DataHandler
							dataConfigs={fromJS([
								{
									action: getContacts,
									dataExists: accountContacts.size === accountContactKeys.size,
									requestParams: {
										modifiers: [
											{
												key: ANY,
												args: [contactsFields.ACCOUNT, account.get(accountsFields.ID)]
											}
										]
									},
								}
							])}
							inline={true}
						>
							{accountContacts && (
								<MultiSelectInput
									elementClasses="contacts"
									onChange={handleInput(touchpointsFields.CONTACTS)(
										contacts => contacts.map(contact => contact.get(contactsFields.ID))
									)}
									data={accountContacts.toList()}
									renderer={contact => (
										<h3 class="value">{contact.get(contactsFields.NAME)}</h3>
									)}
									values={data.get(touchpointsFields.CONTACTS).map(
										contactId => contacts.get(contactId)
									)}
								/>
							)}
						</DataHandler>
					</InputGroup>

					<InputGroup label="Assigned To">
						<TextInput
							value={data.get(touchpointsFields.ASSIGNED_TO)}
							onChange={handleInput(touchpointsFields.ASSIGNED_TO)()}
						/>
					</InputGroup>

					<InputGroup label="Due Date">
						<DatePicker
							max={status === TOUCHPOINT_STATUS.COMPLETED ? this._today : null}
							min={status === TOUCHPOINT_STATUS.OPEN ? this._today : null}
							value={data.get(touchpointsFields.DUE_DATE)}
							onChange={handleInput(touchpointsFields.DUE_DATE)()}
						/>
					</InputGroup>

					<InputGroup label="Subject">
						<TextInput
							value={data.get(touchpointsFields.SUBJECT)}
							onChange={handleInput(touchpointsFields.SUBJECT)()}
						/>
					</InputGroup>

					<InputGroup label="Comments">
						<TextArea
							value={data.get(touchpointsFields.COMMENTS)}
							onChange={handleInput(touchpointsFields.COMMENTS)()}
						/>
					</InputGroup>
				</div>
			)
		}
	}

	_setDefaultData(account, opportunities, setData) {
		const now = Moment().format();
		const currentUser = window.Dossiera.userEmail;

		const accountOpportunitiesKeys = account.get(accountsFields.OPPORTUNITIES);

		const accountOpportunities = mapAvailableKeys(
			accountOpportunitiesKeys,
			opportunities
		)

		const latestOpportunity = accountOpportunities.max(
			(a, b) => Moment(a.get(opportunitiesFields.CREATED_DATE)).valueOf() - Moment(b.get(opportunitiesFields.CREATED_DATE)).valueOf()
		);

		setData(
			fromJS(
				{
					[touchpointsFields.TYPE]: TOUCHPOINT_TYPE.CALL,
					[touchpointsFields.CONTACTS]: latestOpportunity.get(opportunitiesFields.CONTACTS),
					[touchpointsFields.ASSIGNED_TO]: currentUser,
					[touchpointsFields.DUE_DATE]: Moment().add(1, 'days').format(),
					[touchpointsFields.LAST_MODIFIED_BY]: currentUser,
					[touchpointsFields.CREATED_DATE]: now,
					[touchpointsFields.CREATED_BY]: currentUser,
					[touchpointsFields.OPPORTUNITY]: latestOpportunity.get(opportunitiesFields.ID),
					[touchpointsFields.PROJECT]: latestOpportunity.get(opportunitiesFields.PROJECT),
					[touchpointsFields.LAST_MODIFIED_DATE]: now,
					[touchpointsFields.STATUS]: TOUCHPOINT_STATUS.OPEN
				}
			)
		);
	}
}

CreateTouchpoint.PROPS = {
	account: Config.instanceOf(Map).required(),
	contacts: Config.instanceOf(Map).required(),
	data: Config.instanceOf(Map).value(new Map()).required(),
	getContacts: Config.func().required(),
	getOpportunities: Config.func().required(),
	getProjects: Config.func().required(),
	handleInput: Config.func().required(),
	opportunities: Config.instanceOf(Map).required(),
	projects: Config.instanceOf(Map).required(),
	setData: Config.func().required()
};

export default connect(
	state => (
		{
			opportunities: state.getIn(['opportunities', 'data']),
			contacts: state.getIn(['contacts', 'data']),
			projects: state.getIn(['projects', 'data'])
		}
	),
	{
		getContacts: contactsActions.GET,
		getOpportunities: opportunitiesActions.GET,
		getProjects: projectsActions.GET
	}
)(CreateTouchpoint);