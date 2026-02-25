function stop(fn?: (evt: Event) => void) {
	return (evt: Event) => {
		evt.stopImmediatePropagation();
		evt.preventDefault();
		fn?.(evt);
	};
}

function preventDefault(fn?: (evt: Event) => void) {
	return (evt: Event) => {
		evt.preventDefault();
		fn?.(evt);
	};
}

function stopPropagation(fn?: (evt: Event) => void) {
	return (evt: Event) => {
		evt.stopPropagation();
		fn?.(evt);
	};
}

function stopImmediatePropagation(fn?: (evt: Event) => void) {
	return (evt: Event) => {
		evt.stopImmediatePropagation();
		fn?.(evt);
	};
}

export default {
	stop,
	preventDefault,
	stopPropagation,
	stopImmediatePropagation
};
