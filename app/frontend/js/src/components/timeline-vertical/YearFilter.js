import {List, Map} from 'immutable';
import {keys, sortBy, reverse} from 'lodash';
import JSXComponent, {Config} from 'metal-jsx';
import Moment from 'moment';

import {NAME as OPPORTUNITIES} from 'actions/opportunities';
import ToggleButton from 'components/buttons/ToggleButton';
import fieldMap from 'lib/field-formats';

const {
	[OPPORTUNITIES]: opportunitiesFields,
} = fieldMap;

class YearFilter extends JSXComponent {
	render() {
		const {
			filters,
			years,
			setFilter
		} = this.props;

		return (
			<div class="year-filter-container">
				{years.map(
					(year, index) => (
						<ToggleButton
							active={filters.has(year)}
							label={year}
							onClick={this._handleFilter(year, index)}
						/>
					)
				).toJS()}
			</div>
		);
	}

	_getYearValidator = year => entry => Moment(entry.get(opportunitiesFields.CLOSE_DATE)).format('YYYY') !== year;

	_handleFilter = year => (event, active) => {
		this.props.setFilter(!active, year, this._getYearValidator(year));
	}
}

YearFilter.PROPS = {
	filters: Config.instanceOf(Map).required(),
	setFilter: Config.func().required(),
	years: Config.instanceOf(List).required()
};

export default YearFilter;