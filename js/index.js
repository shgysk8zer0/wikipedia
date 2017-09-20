import {$} from './std-js/functions.js';
$(self).ready(() => {
	$(document.forms.search).submit(async (submit) => {
		submit.preventDefault();
		const form = new FormData(submit.target);
		console.log(...form.entries());
	});
}, {once: true});
