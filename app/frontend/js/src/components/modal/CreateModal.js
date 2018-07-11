import {fromJS, List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';
import Moment from 'moment';

import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as PROJECTS, projectsActions} from 'actions/projects';
import {NAME as CONTACTS, contactsActions} from 'actions/contacts';
import {NAME as OPPORTUNITIES, opportunitiesActions} from 'actions/opportunities';
import {NAME as TOUCHPOINTS, touchpointsActions} from 'actions/touchpoints';
import Modal from 'components/modal/Modal';
import CreateTouchpoint from 'components/modal/CreateTouchpoint';
import DataHandler from 'components/wrappers/DataHandler';
import ActionButton from 'components/buttons/ActionButton';
import SelectInput from 'components/inputs/SelectInput';
import LoadingSpinner from 'components/loading-spinner/LoadingSpinner';
import UserInfo, {userInfoSizes} from 'components/user-info/UserInfo';
import fieldMap, {fieldValue} from 'lib/field-formats';
import {requestActions, requestModifiers} from 'lib/request';
import {formatFields, mapAvailableKeys} from 'lib/util';
import emailIcon from 'resources/email-icon';
import externalLinkIcon from 'resources/external-link-icon';

const {
	[ACCOUNTS]: accountsFields,
	[CONTACTS]: contactsFields,
	[OPPORTUNITIES]: opportunitiesFields,
	[PROJECTS]: projectsFields,
	[TOUCHPOINTS]: touchpointsFields
} = fieldMap;

const {
	POST
} = requestActions;

const viewOptions = Map({
	CREATE_EVENT: 'create event',
	CREATE_OPPORTUNITY: 'create opportunity',
	CREATE_TOUCHPOINT: 'create touchpoint'
});

class CreateModal extends JSXComponent {
	render() {
		const {
			contacts,
			opportunities,
			getContacts,
			getProjects,
			getOpportunities,
			modalProps,
			projects,
			hideModal
		} = this.props;

		const {
			createView,
			data,
			loading
		} = this.state;

		const account = modalProps.get('account');

		return (
			<Modal
				elementClasses="create-modal-container"
				titleRenderer={this._titleRenderer}
			>
				<div class="create-container">
					{createView === viewOptions.get('CREATE_TOUCHPOINT') && (
						<CreateTouchpoint
							account={account}
							data={data}
							handleInput={this._handleInput}
							setData={this._setData}
						/>
					)}
				</div>


				<div class="footer">
					<ActionButton
						buttonLabel={'Cancel'}
						elementClasses={'cancel-button'}
						onClick={hideModal}
					/>

					{loading ? (
						<LoadingSpinner />
					) : (
						<ActionButton
							buttonLabel={'Save'}
							onClick={this._handleSave}
							elementClasses={'primary save-button'}
						/>
					)}
				</div>
			</Modal>
		);
	}

	_setData = data => {
		this.setState(
			{
				data
			}
		)
	}

	_handleInput = fieldKey => (getter = f => f) => value => {
		const {
			data
		} = this.state;

		this.setState(
			{
				data: data.set(fieldKey, getter(value))
			}
		);
	}

	_handleSave = () => {
		const {
			hideModal,
			opportunities,
			projects,
			patchOpportunities,
			patchProjects,
			postTouchpoints
		} = this.props;

		const {
			data
		} = this.state;

		this.setState(
			{
				loading: true
			}
		)

		postTouchpoints(
			{
				payload: [
					data.toJS()
				]
			}
		).then(
			({response}) => {
				const {
					[touchpointsFields.OPPORTUNITY]: opportunityId,
					[touchpointsFields.ID]: touchpointId
				} = response.data;

				patchOpportunities(
					{
						payload: {
							[opportunitiesFields.TOUCHPOINTS]: opportunities.getIn([opportunityId, opportunitiesFields.TOUCHPOINTS]).push(touchpointId).toJS()
						},
						path: [opportunityId]
					}
				).then(
					response => {
						this.setState(
							{
								loading: false
							}
						);

						hideModal();
					}
				);
			}
		)
	}

	_handleViewChange = view => {
		this.setState(
			{
				createView: view,
				data: Map()
			}
		);
	}

	_titleRenderer = () => {
		const {
			createView
		} = this.state;

		const viewOptionsList = viewOptions.toList();

		return (
			<div class="title">
				<SelectInput
					elementClasses="borderless type"
					onChange={this._handleViewChange}
					data={viewOptionsList}
					renderer={entry => (
						<h2 class="value">
							{entry}
						</h2>
					)}
					selectedIndex={viewOptionsList.indexOf(createView)}
				/>
			</div>
		);
	}
}

CreateModal.PROPS = {
	opportunities: Config.instanceOf(Map).required(),
	contacts: Config.instanceOf(Map).required(),
	projects: Config.instanceOf(Map).required(),
	patchOpportunities: Config.func().required(),
	patchProjects: Config.func().required(),
	postTouchpoints: Config.func().required(),
	modalProps: Config.instanceOf(Map).required()
};

CreateModal.STATE = {
	createView: Config.string().value(viewOptions.get('CREATE_TOUCHPOINT')),
	data: Config.instanceOf(Map).value(Map()),
	loading: Config.bool().value(false)
}

export default connect(
	state => (
		{
			opportunities: state.getIn(['opportunities', 'data']),
			contacts: state.getIn(['contacts', 'data']),
			projects: state.getIn(['projects', 'data'])
		}
	),
	{
		patchProjects: projectsActions.PATCH,
		patchOpportunities: opportunitiesActions.PATCH,
		postTouchpoints: touchpointsActions.POST
	}
)(CreateModal);