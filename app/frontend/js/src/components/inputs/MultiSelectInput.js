import JSXComponent, {Config} from 'metal-jsx';
import {List} from 'immutable';

import ActionButton from 'components/buttons/ActionButton';
import CloseButton from 'components/buttons/CloseButton';
import SelectInput from 'components/inputs/SelectInput';

class MultiSelectInput extends JSXComponent {
	render() {
		const {
			data,
			renderer,
			values,
			unique
		} = this.props;

		return (
			<div class="multi-select-input-container">
				{values.map(
					(value, index) => {
						const uniqueData = unique ? data.filter(
							entry => value ? entry === value || !values.includes(entry) : !values.includes(entry)
						) : data;

						return (
							<div class="multi-select-input-group">
								<SelectInput
									elementClasses="modifier-select"
									onChange={this._handleOnChange(index)}
									data={uniqueData}
									renderer={option => renderer ? renderer(option) : (
										<h3 class="value">{option}</h3>
									)}
									selectedIndex={uniqueData.indexOf(value)}
								/>

								<CloseButton
									elementClasses="remove-input"
									onClick={this._removeInput(index)}
								/>
							</div>
						);
					}
				).toJS()}

				{(!unique || values.size < data.size) && (
					<ActionButton
						elementClasses="add-input"
						onClick={this._addInput}
						buttonLabel={'Add Contact'}
					/>
				)}
			</div>
		);
	}

	_addInput = () => {
		const {
			data,
			onChange,
			values,
			unique
		} = this.props;

		const uniqueData = unique ? data.filter(
			entry =>!values.includes(entry)
		) : data

		onChange(
			values.push(uniqueData.get(0))
		)
	}

	_removeInput = index => () => {
		const {
			onChange,
			values
		} = this.props;

		onChange(
			values.delete(index)
		);
	}

	_handleOnChange = index => option => {
		const {
			onChange,
			values
		} = this.props;

		onChange(
			values.set(index, option)
		);
	};
}

MultiSelectInput.PROPS = {
	data: Config.instanceOf(List).value(List()).required(),
	unique: Config.bool().value(true),
	renderer: Config.func(),
	invalid: Config.bool().value(false),
	onChange: Config.func().value(f => f).required(),
	values: Config.instanceOf(List).value(List()).required()
};

export default MultiSelectInput;