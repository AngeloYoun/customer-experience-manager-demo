import {fromJS, List, Map} from 'immutable';
import {isNil, values, keys} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {NAME as ACCOUNTS, accountsActions} from 'actions/accounts';
import {NAME as CONTACTS, contactsActions} from 'actions/contacts';
import {NAME as LESA_TICKETS, lesaTicketsActions} from 'actions/lesa-tickets';
import {NAME as PROJECTS, projectsActions} from 'actions/projects';
import {NAME as OPPORTUNITIES, opportunitiesActions} from 'actions/opportunities';
import {NAME as TOUCHPOINTS, touchpointsActions} from 'actions/touchpoints';
import {NAME as USERS, usersActions} from 'actions/users';
import {NAME as OPPORTUNITY_LINE_ITEMS, opportunityLineItemsActions} from 'actions/opportunity-line-items';
import DataHandler from 'components/wrappers/DataHandler';
import SelectInput from 'components/inputs/SelectInput';
import CodeEditor from 'components/inputs/CodeEditor';
import ActionButton from 'components/buttons/ActionButton';
import CloseButton from 'components/buttons/CloseButton';
import LoadingSpinner from 'components/loading-spinner/LoadingSpinner';
import TextInput from 'components/inputs/TextInput';
import PageHeader from 'components/page-header/PageHeader';
import {requestActions, requestModifiers} from 'lib/request';
import {checkIfPropsChanged, getActionName} from 'lib/util';

const {
	DELETE,
	GET,
	POST,
	PATCH
} = requestActions;

const actionsMap = Map(
	{
		[ACCOUNTS]: accountsActions,
		[CONTACTS]: contactsActions,
		[LESA_TICKETS]: lesaTicketsActions,
		[OPPORTUNITIES]: opportunitiesActions,
		[OPPORTUNITY_LINE_ITEMS]: opportunityLineItemsActions,
		[PROJECTS]: projectsActions,
		[TOUCHPOINTS]: touchpointsActions,
		[USERS]: usersActions
	}
)

const controllers = keys(actionsMap.toJS());

class AdminAPI extends JSXComponent {
	created() {
		window.document.title = 'Admin - API'
	}

