import {NAME as ACCOUNTS} from 'actions/accounts';
import {NAME as CONTACTS} from 'actions/contacts';
import {NAME as PROJECTS} from 'actions/projects';
import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import {NAME as TOUCHPOINTS} from 'actions/touchpoints';
import {NAME as LESA_TICKETS} from 'actions/lesa-tickets';
import {NAME as OPPORTUNITY_LINE_ITEMS} from 'actions/opportunity-line-items';
import {NAME as USERS} from 'actions/users';

const fieldMap = {
	[ACCOUNTS]: {
		INDUSTRY: 'industry',
		ACTIVITY_HISTORY: 'activityHistory',
		ADDRESS: 'address',
		CONTACTS: 'contacts',
		CREATED_DATE: 'createdDate',
		CREATED_BY: 'createdBy',
		CURRENCY_ISO_CODE: 'currencyIsoCode',
		DESCRIPTION: 'description',
		HAS_ACTIVE_SUBSCRIPTION: 'hasActiveSubscription',
		HAS_OPEN_RENEWAL: 'hasOpenRenewal',
		HISTORY: 'history',
		ID: 'id',
		LAST_MODIFIED: 'lastModifiedBy',
		LAST_MODIFIED_DATE: 'lastModifiedDate',
		NAME: 'name',
		OPPORTUNITIES: 'opportunities',
		OPPORTUNITIES_AMOUNT_LIFETIME: 'opportunitiesAmountLifetime',
		OWNER: 'owner',
		PHONE_NUMBER: 'phoneNumber',
		PROJECTS: 'projects',
		RECORD_TYPE: 'recordType',
		SUBSCRIPTION_DAYS_LEFT: 'subscriptionDaysLeft',
		SUBSCRIPTION_TERM: 'subscriptionTerm',
		TOTAL_YEAR_AS_SUBSCRIBER: 'totalYearsAsSubscriber',
		TYPE: 'type',
		WEBSITE: 'website'
	},
	[CONTACTS]: {
		ACCOUNT: 'account',
		ACCOUNT_NAME: 'accountName',
		ACTIVITY_HISTORY: 'activityHistory',
		EMAIL: 'email',
		CREATED_BY: 'createdBy',
		HAS_ACTIVE_SUBSCRIPTION: 'hasActiveSubscription',
		ID: 'id',
		IS_ACTIVE: 'isActive',
		LAST_MODIFIED_BY: 'lastModifiedBy',
		MAILING_ADDRESS: 'mailingAddresss',
		NAME: 'name',
		OPPORTUNITIES: 'opportunities',
		OWNER: 'owner',
		PURCHASE_DECISION_INVOLVEMENT: 'purchaseDecisionInvolvement',
		TITLE: 'title',
		TYPE: 'type'
	},
	[LESA_TICKETS]: {
		SUMMARY: 'summary',
		SEVERITY: 'severity',
		COMMENTS: 'comments',
		HISTORY: 'history',
		PROJECT_TYPE: 'projectType',
		PROJECT: 'project',
		OPPORTUNITY: 'opportunity',
		DESCRIPTION: 'description',
		ISSUE_REPORTER: 'issueReporter',
		ISSUE_REPORT_DATE: 'issueReportDate',
		RESOLUTION: 'resolution',
		ESCALATION_LEVEL: 'escalationLevel',
		COMPONENT: 'component',
		ID: 'id',
		ISSUE_CLOSED_DATE: 'issueClosedDate',
		ISSUE_DUE_DATE: 'issueDueDate',
		STATUS: 'status'
	},
	[PROJECTS]: {
		ACCOUNT: 'account',
		ACCOUNT_NAME: 'accountName',
		CREATED_BY: 'createdBy',
		CREATED_DATE: 'createdDate',
		HISTORY: 'history',
		ID: 'id',
		LAST_MODIFIED_BY: 'lastModifiedBy',
		LESA_TICKETS: 'lesaTickets',
		LIFERAY_VERSION: 'liferayVersion',
		NAME: 'name',
		OPPORTUNITY_CLOSE_LOCAL_DATE: 'opportunityCloseLocalDate',
		OPPORTUNITIES: 'opportunities',
		SOLUTION_TYPE: 'solutionType',
		SUBSCRIPTION_END_DATE: 'subscriptionEndDate',
		SUBSCRIPTION_START_DATE: 'subscriptionStartDate',
		PARTNER_FIRST_LINE_SUPPORT: 'no',
		YEAR_ON_PROJECT_SUBSCRIPTION: 'yearOnProjectSubscription'
	},
	[OPPORTUNITIES]: {
		ACCOUNT: 'account',
		ACCOUNT_NAME: 'accountName',
		ACCOUNT_SUBSCRIPTION_TERM: 'accountSubscriptionTerm',
		ACCOUNT_SUBSCRIPTION_YEAR: 'accountSubscriptionYear',
		AMOUNT: 'amount',
		AUTO_RENEWAL: 'autoRenewal',
		BILLING_ADDRESS_KEY: 'billingAddressKey',
		BILLING_ADDRRESS_ID: 'billingAddressId',
		CLOSE_DATE: 'closeDate',
		CONSULTING_AMOUNT: 'consultingAmount',
		CONTACTS: 'contacts',
		CREATED_BY: 'createdBy',
		CREATED_DATE: 'createdDate',
		CURRENCY_ISO_CODE: 'currencyIsoCode',
		FIELD_HISTORY: 'fieldHistory',
		FORECASTS: 'forecasts',
		ID: 'id',
		LAST_MODIFIED_BY: 'lastModifiedBy',
		LIFERAY_VERSION: 'liferayVersion',
		LIST_PRICE_TOTAL: 'listPriceTotal',
		LOCAL_CURRENCY_AMOUNT: 'localCurrencyAmount',
		NAME: 'name',
		OPPORTUNITY_LINE_ITEMS: 'opportunityLineItems',
		OPTION_TYPE: 'optionType',
		OTHER_AMOUNT: 'otherAmount',
		OTHER_SUBSCRIPTION_AMOUNT: 'otherSubscriptionAmount',
		OVERALL_DISCOUNT: 'overallDiscount',
		OWNER: 'owner',
		PRECEDING_OPPORTUNITY: 'precedingOpportunity',
		PREVIOUS_SUBSCRIPTION_AMOUNT: 'previousSubscriptionAmount',
		PREVIOUS_SUBSCRIPTION_LEVEL: 'previousSubscriptionLevel',
		PROBABILITY: 'probability',
		PRODUCT_FAMILY: 'productFamily',
		PROJECT: 'project',
		PROJECT_NAME: 'projectName',
		RENEWAL_OPPORTUNITY: 'renewalOpportunity',
		RECORD_TYPE: 'recordType',
		SALES_TAX: 'salesTax',
		SHIPPING_ADDRESS_ID: 'shippingAddressId',
		SHIPPING_ADDRESS_KEY: 'shippingAddressKey',
		SOLD_BY: 'soldBy',
		STAGE: 'stage',
		STAGE_HISTORY: 'stageHistory',
		SUBSCRIPTION_AMOUNT: 'subscriptionAmount',
		SUBSCRIPTION_END_DATE: 'subscriptionEndDate',
		SUBSCRIPTION_LEVEL: 'subscriptionLevel',
		SUBSCRIPTION_START_DATE: 'subscriptionStartDate',
		TEAM: 'team',
		TERM_TYPE: 'termType',
		TOTAL: 'total',
		TOTAL_YEARS_IN_MY_TERM: 'totalYearsInMyTerm',
		TOUCHPOINTS: 'touchpoints',
		TRAINING_AMOUNT: 'trainingAmount',
		TYPE: 'type'
	},
	[OPPORTUNITY_LINE_ITEMS]: {
		ANNUAL_SALES_PRICE: 'annualSalesPrice',
		CALCULATED_DISCOUNT: 'calculatedDiscount',
		CODE: 'code',
		CURRENCY_ISO_CODE: 'currencyIsoCode',
		END_LOCAL_DATE: 'endLocalDate',
		FAMILY_FORMULA: 'familyFormula',
		ID: 'id',
		NAME: 'name',
		OPPORTUNITY: 'opportunity',
		PRICE_BOOK_ID: 'pricebookId',
		QUANTITY: 'quantity',
		SALES: 'sales',
		START_LOCAL_DATE: 'startLocalDate',
		TERM: 'term',
		TERM_TYPE: 'termType',
		TOTAL_PRICE: 'totalPrice',
		TYPE: 'type',
		UNIT_PRICE: 'unitPrice'
	},
	[TOUCHPOINTS]: {
		ACCOUNT_HISTORY_KEY: 'accountHistoryKey',
		ASSIGNED_TO: 'assignedTo',
		COMMENTS: 'comments',
		COMPLETED_DATE: 'completedDate',
		CONTACTS: 'contacts',
		CREATED_BY: 'createdBy',
		CREATED_DATE: 'createdDate',
		DESCRIPTION: 'description',
		DUE_DATE: 'dueDate',
		EMAIL: 'email',
		END: 'end',
		EVENT_RECORD_TYPE: 'eventRecordType',
		LAST_MODIFIED_BY: 'lastModifiedBy',
		LAST_MODIFIED_DATE: 'lastModifiedDate',
		NAME: 'name',
		OPPORTUNITY: 'opportunity',
		PROJECT: 'project',
		REMINDER: 'reminder',
		ID: 'id',
		START: 'start',
		STATUS: 'status',
		SHOW_TIME_AS: 'showTimeAs',
		SUBJECT: 'subject',
		TYPE: 'type'
	},
	[USERS]: {
		ACCOUNTS: 'accounts',
		ID: 'id',
		OPPORTUNITIES: 'opportunities',
		PROJECTS: 'projects'
	},
	OPPORTUNITIES_AMOUNT_ANNUAL: 'salesforceOpportunitiesAmountAnnual',
	OPPORTUNITIES_AMOUNT_LIFETIME: 'salesforceOpportunitiesAmountLifetime',
	OPPORTUNITIES_CLOSED_LOST_AMOUNT: 'salesforceOpportunitiesClosedLostAmount',
	OPPORTUNITIES_CLOSED_LOST_COUNT: 'salesforceOpportunitiesClosedLostCount',
	OPPORTUNITIES_CLOSED_WON_COUNT: 'salesforceOpportunitiesClosedWonCount',
	OPPORTUNITIES_OPEN_AMOUNT: 'salesforceOpportunitiesOpenAmount',
	OPPORTUNITIES_OPEN_COUNT: 'salesforceOpportunitiesOpenCount',
	OPPORTUNITY_AMOUNT: 'salesforceOpportunityAmount',
	OPPORTUNITY_CLOSE_LOCAL_DATE: 'salesforceOpportunityCloseLocalDate',
	OPPORTUNITY_CURRENCY_ISO_CODE: 'salesforceOpportunityCurrencyIsoCode',
	OPPORTUNITY_DATE_CREATED: 'salesforceOpportunityCreatedDateTime',
	OPPORTUNITY_KEY: 'salesforceOpportunityKey',
	// OPPORTUNITY_LINE_ITEMS: 'accountOpportunityLineItems',
	// OPPORTUNITY_LINE_ITEMS_CALCULATED_DISCOUNT: 'salesforceOpportunityLineItemCalculatedDiscount',
	// OPPORTUNITY_LINE_ITEMS_CURRENCY_ISO_CODE: 'salesforceOpportunityLineItemCurrencyIsoCode',
	// OPPORTUNITY_LINE_ITEMS_END_LOCAL_DATE: 'salesforceOpportunityLineItemEndLocalDate',
	// OPPORTUNITY_LINE_ITEMS_NAME: 'salesforceProduct2Name',
	// OPPORTUNITY_LINE_ITEMS_PRODUCT_KEY: 'salesforceProduct2Key',
	// OPPORTUNITY_LINE_ITEMS_QUANTITY: 'salesforceOpportunityLineItemQuantity',
	// OPPORTUNITY_LINE_ITEMS_START_LOCAL_DATE: 'salesforceOpportunityLineItemStartLocalDate',
	// OPPORTUNITY_LINE_ITEMS_TOTAL_PRICE: 'salesforceOpportunityLineItemTotalPrice',
	// OPPORTUNITY_LINE_ITEMS_UNIT_PRICE: 'salesforceOpportunityLineItemUnitPrice',
	OPPORTUNITY_NAME: 'salesforceOpportunityName',
	OPPORTUNITY_OWNER: 'owner',
	OPPORTUNITY_PRODUCT_FAMILY: 'salesforceOpportunityProductFamily',
	OPPORTUNITY_PROJECT: 'project',
	OPPORTUNITY_SOLD_BY: 'salesforceOpportunitySoldBy',
	OPPORTUNITY_STAGE: 'salesforceOpportunityStageName',
	OPPORTUNITY_SUBSCRIPTION_END_LOCAL_DATE: 'salesforceOpportunitySubscriptionEndLocalDate',
	OPPORTUNITY_SUBSCRIPTION_START_LOCAL_DATE: 'salesforceOpportunitySubscriptionStartLocalDate',
	OPPORTUNITY_TYPE: 'salesforceOpportunityType',
	OWNER_EMAIL: 'salesforceOwnerEmail',
	OWNER_KEY: 'salesforceOwnerKey',
	OWNER_NAME: 'salesforceOwnerName',
	PROJECT_CMS_ARRAY: 'salesforceProjectCMSArray',
	PROJECT_CRM_ARRAY: 'salesforceProjectCRMArray',
	PROJECT_DESCRIPTION: 'salesforceProjectDescription',
	PROJECT_FIRST_LINE_SUPPORT: 'salesforceProjectPartnerFirstLineSupport',
	PROJECT_GO_LIVE_DATE: 'salesforceProjectGoLiveDate',
	PROJECT_HOSTING: 'salesforceProjectHosting',
	PROJECT_IDENTITY_MANAGEMENT: 'salesforceProjectIdentityManagementArray',
	PROJECT_INTEGRATED_TECHNOLOGIES_ARRAY: 'salesforceProjectIntegratedTechnologiesArray',
	PROJECT_KEY: 'dossieraProjectKey',
	PROJECT_LIFERAY_FEATURES_USED_ARRAY: 'salesforceProjectLiferayFeaturesUsedArray',
	PROJECT_LIFERAY_VERSION: 'salesforceProjectLiferayVersion',
	PROJECT_MOBILE_SOLUTION_ARRAY: 'salesforceProjectMobileSolutionArray',
	PROJECT_NAME: 'salesforceProjectName',
	PROJECT_PARTNER: 'salesforceProjectPartnerName',
	PROJECT_PHASE: 'salesforceProjectPhase',
	PROJECT_SALESFORCE_KEY: 'salesforceProjectKey',
	PROJECT_SEARCH_ARRAY: 'salesforceProjectSearchArray',
	PROJECT_SOLUTION_TYPE_ARRAY: 'salesforceProjectSolutionTypeArray',
	PROJECT_STAGING: 'salesforceProjectStaging',
	PROJECT_STATUS: 'salesforceProjectStatus',
	PROJECT_SUBSCRIPTION_END_LOCAL_DATE: 'dossieraProjectSubscriptionEndLocalDate',
	PROJECT_SUBSCRIPTION_LEVEL: 'dossieraProjectSubscriptionLevel',
	PROJECT_SUBSCRIPTION_START_LOCAL_DATE: 'dossieraProjectSubscriptionStartLocalDate',
	PROJECT_SUPPORT_LANGUAGE: 'salesforceProjectSupportLanguage',
	PROJECT_SUPPORT_REGION: 'salesforceProjectSupportCenter',
	PROJECT_USERS_CONCURRENT: 'salesforceProjectUsersConcurrent',
	PROJECT_USERS_TOTAL: 'salesforceProjectUsersTotal',
	REVENUE_AMOUNT: 'dossieraAccrualRevenue',
	REVENUE_ID: 'dossieraAccountKey',
	SALESFORCE_CONTACT_EMAIL: 'salesforceContactEmail',
	SALESFORCE_CURRENCY_ISO_CODE: 'salesforceCurrencyIsoCode',
	SALESFORCE_KEY: 'salesforceKey',
	SALESFORCE_NAME: 'salesforceName',
	TIMELINE_EVENT_ACTION: 'dossieraEventAction',
	TIMELINE_EVENT_DATE: 'dossieraEventDateTime',
	TIMELINE_EVENT_TYPE: 'dossieraEventType',
	TIMELINE_TOOLTIP_CASH_REVENUE: 'dossieraCashRevenue',
	TIMELINE_TOOLTIP_OPPORTUNITIES: 'accountTimelineOpportunities',
	USER_AVATAR: 'avatar',
	USER_EMAIL: 'salesforceUserEmail',
	USER_FIRST_NAME: 'salesforceUserFirstName',
	USER_LAST_NAME: 'salesforceUserLastName',
	USER_OFFICE: 'office',
	USER_TITLE: 'title'
};

