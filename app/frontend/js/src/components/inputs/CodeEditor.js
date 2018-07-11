import JSXComponent, {Config} from 'metal-jsx';
import Codemirror from 'codemirror';
import cmJavascript from 'codemirror/mode/javascript/javascript'

import {checkIfPropsChanged} from 'lib/util';

class CodeEditor extends JSXComponent {
	render() {
		const {
			value
		} = this.props;

		const {
			invalid
		} = this.state;

		return (
			<div class={`code-editor-container ${invalid ? 'invalid' : ''} ${value ? '' : 'no-value'}`}>
				{invalid && (
					<h4 class="error-message">
						{'Value is not a valid JSON'}
					</h4>
				)}
			</div>
		)
	}

	rendered() {
		const {
			onChange,
			value
		} = this.props;

		const {
			invalidValue
		} = this.state;

		const codeMirror = Codemirror(
			this.element,
			{
				indentWithTabs: true,
				indentUnit: 4,
				lineNumbers: true,
				mode: {
					name: 'javascript',
					json: true
				},
				readOnly: onChange ? false : true,
				theme: 'solarized dark',
				value: invalidValue ? invalidValue : value
			}
		);

		codeMirror.on('change', this._handleOnChange)

		codeMirror.focus();

		const doc = codeMirror.getDoc();

		if (this.prevCursor) {
			doc.setCursor(this.prevCursor);
		}
	}

	shouldUpdate(nextState, nextProps) {
		return nextState ? true : checkIfPropsChanged(
			[
				'onChange',
				'value'
			],
			nextProps
		);
	}

	_handleOnChange = codeMirror => {
		const {
			onChange
		} = this.props;

		const doc = codeMirror.getDoc();

		const value = codeMirror.getValue();

		this.prevCursor = doc.getCursor();

		try {
			this.setState(
				{
					invalid: false,
					invalidValue: null
				}
			);

			onChange(
				JSON.parse(value)
			);
		}
		catch(e) {
			this.setState(
				{
					invalid: true,
					invalidValue: value
				}
			);
		}
	}
}

CodeEditor.PROPS = {
	onChange: Config.func(),
	value: Config.string().value('')
}

CodeEditor.STATE = {
	invalid: Config.bool().value(false),
	invalidValue: Config.string()
}

export default CodeEditor;