	render() {
		const {
			modifiers,
			selectedController,
			selectedMethod,
			showResults,
			path,
			payload,
			loading,
			result
		} = this.state;

		const methodSelected = selectedController && selectedMethod;

		return (
			<div class="admin-api-container">
				<div class="content">
					<div class="request-configurations">

						<h3 class="section-label">
							{'Controller'}
						</h3>

						<SelectInput
							onChange={this._setSelectedController}
							data={fromJS(controllers)}
							renderer={controller => (
								<h3 class="controller-option">{controller.toLowerCase().replace(/_/g, ' ')}</h3>
							)}
							selectedIndex={controllers.indexOf(selectedController)}
						/>

						{selectedController && (
							<div class="controller-specific-config">
								<h3 class="section-label">
									{'Method'}
								</h3>

								<SelectInput
									onChange={this._setSelectedMethod}
									data={fromJS(
										values(requestActions)
									)}
									renderer={method => (
										<h3 class="method-option">{method}</h3>
									)}
									selectedIndex={values(requestActions).indexOf(selectedMethod)}
								/>

								<h3 class="section-label">
									{'Path'}
								</h3>

								<TextInput
									onChange={this._setPath}
									placeholder="foo/bar/"
									value={path}
								/>
							</div>
						)}

						{(selectedMethod === GET || selectedMethod === PATCH) && (
							<div class="get-config config">
								<h3 class="section-label">
									{'Modifiers'}
								</h3>

								<ActionButton
									elementClasses="add-modifier"
									onClick={this._addModifier}
									buttonLabel={'Add Modifier'}
								/>

								{modifiers.map(
									(modifier, index) => (
										<div class="modifier-input">
											<SelectInput
												elementClasses="modifier-select"
												onChange={this._setModifier(index)}
												data={fromJS(
													values(requestModifiers)
												)}
												renderer={modifier => (
													<h3 class="method-option">{modifier}</h3>
												)}
												selectedIndex={values(requestModifiers).indexOf(modifier.get('key'))}
											/>

											<CodeEditor
												elementClasses="modifier-arguments"
												onChange={this._setModifierArgs(index)}
												value={modifier.get('args') ? JSON.stringify(modifier.get('args'), null, '\t') : ''}
											/>

											<CloseButton
												elementClasses="remove-modifier"
												onClick={this._removeModifier(index)}
											/>
										</div>
									)
								).toJS()}
							</div>
						)}

						{selectedMethod === POST && (
							<div class="post-config config">
								<h3 class="section-label">
									{'POST Payload'}
								</h3>

								<CodeEditor
									onChange={this._setPostPayload}
									value={payload ? JSON.stringify(payload, null, '\t') : ''}
								/>
							</div>
						)}

						{selectedMethod === PATCH && (
							<div class="put-config config">
								<h3 class="section-label">
									{'PATCH Payload'}
								</h3>

								<CodeEditor
									onChange={this._setPutPayload}
									value={payload ? JSON.stringify(payload, null, '\t') : ''}
								/>
							</div>
						)}

						{methodSelected && (
							<ActionButton
								elementClasses="send-request"
								disabled={!this._methodValidator()}
								buttonLabel="Send Request"
								onClick={this._handleSendRequest}
							/>
						)}
					</div>

					<div class="results-container">
						{loading ? (
							<LoadingSpinner />
						) : (
							<div class="results">
								<h3 class="section-label">
									{'Results'}
								</h3>

								<CodeEditor
									value={result ? JSON.stringify(result, null, '\t') : ''}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return nextState ? true : checkIfPropsChanged(
			[
				'accounts',
				'projects'
			],
			nextProps
		);
	}

	_addModifier = () => {
		const {
			modifiers
		} = this.state;

		this.setState(
			{
				modifiers: modifiers.push(
					Map(
						{
							key: null,
							args: null
						}
					)
				)
			}
		);
	}

	_methodValidator = () => {
		const {
			selectedMethod,
			payload
		} = this.state;

		let valid = true;

		if (selectedMethod === PATCH || selectedMethod === POST)  {
			valid = !!payload
		}

		return valid;
	}

	_removeModifier = index => () => {
		const {
			modifiers
		} = this.state;

		this.setState(
			{
				modifiers: modifiers.delete(index)
			}
		);
	}

	_handleSendRequest = () => {
		const {
			selectedController,
			selectedMethod,
			modifiers,
			path,
			payload
		} = this.state;

		this.setState(
			{
				loading: true
			}
		)

		this.props[getActionName(selectedController, selectedMethod)](
			{
				modifiers: modifiers.toJS(),
				path: path ? path.split('/') : null,
				payload
			}
		).then(
			response => {
				this.setState(
					{
						loading: false,
						result: response
					}
				)
			}
		)
	}

	_setModifier = index => modifierKey => {
		const {
			modifiers
		} = this.state;

		this.setState(
			{
				modifiers: modifiers.update(index, modifier => modifier.set('key', modifierKey))
			}
		);
	}

	_setModifierArgs = index => modifierArgs => {
		const {
			modifiers
		} = this.state;

		this.setState(
			{
				modifiers: modifiers.update(index, modifier => modifier.set('args', modifierArgs))
			}
		);
	}

	_setPath = path => {
		this.setState(
			{
				path
			}
		)
	}

	_setPostPayload = payload => {
		this.setState(
			{
				payload
			}
		);
	}

	_setPutPayload = payload => {
		this.setState(
			{
				payload
			}
		);
	}

	_setSelectedController = entry => {
		this.setState(
			{
				result: null,
				payload: null,
				selectedController: entry,
				selectedMethod: this.state.selectedMethod,
				showResults: false,
				modifier: null
			}
		);
	}

	_setSelectedMethod = entry => {
		this.setState(
			{
				result: null,
				payload: null,
				selectedMethod: entry,
				showResults: false,
				modifier: null
			}
		);
	}

	_getAccountProjects(projectKeys, projects) {
		return projectKeys.map(
			key => projects.get(key)
		);
	}
}

AdminAPI.PROPS = {
	accounts: Config.instanceOf(Map),
	projects: Config.instanceOf(Map)
};

AdminAPI.STATE = {
	selectedController: Config.string().value(ACCOUNTS),
	selectedMethod: Config.string().value(GET),
	showResults: Config.bool().value(false),
	modifiers: Config.instanceOf(List).value(new List()),
	path: Config.string(),
	payload: Config.value({}),
	loading: Config.bool().value(false),
	result: Config.object()
}

export default connect(
	state => (
		{
			accounts: state.get('accounts'),
			projects: state.get('projects')
		}
	),
	actionsMap.reduce(
		(accum, actions, controllerName) => keys(actions).reduce(
			(actionAccum, actionName) => {
				actionAccum[getActionName(controllerName, actionName)] = actions[actionName]

				return actionAccum;
			},
			accum
		),
		{}
	)
)(AdminAPI);