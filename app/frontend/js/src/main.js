import JSXComponent from 'metal-jsx';
import Router from 'metal-router';
import ApolloClient from 'apollo-boost';
import {HttpLink} from 'apollo-link-http'; 

import Liferay from './liferay-patch';

import AlertsHandler from 'components/alerts/AlertsHandler';
import ModalHandler from 'components/modal/ModalHandler';
import {sessionStartup} from 'middleware/session-handler';
import Account from 'pages/account';
import Admin from 'pages/admin';
import Home from 'pages/home';
import AccountIndex from 'pages/account-index';

class DossieraApp extends JSXComponent {
	attached() {
		const router = Router.router();

		window.Dossiera.router = router;

		router.dispatch();

		sessionStartup(router, this._store);
	}

	created() {
		window.Dossiera.apollo = new ApolloClient(
			{
				uri: "/graphql"
			}
		);
	}

	render() {
		return (
			<div class="app">
				<div class="app-content-container" key="app">
					<Router
						component={Admin}
						path={`/admin`}
					/>

					<Router
						component={Admin}
						path={`/admin/:adminView`}
					/>

					<Router
						component={Account}
						path={`/accounts`}
					/>

					<Router
						component={Account}
						path={`/accounts/:accountId`}
					/>

					<Router
						component={Account}
						path={`/accounts/:accountId/:accountView`}
					/>

					<Router
						component={Account}
						path={`/accounts/:accountId/:accountView/:entityId`}
					/>

					<Router
						component={Home}
						path={`/home`}
					/>

					<Router
						component={Home}
						path={`/home/:homeView`}
					/>

					<Router
						component={Home}
						path={this._defaultRoute}
					/>
				</div>
			</div>
		);
	}

	_defaultRoute(route) {
		var returnVal = false;

		if (!/c\/portal\/logout/.test(route) && !/group\/control_panel/.test(route)) {
			returnVal = true;
		}

		return returnVal;
	}
}

const dataTemplate = {data: {}}

window.Dossiera = window.Dossiera || {};

window.Dossiera.run = (initialState = {}, id, context) => {
	context.app = new DossieraApp(
		{
			initialState: {
				accounts: dataTemplate,
				contacts: dataTemplate,
				lesaTickets: dataTemplate,
				opportunities: dataTemplate,
				opportunityLineItems: dataTemplate,
				projects: dataTemplate,
				touchpoints: dataTemplate
			}
		},
		document.getElementById(id)
	);
};