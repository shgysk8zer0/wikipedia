import {$} from './std-js/functions.js';
const ENDPOINT = 'https://en.wikipedia.org/w/api.php';
$(self).ready(() => {
	$(document.forms.search).submit(async (submit) => {
		submit.preventDefault();
		const form = new FormData(submit.target);
		const url = new URL(ENDPOINT);
		const headers = new Headers();
		const container = document.getElementById('results-container');
		$('.search-result', container).remove();
		url.searchParams.set('action', 'query');
		url.searchParams.set('list', 'search');
		url.searchParams.set('format', 'json');
		url.searchParams.set('utf8', 1);
		url.searchParams.set('srsearch', form.get('query'));
		url.searchParams.set('srlimit', form.get('limit'));
		url.searchParams.set('origin', '*');
		headers.set('Accept', 'application/json');
		const resp = await fetch(url, {headers, mode: 'cors'});
		if (resp.ok) {
			const json = await resp.json();
			const template = document.getElementById('search-result-template').content;
			json.query.search.forEach(result => {
				const entry = template.cloneNode(true);
				$('[data-field]', entry).forEach(node => {
					if (result.hasOwnProperty(node.dataset.field)) {
						node.innerHTML = result[node.dataset.field];
					} else {
						node.remove();
					}
				});
				$('[href="https://en.wikipedia.org/?curid"]', entry).forEach(node => {
					const url = new URL(node.href);
					url.searchParams.set('curid', result.pageid);
					node.href = url;
				});
				container.appendChild(entry);
			});
			console.log(json);
		} else {
			throw new Error(`${resp.url} [${resp.status} ${resp.statusText}]`);
		}
	});
}, {once: true});
