import {fromJS, List, Map} from 'immutable';
import {isNil} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';
import {connect} from 'metal-redux';

import PageHeader from 'components/page-header/PageHeader';
import Sidebar, {locationsMap} from 'components/sidebar/Sidebar';
import Navbar from 'components/navbar/Navbar';
import {checkIfPropsChanged} from 'lib/util';
import AdminAPI from 'pages/admin/api';

const API = 'api';

const DATA = 'data';

const adminViewKeys = Map(
	{
		[API]: Liferay.Language.get('api'),
		[DATA]: Liferay.Language.get('data')
	}
);

const adminViewOptions = List([API, DATA]);

class Admin extends JSXComponent {
	render() {
		const {
			router
		} = this.props;

		const {
			adminView = API
		} = router.params;

		return (
			<div class="admin-container">
				<Sidebar
					key="sidebar"
					selected={locationsMap.ADMIN}
				/>

				<div class="view-container">
					<PageHeader title={'Admin'} />

					<Navbar
						href={`${window.Dossiera.URLS.HOST_URL}/admin/{option}`}
						options={adminViewOptions}
						optionsMap={adminViewKeys}
						selected={adminView}
					/>

					{(adminView === API) && (
						<AdminAPI />
					)}
				</div>
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			[
				'router'
			],
			nextProps
		);
	}
}

Admin.PROPS = {
	router: Config.object().required()
};

export default Admin;