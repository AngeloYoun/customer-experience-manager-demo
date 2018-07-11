var WeDeploy = require('wedeploy');

const getFieldFn = key => obj => obj[key];

const readJSON = (resolve, reject) => result => {
	try {
		resolve(
			JSON.parse(result)
		);
	}
	catch(e) {
		reject(e)
	}
}

const filterIfProvided = (key, value) => func => name ? func.where(name, '=', value) : func;

const WedeployData = () => WeDeploy.data('https://db-dossiera.wedeploy.io/')

const Query = {
	account(obj, {id}, context) {
		return WedeployData()
			.where('id', '=', id)
			.get('accounts')
			.then(
				account => account[0]
			);
	},
	accounts(obj, {limit, offset, ...properties}) {
		return Object.keys(properties).reduce(
			(request, property) => properties[property] ? request.match(property, properties[property]) : request,
			WedeployData()
		)
			.get('accounts')
			.then(
				accounts => accounts
			);
	},
	ticket(obj, {id}, context) {
		return WedeployData()
			.where('id', '=', id)
			.get('lesa-tickets')
			.then(
				tickets => tickets[0]
			);
	},
	opportunity(obj, {id}, context) {
		return WedeployData()
			.where('id', '=', id)
			.get('opportunities')
			.then(
				opportunities => opportunities[0]
			);
	},
	project(obj, {id}, context) {
		return WedeployData()
			.where('id', '=', id)
			.get('projects').then(
				projects => projects[0]
			);
	},
	getTicketsByAccount(obj, {id}, context) {
		return Query.getProjectsByAccount(null, {id}).then(
			projects => Promise.all(
				projects.map(
					project => WedeployData()
						.where('project', '=', project.id)
						.get('lesa-tickets')
				)
			).then(results => results.reduce(
				(accum, result) => accum.concat(result),
				[]
			))
		)
	},
	getOpportunitiesByAccount(obj, {id}, context) {
		return WedeployData()
			.where('account', '=', id)
			.get('opportunities')
			.then(opportunities => opportunities);
	},
	// getAccountByProject(obj, {id}, context) {
	// 	return Dossiera_Project.find({
	// 		attributes: [],
	// 		include: [{
	// 			model: Dossiera_Account,
	// 			required: true,
	// 		}],
	// 		where: {
	// 			Id_: id
	// 		}
	// 	}).then(
	// 		result => result.Account_
	// 	)
	// },
	getProjectsByAccount(obj, {id}, context) {
		return WedeployData()
			.where('account', '=', id)
			.get('projects')
			.then(projects => projects);
	},
	// getOpportunitiesByProject(obj, {id}, context) {
	// 	return Dossiera_Opportunity.findAll({
	// 		where: { Project__c: id }
	// 	})
	// },
	// getTicketsByProject(obj, {id}, context) {
	// 	return OSB_MetricsTicketEntry.findAll({
	// 		include: [{
	// 			attributes: [],
	// 			model: OSB_MetricsAccountEntry,
	// 			required: true,
	// 			include: [{
	// 				attributes: [],
	// 				model: OSB_MetricsCorpProject,
	// 				required: true,
	// 				where: {
	// 					salesforceProjectKey: id
	// 				},
	// 			}]
	// 		}]
	// 	});
	// },
	// getTicketsByProjectName(obj, {name}, context) {
	// 	return OSB_MetricsTicketEntry.findAll({
	// 		include: [{
	// 			attributes: [],
	// 			model: OSB_MetricsAccountEntry,
	// 			required: true,
	// 			where: {
	// 				name: {
	// 					$like: name
	// 				}
	// 			}
	// 		}]
	// 	});
	// }
}

const Account = {
	tickets: account => Query.getTicketsByAccount(null, {id: account.id}),
	opportunities: account => WedeployData().where('account', '=', account.id).get('opportunities').then(opportunities => opportunities),
	projects: account => WedeployData().where('account', '=', account.id).get('projects').then(projects => projects)
}

// const Opportunity = {
// 	account: obj => Query.account(null, {id: obj.AccountId}),
// 	listPriceTotal: getFieldFn('List_Price_Total__c'),
// 	project: obj => Query.project(null, {id: obj.Project_Full_Id__c}),
// 	closeDate: getFieldFn('CloseDate'),
// 	type: getFieldFn('Type_'),
// 	id: getFieldFn('Id_'),
// 	currencyIsoCode: getFieldFn('CurrencyIsoCode'),
// 	name: getFieldFn('Name'),
// 	stage: getFieldFn('StageName'),
// 	subscriptionEndDate: getFieldFn('Subscription_Start_Date__c'),
// 	subscriptionStartDate: getFieldFn('Subscription_End_Date__c'),
// 	opportunityLineItems: obj => Dossiera_OpportunityLineItem.findAll({
// 		where: {
// 			OpportunityId: obj.Id_
// 		}
// 	})
// }

// const OpportunityLineItem = {
// 	id: getFieldFn('Id_'),
// 	currencyIsoCode: getFieldFn('CurrencyIsoCode'),
// 	endLocalDate: getFieldFn('End_Date__c'),
// 	name: getFieldFn('Name'),
// 	quantity: getFieldFn('Quantity'),
// 	startLocalDate: getFieldFn('ServiceDate'),
// 	term: getFieldFn('Term__c'),
// 	termType: getFieldFn('Term_Type__c'),
// 	totalPrice: getFieldFn('TotalPrice')
// }

const Project = {
}

const Ticket = {
}

const Opportunity = {
	opportunityLineItems: opportunity => WedeployData()
		.where('opportunity', '=', opportunity.id)
		.get('opportunity-line-items')
		.then(opportunityLineItems => opportunityLineItems)
}

const resolvers = {
	Query,
	Account,
	Opportunity,
	Project,
	Ticket
};

module.exports = resolvers;