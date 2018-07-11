import JSXComponent, {Config} from 'metal-jsx';
import 'air-datepicker';
import 'air-datepicker/dist/js/i18n/datepicker.en.js';
import Moment from 'moment';

import TextInput from 'components/inputs/TextInput';

let datePickerId = 0;

const getUniqueId = () => datePickerId++;

class DatePicker extends JSXComponent {
	created() {
		this._datePickerId = getUniqueId();
	}

	render() {
		const {
			max,
			min,
			value: externalValue
		} = this.props;

		const {
			invalid,
			value
		} = this.state;

		return (
			<TextInput
				elementClasses="date-picker-container"
				id={`${this._datePickerId}_date_picker`}
				invalid={invalid}
				onChange={this._handleOnChange}
				value={value || Moment(externalValue).format('YYYY-MM-DD HH:MM')}
			/>
		);
	}

	rendered(first) {
		const {
			max,
			min,
			value
		} = this.props;

		const {
			invalid
		} = this.state;

		if (first) {
			const config = {
				language: 'en',
				position: 'right bottom',
				onSelect: this._handleOnChange,
				timepicker: true,
				maxDate: max,
				minDate: min,
				dateFormat: 'yyyy-mm-dd',
				timeFormat: 'hh:ii',
			};

			if (!invalid) {
				config.startDate = Moment(value).toDate()
			}

			this._datepicker = $(`#${this._datePickerId}_date_picker`).datepicker(config).data('datepicker');
		}
		else if (max !== this._prevMax || min !== this._prevMin) {
			this._datepicker.update({
				maxDate: max ? max : null,
				minDate: min ? min : null
			});
		}

		this._prevMax = max;
		this._prevMin = min;
	}

	_handleOnChange = value => {
		const {
			max,
			min,
			onChange
		} = this.props;

		const momentValue = Moment(value);

		const valid = momentValue.isValid() && (min ? momentValue.isAfter(min) : true) && (max ? momentValue.isBefore(max) : true);

		if (valid) {
			this._datepicker.date = momentValue.toDate();
		}

		onChange(valid ? momentValue.format() : value);

		if (this.setState) {
			this.setState(
				{
					invalid: !valid,
					value: value
				}
			);
		}
	}
}

DatePicker.PROPS = {
	autofocus: Config.value(false),
	max: Config.instanceOf(Date),
	min: Config.instanceOf(Date),
	initialValue: Config.string(),
	label: Config.string(),
	onChange: Config.func().value(f => f),
	placeholder: Config.string(),
	value: Config.string().value(Moment().format())
};

DatePicker.STATE = {
	value: Config.value(''),
	invalid: Config.bool().value(false)
}

export default DatePicker;