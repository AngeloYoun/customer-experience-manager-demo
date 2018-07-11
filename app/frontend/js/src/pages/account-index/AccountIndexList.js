import {fromJS, List, Map} from 'immutable';
import {debounce, fill, isNil} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';

import searchIcon from 'resources/search-icon';

import ActionButton from 'components/buttons/ActionButton';
import TextInput from 'components/inputs/TextInput';
import ListComponent from 'components/list/List';
import PlaceholderMessage from 'components/text-groups/PlaceholderMessage';
import DataHandler from 'components/wrappers/DataHandler';
import fieldMap from 'lib/field-formats';
import {subLanguageKey, updateUrl} from 'lib/util';
import AccountIndexEntry from 'pages/account-index/AccountIndexEntry';

const {
	ACCOUNT_NAME
} = fieldMap;

const BUTTON_PLACEHOLDER = 'BUTTON_PLACEHOLDER';

const ENTRY_BATCH_COUNT = 20;

class AccountIndexList extends JSXComponent {
	created() {
		const {
			getAccountsQueryCount,
			query
		} = this.props;

		const {
			filter
		} = this.state;

		if (query) {
			this.state.filter = query;
		}

		const keyword = query || filter;

		getAccountsQueryCount({keyword});

		this._prevAccountsList = new List();
	}

	render() {
		const {
			accounts,
			accountsCount,
			accountsQueryCount,
			accountsResults,
			getAccounts
		} = this.props;

		const {
			filter,
			itemsLoaded
		} = this.state;

		const queriedAccountsCount = filter ? accountsQueryCount : accountsCount;

		const queryResultAvailable = !isNil(accountsResults) && accountsResults.has(`${filter}_${itemsLoaded - ENTRY_BATCH_COUNT}_${itemsLoaded}`);

		const accountsList = queryResultAvailable ? this._getAccountsList(accounts, accountsResults, filter, itemsLoaded, queriedAccountsCount) : this._prevAccountsList;

		this._prevAccountsList = accountsList;

		return (
			<div class="account-index-list-container">
				<div class="list-header page-header">
					<div class="list-search">
						{searchIcon}

						<TextInput
							autofocus={true}
							elementClasses="filter"
							initialValue={filter}
							onChange={this._handleFilterOnChange}
							placeholder={Liferay.Language.get('search-for-accounts')}
						/>
					</div>
				</div>

				<div class="list-controls">
					<h3 class="results-count">
						{subLanguageKey(
							Liferay.Language.get('x-accounts-of-x'),
							[queriedAccountsCount, accountsCount]
						)}
					</h3>

					<h3 class="sort">
						{Liferay.Language.get('sorting-by-last-modified')}
					</h3>
				</div>

				<DataHandler
					dataConfigs={fromJS(
						[
							{
								action: getAccounts,
								dataExists: queryResultAvailable,
								requestParams: {
									end: itemsLoaded,
									keyword: filter,
									start: itemsLoaded - ENTRY_BATCH_COUNT
								},
								waitForData: false
							}
						]
					)}
				>
					{(accountsList && accountsList.size) ? (
						<ListComponent
							focused={true}
							itemRenderer={this._renderAccountEntry}
							listItems={accountsList}
						/>
					) : (
						<div class="content-sectionless">
							<PlaceholderMessage
								message={Liferay.Language.get('there-are-no-matching-accounts')}
							/>
						</div>
					)}
				</DataHandler>
			</div>
		);
	};

	_addLoadMoreButton = (accountsList, queriedAccountsCount) => {
		return accountsList.size < queriedAccountsCount ? accountsList.push(BUTTON_PLACEHOLDER) : accountsList;
	};

	_getAccountsList = (accounts, accountsResults, filter, itemsLoaded, queriedAccountsCount) => this._addLoadMoreButton(
		this._getMatchingAccounts(accounts, accountsResults, filter, itemsLoaded),
		queriedAccountsCount
	);

	_getMatchingAccounts = (accounts, accountsResults, filter, itemsLoaded) => {
		const results = fill(
			Array(itemsLoaded / ENTRY_BATCH_COUNT)
		).reduce(
			(accum, item, index) => {
				const loadedCount = index * ENTRY_BATCH_COUNT;

				const key = `${filter}_${loadedCount}_${loadedCount + ENTRY_BATCH_COUNT}`;

				return accountsResults.has(key) ? accum.concat(accountsResults.get(key)) : accum;
			},
			new List()
		);

		return results.map(
			key => accounts.get(key)
		);
	}

	_handleFilterOnChange = debounce(
		filter => {
			const {
				getAccountsQueryCount
			} = this.props;

			getAccountsQueryCount(
				{
					keyword: filter
				}
			);

			updateUrl(
				filter ? `${window.Dossiera.URLS.PORTLET_URL}account?query=${filter}` : `${window.Dossiera.URLS.PORTLET_URL}account`
			);

			this.setState(
				{
					filter,
					itemsLoaded: ENTRY_BATCH_COUNT
				}
			);
		},
		100,
		{
			leading: true,
			trailing: true
		}
	);

	_handleLoadMore = () => {
		const {
			itemsLoaded
		} = this.state;

		this.state.itemsLoaded = itemsLoaded + ENTRY_BATCH_COUNT;
	}

	_renderAccountEntry = ({index, itemData, selected}) => {
		let renderedComponent;

		if (itemData === BUTTON_PLACEHOLDER) {
			renderedComponent = (
				<ActionButton
					buttonLabel={Liferay.Language.get('load-more')}
					elementClasses={`load-more-button ${selected ? 'selected' : ''}`}
					key={index}
					onClick={this._handleLoadMore}
				/>
			);
		}
		else {
			let accountName = itemData.get(ACCOUNT_NAME);

			accountName = accountName ? accountName.toLowerCase() : accountName;

			let filter = this.state.filter;

			filter = filter ? filter.toLowerCase() : filter;

			if (!filter || (accountName && accountName.includes(filter))) {
				renderedComponent = (
					<AccountIndexEntry
						account={itemData}
						highlight={filter}
						key={index}
						selected={selected}
					/>
				);
			}
		}

		return renderedComponent;
	};
}

AccountIndexList.PROPS = {
	accounts: Config.instanceOf(Map),
	accountsQueryCount: Config.number(),
	accountsResults: Config.instanceOf(Map),
	getAccounts: Config.func(),
	query: Config.string()
};

AccountIndexList.STATE = {
	filter: Config.string().value(''),
	itemsLoaded: Config.number().value(20)
};

AccountIndexList.SYNC_UPDATES = true;

export default AccountIndexList;