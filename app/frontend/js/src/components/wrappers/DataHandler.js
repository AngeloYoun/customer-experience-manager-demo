import {List} from 'immutable';
import {findIndex, partition} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';

import ErrorMessage from 'components/text-groups/ErrorMessage';
import LoadingWrapper from 'components/wrappers/LoadingWrapper';
import {checkIfPropsChanged} from 'lib/util';
import errorIcon from 'resources/error-icon';
import loadingEllipses from 'resources/loading-ellipses';

const AVAILABLE = 'AVAILABLE';

const ERROR = 'ERROR';

const NON_BLOCKING_ERROR = 'NON_BLOCKING_ERROR';

class DataHandler extends JSXComponent {
	created() {
		const {
			dataConfigs
		} = this.props;

		this._fetchData(dataConfigs);
	}

	render() {
		const {
			children,
			dataConfigs,
			inline
		} = this.props;

		const {
			lazyLoading,
			loading,
			responses
		} = this.state;

		const allDataAvailable = dataConfigs.every(
			(dataConfig, index) => dataConfig.get('dataExists') || this._checkIfResponseCompleted(index, responses)
		);

		const allCriticalDataAvailable = dataConfigs.filter(
			dataConfig => dataConfig.get('waitForData') !== false
		).every(
			(dataConfig, index) => dataConfig.get('dataExists') || this._checkIfResponseCompleted(index, responses)
		);

		const blockingErrorsExist = responses.some(
			response => response.status === ERROR
		);

		const nonBlockingErrorsExist = responses.some(
			response => response.status === NON_BLOCKING_ERROR
		);

		return (
			<div class="data-handler-container">
				<LoadingWrapper
					dataLoaded={(!loading && allCriticalDataAvailable) || blockingErrorsExist}
					inline={inline}
				>
					{blockingErrorsExist ? (
						<ErrorMessage
							refetchData={this._refetchData}
						/>
					) : (
						children
					)}
				</LoadingWrapper>

				{!allDataAvailable && !blockingErrorsExist && (lazyLoading || nonBlockingErrorsExist) &&
					<div class="data-status">
						{lazyLoading ? (
							loadingEllipses
						) : (
							<h4 class="non-blocking-error-message" onClick={this._refetchData}>
								{errorIcon}

								{Liferay.Language.get('sorry-we-couldnt-get-all-your-data-please-try-again')}
							</h4>
						)}
					</div>
				}
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return nextState ? true : checkIfPropsChanged(
			[
				'children',
				'dataConfigs'
			],
			nextProps
		);
	}

	syncDataConfigs(nextDataConfigs, prevDataConfigs) {
		if (nextDataConfigs && prevDataConfigs) {
			if (this._needToRefetch(nextDataConfigs, prevDataConfigs)) {
				this._refetchData();
			}
		}
	}

	_checkIfResponseCompleted(index, responses) {
		const responseIndex = findIndex(responses, ['id', index])

		return responseIndex > -1 && responses[responseIndex].status === AVAILABLE;
	}

	_checkIfDisposed(e) {
		if (this && !this.disposed_) {
			throw e;
		}
	}

	_fetchData(dataConfigs) {
		const missingDataConfigs = dataConfigs.map(
			(config, index) => config.set('id', index)
		).toJS().filter(
			({dataExists}) => !dataExists
		);

		const [criticalDataConfigs, nonCriticalDataConfigs] = partition(
			missingDataConfigs,
			({waitForData = true}) => waitForData
		);

		if (criticalDataConfigs.length) {
			this._handleCriticalRequests(criticalDataConfigs);
		}

		if (nonCriticalDataConfigs.length) {
			this._handleNonCriticalRequests(nonCriticalDataConfigs);
		}
	}

	_handleCriticalRequests(criticalDataConfigs) {
		this.setState(
			{
				loading: true
			}
		);

		const criticalRequests = criticalDataConfigs.map(
			({action, id, requestParams}) => action(
				requestParams
			).then(
				response => (
					{
						id,
						status: AVAILABLE
					}
				),
				error => (
					{
						id,
						message: error.message,
						status: ERROR
					}
				)
			).catch(
				this._checkIfDisposed
			)
		);

		Promise.all(criticalRequests).then(
			responses => {
				this.setState(
					{
						loading: false,
						responses: this.state.responses.concat(responses)
					}
				);
			}
		).catch(
			this._checkIfDisposed
		);
	}

	_handleNonCriticalRequests(nonCriticalDataConfigs) {
		this.setState(
			{
				lazyLoading: true
			}
		);

		const lazyRequests = nonCriticalDataConfigs.map(
			({action, id, requestParams}) => action(
				requestParams
			).catch(
				e => this.setState(
					{
						responses: this.state.responses.concat(
							{
								id,
								status: NON_BLOCKING_ERROR
							}
						)
					}
				)
			)
		);

		Promise.all(lazyRequests).then(
			() => {
				this.setState(
					{
						lazyLoading: false
					}
				);
			}
		).catch(
			this._checkIfDisposed
		);
	}

	_needToRefetch(nextDataConfigs, prevDataConfigs) {
		const dataIsMissing = nextDataConfigs.some(
			dataConfig => !dataConfig.get('dataExists')
		);

		const allDataWasAvailable = prevDataConfigs.every(
			dataConfig => dataConfig.get('dataExists')
		);

		const requestParamsChanged = nextDataConfigs.some(
			(dataConfig, key) => !dataConfig.get('requestParams').equals(
				prevDataConfigs.getIn([key, 'requestParams'])
			)
		);

		return (dataIsMissing && allDataWasAvailable) || requestParamsChanged;
	}

	_refetchData = () => {
		this.setState(
			{
				responses: []
			}
		);

		this._fetchData(this.props.dataConfigs);
	}
}

DataHandler.PROPS = {
	children: Config.array().required(),
	dataConfigs: Config.instanceOf(List),
	inline: Config.bool().value(false),
	showWithoutData: Config.bool().value(false)
};

DataHandler.STATE = {
	lazyLoading: Config.bool().value(false),
	loading: Config.bool().value(false),
	responses: Config.array().value([])
};

export default DataHandler;