import {fromJS, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import {alertTypes, closeAlert} from 'actions/alerts';
import ErrorAlert from 'components/alerts/ErrorAlert';
import ListComponent from 'components/list/List';

const alertTypeMap = {
	[alertTypes.ERROR]: ErrorAlert
};

class AlertsHandler extends JSXComponent {
	render() {
		const {
			alerts
		} = this.props;

		return (
			<div class="alerts-handler-container">
				<ListComponent
					elementClasses="alerts-list"
					itemRenderer={this._alertRenderer}
					listItems={alerts.toList()}
				/>
			</div>
		);
	}

	_alertRenderer = ({index, itemData}) => {
		const AlertComponent = alertTypeMap[itemData.get('alertType')];

		return (
			<AlertComponent
				alertProps={itemData.get('alertProps')}
				closeAlert={this.props.closeAlert}
			/>
		);
	}
}

AlertsHandler.PROPS = {
	alerts: Config.instanceOf(Map),
	closeAlert: Config.func().required()
};

export default connect(
	state => {
		const alertState = fromJS(state.alerts || {})

		return {
			alerts: alertState
		}
	},
	{
		closeAlert
	}
)(AlertsHandler);