export const fieldValue = {
	ACCOUNT_OWNER_TYPE: {
		ACCOUNT: 'Account',
		OPPORTUNITY: 'Opportunity'
	},
	ACTIVITY_CREATED_BY: {
		HUBSPOT_MARKERTING: 'HubSpot Marketing'
	},
	LESA_TICKET_SEVERITY: {
		CRITICAL: 'Critical',
		MAJOR: 'Major',
		MINOR: 'Minor'
	 },
	LESA_TICKET_STATUS: {
		CLOSED: 'closed',
		RESOLVED: 'resolved',
		IN_PROGRESS: 'In Progress'
	},
	OPPORTUNITY_STAGE: {
		COMMITED_RENEWAL: 'Commited Renewal',
		CLOSED_LOST: 'Closed Lost',
		CLOSED_WON: 'Closed Won',
		JUSTIFICATION: 'Justification / Vendor Selection',
		LEGAL_REVIEW: 'Legal Review / Purchasing',
		QUALIFYING: 'Qualifying',
		ROLLED_INTO_OPPORTUNITY: 'Rolled into Opportunity',
		UNCOMMITTED_RENEWAL: 'Uncommitted Renewal'
	},
	OPPORTUNITY_STAGE_OPEN: {
		COMMITED_RENEWAL: 'Commited Renewal',
		JUSTIFICATION: 'Justification / Vendor Selection',
		LEGAL_REVIEW: 'Legal Review / Purchasing',
		QUALIFYING: 'Qualifying',
		UNCOMMITTED_RENEWAL: 'Uncommitted Renewal'
	},
	OPPORTUNITY_TYPE: {
		EXISTING_BUSINESS: 'Existing Business',
		NEW_BUSINESS: 'New Business',
		NEW_PROJECT_EXISTING_BUSINESS: 'New Project Existing Business',
		PROFESSIONAL_SERVICES: 'Professional Services',
		RENEWAL: 'Renewal',
		TRAINING: 'Training'
	},
	PRODUCT_FAMILY: {
		CONSULTING: 'C',
		OTHER: 'O',
		PARTNERSHIP_FEE: 'P',
		SUBSCRIPTION: 'S',
		TRAINING: 'T'
	},
	PROJECT_FIRST_LINE_SUPPORT: {
		NO: 'No',
		YES: 'Yes'
	},
	PROJECT_PHASE: {
		IN_DEVELOPMENT: 'In Development',
		LIVE_ADDITIONAL_DEVELOPMENT: 'Live - Additional Development/Feature and Performance Improvement',
		LIVE_MAINTANANCE: 'Live Maintanance',
		LIVE_UPGRADE: 'Live Upgrade',
		NO_LONGER_MAINTAINING: 'No Longer Maintaining'
	},
	SUBSCRIPTION_LEVEL: {
		GOLD: 'Gold',
		PLATINUM: 'Platinum',
		SILVER: 'Silver'
	},
	TIMELINE_EVENT_ACTION: {
		CLOSED_LOST: 'closed_lost',
		CLOSED_WON: 'closed_won',
		OPEN: 'create'
	},
	TIMELINE_EVENT_TYPE: {
		EXISTING_BUSINESS: 'Existing Business',
		NEW_BUSINESS: 'New Business',
		NEW_PROJECT_EXISTING_BUSINESS: 'New Project Existing Business',
		PROFESSIONAL_SERVICES: 'Professional Services',
		RENEWAL: 'Renewal',
		TRAINING: 'Training'
	},
	TOUCHPOINT_STATUS: {
		COMPLETED: 'Completed',
		OPEN: 'Open'
	},
	TOUCHPOINT_TYPE: {
		AUTOMATION: 'Automation',
		CALL: 'Call',
		CLICK: 'Click',
		DOWNLOAD: 'Download',
		EMAIL: 'Email',
		EVENT: 'Event',
		SUBMIT: 'Submit',
		WEBPAGE: 'Webpage'
	}
};

