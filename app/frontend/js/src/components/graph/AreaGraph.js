import {is, List, Map} from 'immutable';
import JSXComponent, {Config} from 'metal-jsx';
import {Graph2d as visGraph} from 'vis';

class Graph extends JSXComponent {
	attached() {
		window.setTimeout(this._updateGraph, 30);
	}

	detached() {
		const {
			graph
		} = this.state;

		if (graph) {
			graph.destroy();
		}
	}

	render() {
		return (
			<div
				class="graph-container"
				key="container"
			/>
		);
	}

	shouldUpdate() {
		return false;
	}

	syncData(newProp, oldProp) {
		const {
			graph
		} = this.state;

		if (graph && !is(newProp, oldProp)) {
			graph.setItems(newProp.toJS());
		}
	}

	_updateGraph = () => {
		const {
			data,
			groups,
			options
		} = this.props;

		const defaultOptions = {
			height: '100%',
			interpolation: false,
			moveable: false,
			shaded: {
				enabled: true
			},
			width: '100%'
		};

		const graph = new visGraph(
			this.element,
			data.toJS(),
			groups.toJS(),
			Object.assign(defaultOptions, options.toJS())
		);

		this.setState(
			{
				graph
			}
		);
	}
}

Graph.PROPS = {
	bindSelf: Config.func(),
	data: Config.instanceOf(List),
	groups: Config.instanceOf(List),
	options: Config.instanceOf(Map)
};

Graph.STATE = {
	graph: Config.object()
};

export default Graph;