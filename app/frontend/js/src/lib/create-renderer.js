import Component from 'metal-jsx';
import {Provider} from 'metal-redux';

export default store => (Comp, options, element, replaceInner) => {
	if (replaceInner) {
		element.innerHTML = '';
	}

	return Component.render(
		<Provider store={store}>
			<Comp {...options} />
		</Provider>,
		replaceInner ? element : {element}
	);
};