const currencyFields = {
	[fieldMap.ACCOUNT_STATS_OPPORTUNITIES_CLOSED_LOST]: fieldMap.SALESFORCE_CURRENCY_ISO_CODE,
	[fieldMap.OPPORTUNITIES_AMOUNT_ANNUAL]: fieldMap.SALESFORCE_CURRENCY_ISO_CODE,
	[fieldMap.OPPORTUNITIES_AMOUNT_LIFETIME]: fieldMap.SALESFORCE_CURRENCY_ISO_CODE,
	[fieldMap.OPPORTUNITIES_CLOSED_LOST_AMOUNT]: fieldMap.SALESFORCE_CURRENCY_ISO_CODE,
	[fieldMap.OPPORTUNITIES_OPEN_AMOUNT]: fieldMap.SALESFORCE_CURRENCY_ISO_CODE,
	[fieldMap.OPPORTUNITY_AMOUNT]: fieldMap.OPPORTUNITY_CURRENCY_ISO_CODE,
	[fieldMap.OPPORTUNITY_LINE_ITEMS_TOTAL_PRICE]: fieldMap.OPPORTUNITY_LINE_ITEMS_CURRENCY_ISO_CODE,
	[fieldMap.OPPORTUNITY_LINE_ITEMS_UNIT_PRICE]: fieldMap.OPPORTUNITY_LINE_ITEMS_CURRENCY_ISO_CODE,
	[fieldMap.PROJECT_STATS_ANNUAL_REVENUE]: true,
	[fieldMap.PROJECT_STATS_LIFETIME_VALUE]: true,
	[fieldMap.PROJECT_STATS_OPEN_OPPORTUNITIES]: true,
	[fieldMap.REVENUE_AMOUNT]: fieldMap.SALESFORCE_CURRENCY_ISO_CODE,
	[fieldMap.TIMELINE_TOOLTIP_CASH_REVENUE]: fieldMap.SALESFORCE_CURRENCY_ISO_CODE
};

