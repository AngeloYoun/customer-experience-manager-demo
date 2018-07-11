import {combineReducers} from 'redux-immutable';

import accounts from 'reducers/accounts';
import alerts from 'reducers/alerts';
import contacts from 'reducers/contacts';
import lesaTickets from 'reducers/lesa-tickets';
import login from 'reducers/login';
import loop from 'reducers/loop';
import modal from 'reducers/modal';
import opportunities from 'reducers/opportunities';
import opportunityLineItems from 'reducers/opportunity-line-items';
import projects from 'reducers/projects';
import touchpoints from 'reducers/touchpoints';
import users from 'reducers/users';

export default combineReducers(
	{
		accounts,
		alerts,
		contacts,
		lesaTickets,
		login,
		loop,
		modal,
		opportunities,
		opportunityLineItems,
		projects,
		touchpoints,
		users
	}
);