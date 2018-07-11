import {is, isImmutable, List, Map} from 'immutable';
import {camelCase, isNil} from 'lodash';
import Moment from 'moment';

import {fieldFormats, fieldValue} from 'lib/field-formats';

const SPLIT_REGEX = /({\d+})/g;

const {
	SUBSCRIPTION_LEVEL: {
		PLATINUM,
		GOLD,
		SILVER
	}
} = fieldValue;

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function checkIfPropsChanged(keys, props) {
	return props ? keys.some(
		item => {
			let retVal = false;

			if (props.hasOwnProperty(item)) {
				retVal = isImmutable(item) ? !is(props[item].prevVal, props[item].newVal) : props[item].prevVal !== props[item].newVal;
			}

			return retVal;
		}
	) : false;
}

export function composeReducers(...reducers) {
	return (state, action) => reducers.reduce(
		(currentState, reducer) => reducer(currentState, action),
		state
	);
}

export function createActionTypes(actionTypes, action, name, genericizeKey) {
	action = action.toUpperCase();
	name = name.toUpperCase();

	const key = genericizeKey ? action : `${action}_${name}`;

	return actionTypes.reduce(
		(actions, type) => {
			actions[`${key}_${type}`] = `${action}_${name}_${type}`;

			return actions;
		},
		{}
	);
}

export function createReducer(initialState, actionHandlers) {
	return (state = initialState, action) => {
		const handler = actionHandlers[action.type];

		return handler ? handler(state, action) : state;
	};
}

export function formatCurrency(amount, isoCode) {
	amount = +amount;

	let currencyPrefix = 'USD';

	if (isoCode) {
		currencyPrefix = isoCode;
	}

	amount = `${currencyPrefix} ${amount.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;

	return amount;
}

export function formatField(dataItem = new Map(), field) {
	let unformattedField = dataItem.get(field);

	if (!isNil(unformattedField)) {
		const currencyFields = fieldFormats.currencyFields;

		if (currencyFields.hasOwnProperty(field)) {
			unformattedField = formatCurrency(unformattedField, dataItem.get(currencyFields[field]));
		}

		const dateFields = fieldFormats.dateFields;

		if (dateFields.hasOwnProperty(field)) {
			unformattedField = formatDate(unformattedField, dateFields[field]);
		}

		const dateFieldsRelative = fieldFormats.dateFieldsRelative;

		if (dateFieldsRelative.hasOwnProperty(field)) {
			unformattedField = formatRelativeDate(unformattedField, dateFieldsRelative[field]);
		}

		const percentageFields = fieldFormats.percentageFields;

		if (percentageFields.hasOwnProperty(field)) {
			unformattedField = formatPercentage(unformattedField, percentageFields[field]);
		}

		const listFields = fieldFormats.listFields;

		if (listFields.hasOwnProperty(field)) {
			unformattedField = formatList(unformattedField, listFields[field]);
		}
	}
	else {
		unformattedField = getString(unformattedField);
	}

	return unformattedField;
}

export function formatFields(dataItem, fields) {
	return fields.reduce(
		(prev, field) => (
			{
				[field]: formatField(dataItem, field),
				...prev
			}
		),
		{}
	);
}

export function getActionName(controllerName, actionName) {
	return camelCase(`${actionName}${controllerName}`);
}

export function getLoopNameFromEmail(email) {
	const match = email.match(/.+?(?=@)/)
	return match ? match[0] : '';
}

export function joinArrayFields(iterable, fieldName) {
	return iterable.reduce(
		(accum, entry) => entry.get(fieldName) ? accum.concat(entry.get(fieldName)) : accum,
		new List()
	);
}

export function getInitials(name) {
	const spaceDelineatedName = name.split(' ', 2);

	const firstLetter = spaceDelineatedName[0] ? spaceDelineatedName[0].charAt(0) : '';
	const lastLetter = spaceDelineatedName[1] ? spaceDelineatedName[1].charAt(0) : '';

	return `${firstLetter}${lastLetter}`;
}

export function getPluralMessage(singular, plural, count = 0, markup) {
	const message = count === 1 ? singular : plural;

	return markup ? subLanguageKeyArray(message, [markup]) : subLanguageKey(message, [count]);
}

export function getPortletPath() {
	return window.Dossiera.URLS.PORTLET_URL.split(window.location.host)[1];
}

export function iterateCollection(collection) {
	return f => {
		for (let i = 0; collection[i]; i++) {
			f(collection[i], i);
		}
	};
}

export function mapAvailableKeys(array, map) {
	return array.reduce(
		(accum, key, index) => {
			const result = map.get(key);

			return result ? accum.set(key, result) : accum;
		},
		new Map()
	)
}

export function pixelToNumber(value) {
	return +value.replace('px', '');
}

export function splitLineItemName(lineItemName) {
	let lineItemType;
	let productLevel;
	let productSubTypeName;

	if (lineItemName) {
		const lineItemNameParts = lineItemName.split(/ - (.+)/);

		lineItemType = lineItemNameParts[0];

		productSubTypeName = lineItemNameParts[1];

		if (productSubTypeName) {
			const words = productSubTypeName.split(/ (.+)/);

			const firstWord = words[0];

			if (firstWord === GOLD || firstWord === PLATINUM || firstWord === SILVER) {
				productLevel = firstWord;

				productSubTypeName = words[1];
			}
		}
	}

	return {
		lineItemType,
		productLevel,
		productSubTypeName
	};
}

export function subLanguageKey(langKey, args) {
	return subLanguageKeyArray(langKey, args).join('');
}

export function subLanguageKeyArray(langKey, args) {
	const keys = langKey.split(SPLIT_REGEX).filter(val => val.length !== 0);

	args.forEach(
		(arg, i) => {
			const indexKey = `{${i}}`;

			let argIndex = keys.indexOf(indexKey);

			while (argIndex >= 0) {
				keys.splice(argIndex, 1, arg);

				argIndex = keys.indexOf(indexKey);
			}
		}
	);

	return keys;
}

export function updateUrl(newUrl) {
	const state = history.state;

	state.path = newUrl;
	state.redirectPath = newUrl;

	history.replaceState(state, '', newUrl);
}

function formatDate(date, format) {
	if (date) {
		date = Moment(date).format(format);
	}

	return date;
}

function formatList(list, join) {
	let string = list;

	if (List.isList(list)) {
		string = list.join(join);
	}

	return string;
}

function formatPercentage(amount) {
	return `${amount.toFixed(2)}%`;
}

function formatRelativeDate(date, removeSuffix) {
	if (date) {
		date = Moment(date).fromNow(removeSuffix);
	}

	return date;
}

function getString(string) {
	if (!string) {
		string = ' - ';
	}

	return string;
}