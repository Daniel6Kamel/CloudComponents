﻿const _amc_progressbar_valueRange = '.amc-progressbar-value';
const _amc_progressbar_changingRange = '.amc-progressbar-changingvalue';

function updatePosition(component: HTMLElement, clientX: number, maxMoveDistance: number) {

	let moveDistance = clientX - component.getBoundingClientRect().left - (component.querySelector('.amc-progressbar-middle').clientWidth / 2);

	if (moveDistance < 0)
		moveDistance = 0;

	if (moveDistance > maxMoveDistance)
		moveDistance = maxMoveDistance;

	component.style.setProperty('grid-template-columns', moveDistance + 'px max-content 1fr')

	const range: HTMLInputElement = component.querySelector(_amc_progressbar_valueRange);
	const changingRange: HTMLInputElement = component.querySelector(_amc_progressbar_changingRange);

	const total = Number(range.max);

	const value = moveDistance * total / maxMoveDistance;

	changingRange.value = value.toString();
	range.value = value.toString();

	const evt = document.createEvent("HTMLEvents");

	evt.initEvent("change", false, true);
	changingRange.dispatchEvent(evt);
}

export function mouseDown(component: HTMLElement, clientX: number) {

	component["IsUserInput"] = true;
	component.classList.add('_moving');

	const range: HTMLInputElement = component.querySelector(_amc_progressbar_valueRange);

	const oldValue = range.value;

	const maxMoveDistance = component.clientWidth - component.querySelector('.amc-progressbar-middle').clientWidth;

	updatePosition(component, clientX, maxMoveDistance);

	// Mouse Move

	const mouseMoveListener = function (moveArgs: MouseEvent) { updatePosition(component, moveArgs.clientX, maxMoveDistance); };

	document.addEventListener('mousemove', mouseMoveListener);

	// Mouse Up

	const mouseUpListener = function () {
		component["IsUserInput"] = false;

		component.classList.remove('_moving');

		document.removeEventListener('mousemove', mouseMoveListener);
		document.removeEventListener('mouseup', mouseUpListener);

		if (range.value === oldValue)
			return;

		const evt = document.createEvent("HTMLEvents");
		evt.initEvent("change", false, true);

		range.dispatchEvent(evt);
	}

	document.addEventListener('mouseup', mouseUpListener);
}

export function touchDown(component: HTMLElement, clientX: number) {

	component["IsUserInput"] = true;
	component.classList.add('_moving');

	const range: HTMLInputElement = component.querySelector(_amc_progressbar_valueRange);

	const oldValue = range.value;

	const maxMoveDistance = component.clientWidth - component.querySelector('.amc-progressbar-middle').clientWidth;

	updatePosition(component, clientX, maxMoveDistance);

	// Touch Move

	const touchMoveListener = function (moveArgs: TouchEvent) { updatePosition(component, moveArgs.touches[0].clientX, maxMoveDistance); };

	document.addEventListener('touchmove', touchMoveListener);

	// Touch Up

	const touchEndListener = function () {
		component["IsUserInput"] = false;

		component.classList.remove('_moving');

		document.removeEventListener('touchmove', touchMoveListener);
		document.removeEventListener('touchup', touchEndListener);

		if (range.value === oldValue)
			return;

		const evt = document.createEvent("HTMLEvents");
		evt.initEvent("change", false, true);

		range.dispatchEvent(evt);
	}

	document.addEventListener('touchend', touchEndListener);
}

export function repaint(component: HTMLElement, value?: number, total?: number) {

	if (component["IsUserInput"] && component["IsUserInput"] === true)
		return;

	if (!component.querySelector)
		return;

	const range: HTMLInputElement = component.querySelector(_amc_progressbar_valueRange);

	if (total === null || total === undefined)
		total = Number(range.max);

	if (value === null || value === undefined)
		value = Number(range.value);

	const maxMoveDistance = component.clientWidth - component.querySelector('.amc-progressbar-middle').clientWidth;

	const moveDistance = value * maxMoveDistance / total;

	component.style.setProperty('grid-template-columns', moveDistance + 'px max-content 1fr')
}

export function getInfo(component: HTMLElement) {

	const element = component.querySelector('.amc-progressbar-middle');

	return {
		Left: element.getBoundingClientRect().left,
		Top: element.getBoundingClientRect().right,
		Width: element.clientWidth,
		Height: element.clientHeight
	};
}