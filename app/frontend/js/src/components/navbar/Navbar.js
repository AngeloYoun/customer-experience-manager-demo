import {List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';

import {checkIfPropsChanged} from 'lib/util';

class Navbar extends JSXComponent {
	render() {
		const {
			href,
			options,
			optionsMap,
			selected
		} = this.props;

		return (
			<div class="navbar-container">
				{this._generateNavbarEntries(href, options, optionsMap, selected)}
			</div>
		);
	}

	shouldUpdate(nextState, nextProps) {
		return checkIfPropsChanged(
			[
				'href',
				'options',
				'optionsMap',
				'selected'
			],
			nextProps
		);
	}

	_constructHref(entry, href) {
		const placeholders = href.match(/({.*?})/g);

		placeholders.forEach(
			placeholder => {
				const parameterKey = placeholder.replace(/{|}/g, '');

				if (parameterKey === 'option') {
					href = href.replace(placeholder, entry);
				}
			}
		);

		return href;
	}

	_generateNavbarEntries(href, options, optionsMap, selected) {
		return options.map(
			entry => {
				let selectedClass = '';

				if (entry == selected) {
					selectedClass = 'selected';
				}

				return (
					<div class={`navbar-entry ${selectedClass}`} key={entry}>
						<a
							class="navbar-entry-link"
							href={this._constructHref(entry, href)}
						>
							<h3 class="navbar-entry-label">{optionsMap.get(entry)}</h3>
						</a>
					</div>
				);
			}
		);
	}
}

Navbar.PROPS = {
	href: Config.string(),
	options: Config.instanceOf(List),
	optionsMap: Config.instanceOf(Map),
	selected: Config.string()
};

export default Navbar;