const dateFields = {
	[fieldMap.ACTIVITY_DATE]: 'MMM D',
	[fieldMap.OPPORTUNITY_SUBSCRIPTION_END_LOCAL_DATE]: 'MM/DD/YYYY',
	[fieldMap.OPPORTUNITY_SUBSCRIPTION_START_LOCAL_DATE]: 'MM/DD/YYYY',
	[fieldMap.PROJECT_SUBSCRIPTION_END_LOCAL_DATE]: 'MM/DD/YYYY',
	[fieldMap.PROJECT_SUBSCRIPTION_START_LOCAL_DATE]: 'MM/DD/YYYY'
};

const dateFieldsRelative = {
	[fieldMap.ACCOUNT_MODIFIED_DATE]: false,
	[fieldMap.OPPORTUNITY_CLOSE_LOCAL_DATE]: true,
	[fieldMap.OPPORTUNITY_DATE_CREATED]: false
};

const listFields = {
	[fieldMap.PROJECT_CMS_ARRAY]: ', ',
	[fieldMap.PROJECT_CRM_ARRAY]: ', ',
	[fieldMap.PROJECT_INTEGRATED_TECHNOLOGIES_ARRAY]: ', ',
	[fieldMap.PROJECT_LIFERAY_FEATURES_USED_ARRAY]: ', ',
	[fieldMap.PROJECT_MOBILE_SOLUTION_ARRAY]: ', ',
	[fieldMap.PROJECT_SEARCH_ARRAY]: ', ',
	[fieldMap.PROJECT_SOLUTION_TYPE_ARRAY]: ', '
};

const percentageFields = {
	[fieldMap.OPPORTUNITY_LINE_ITEMS_CALCULATED_DISCOUNT]: true
};

export const fieldFormats = {
	currencyFields,
	dateFields,
	dateFieldsRelative,
	listFields,
	percentageFields
};

export default fieldMap;