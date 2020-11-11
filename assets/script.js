document.body.dataset.style = localStorage.getItem("style") ?? "clair";

function visible(id) {
	document.getElementById(id).style.display = "block";
}

function invisible(id) {
	document.getElementById(id).style.display = "none";
}
async function offer() {
	const code = document.getElementById('offer').value;
	if (!code) return visible('invalidKey');
	const url = `https://comm.libraryofcode.org/report/offer/?code=${code}`;

	const fetched = await fetch(url);
	const accessDenied = 'Your access to this service has been denied.\nYou can access every 30 minutes.';
	if (fetched.status === 400 || fetched.status === 401 || fetched.status === 403 || fetched.status === 429) return visible('paKDenied');
	if (fetched.status >= 500) return visible('serviceE');
	invisible('pre');
	visible('offer-accepted');
	alert('This offer has been accepted, you may now close this tab.');
}
async function submit() {
	const pin1 = document.getElementById('pin1').value;
	if (!pin1 || pin1.length < 3 || pin1.length > 3) return visible('invalidPIN');
	const pin2 = document.getElementById('pin2').value;
	if (!pin2 || pin2.length < 2 || pin2.length > 2) return visible('invalidPIN');
	const pin3 = document.getElementById('pin3').value;
	if (!pin3 || pin3.length < 4 || pin3.length > 4) return visible('invalidPIN');
	let url = `https://comm.libraryofcode.org/report/web/?pin=${pin1}-${pin2}-${pin3}`;
	const staffPin1 = document.getElementById('staff-pin1').value;
	const staffPin2 = document.getElementById('staff-pin2').value;
	const staffPin3 = document.getElementById('staff-pin3').value;
	const combinedStaff = staffPin1 + staffPin2 + staffPin3;
	if (combinedStaff && combinedStaff.length === 9) url += `&staff=${staffPin1}-${staffPin2}-${staffPin3}`;
	const fetched = await fetch(url);
	const accessDenied = 'Your access to this service has been denied.\nYou can access every 30 minutes.';
	// if (fetched.status === 400 || fetched.status === 401 || fetched.status === 403 || fetched.status === 429) return alert(accessDenied);
	if (fetched.status === 400 || fetched.status === 401 || fetched.status === 403 || fetched.status === 429) return visible('denied');
	if (fetched.status >= 500) return visible('serviceE');
	const data = await fetched.json();
	invisible('pre');
	document.getElementById('lastUpdated').innerHTML = `<strong>[-] Last updated:</strong> <span class="ScoreColorP">${new Date(data.lastUpdated).toLocaleString('en-us')}</span>`;
	document.getElementById('name').innerHTML = `<strong>[-] Name:</strong> <span class="ScoreColorP">${data.name}</span>`;
	document.getElementById('id').innerHTML = `<strong>[-] ID:</strong> <span class="ScoreColorP">${data.userID}</span>`;
	document.getElementById('pin').innerHTML = `<strong>[-] PIN:</strong> <span class="ScoreColorP">${data.pin}</span>`;
	document.getElementById('locked').innerHTML = `<strong>[-] Account Locked:</strong> <span class="ScoreColorP">${data.locked === true ? 'Yes' : 'No'}</span>`;
	document.getElementById('notify').innerHTML = `<strong>[-] Notify Hard Pull:</strong> <span class="ScoreColorP">${data.notify === true ? 'Yes' : 'No'}</span>`;
	document.getElementById('total').innerHTML = `<strong>[-] Community Score:</strong> <span class="ScoreColorP">${data.score}</span>`;
	document.getElementById('activity').innerHTML = `<strong>[-] Activity:</strong> <span class="ScoreColorP">${data.activityScore}</span>`;
	document.getElementById('roles').innerHTML = `<strong>[-] Roles:</strong> <span class="ScoreColorP">${data.roleScore}</span>`;
	document.getElementById('moderation').innerHTML = `<strong>[-] Moderation:</strong> <span class="ScoreColorP">${data.moderationScore}</span>`;
	document.getElementById('cs').innerHTML = `<strong>[-] Cloud Services:</strong> <span class="ScoreColorP">${data.cloudServicesScore}</span>`;
	document.getElementById('other').innerHTML = `<strong>[-] Other:</strong> <span class="ScoreColorP">${data.otherScore}</span>`;
	document.getElementById('misc').innerHTML = `<strong>[-] Misc:</strong> <span class="ScoreColorP">${data.miscScore}</span>`;

	const testAv = data.avatarURL;
	var img = document.createElement('img');
	img.src = testAv;
	var src = document.getElementById('profile-img');
	src.appendChild(img);

	const hard = document.getElementById('hard');
	for (const pull of data.inquiries.sort((a, b) => b.date > a.date)) {
		const row = hard.insertRow();
		row.insertCell().innerHTML = pull.id || 'N/A';
		row.insertCell().innerHTML = pull.name.toUpperCase();
		row.insertCell().innerHTML = pull.reason;
		row.insertCell().innerHTML = new Date(pull.date).toLocaleString('en-us');
		row.insertCell().innerHTML = `${moment(pull.date).add(1460, 'hours').fromNow()} | ${moment(pull.date).add(1460, 'hours').calendar()}`;
		document.getElementById('hardCount').innerHTML = `<span i="ScoreColorP">${data.inquiries.length}</span>`;
	}
	const soft = document.getElementById('soft');
	for (const pull of data.softInquiries.sort((a, b) => a.date > b.date)) {
		const row = soft.insertRow();
		row.insertCell().innerHTML = pull.name.toUpperCase();
		row.insertCell().innerHTML = new Date(pull.date).toLocaleString('en-us');
		document.getElementById('softCount').innerHTML = `<span class="ScoreColorP">${data.softInquiries.length}</span>`;
	}
	const hist = document.getElementById('hist');
	for (const pull of data.historical.sort((a, b) => b.date > a.date)) {
		var div = document.createElement('div');
		const report = pull.report;
		div.className = 'card card-body';

		document.getElementById('histCount').innerHTML = `<span class="ScoreColorP">${data.historical.length}</span>`;

		hist.appendChild(div);

		div.insertAdjacentHTML('beforebegin', `<p><strong>[-] Date:</strong> <span style="color: #db6300">${new Date(pull.date).toLocaleString('en-us')}</span></p>`);
		div.insertAdjacentHTML('beforeend', `<p>[-] Total Score: <span class="ScoreColorP">${report.total}</span></p>`);
		div.insertAdjacentHTML('beforeend', `<p>[-] Activity: <span class="ScoreColorP">${report.activity}</span></p>`);
		div.insertAdjacentHTML('beforeend', `<p>[-] Roles: <span class="ScoreColorP">${report.roles}</span></p>`);
		div.insertAdjacentHTML('beforeend', `<p>[-] Moderation: <span class="ScoreColorP">${report.moderation}</span></p>`);
		div.insertAdjacentHTML('beforeend', `<p>[-] CS Services: <span class="ScoreColorP">${report.cloudServices}</span></p>`);
		div.insertAdjacentHTML('beforeend', `<p>[-] Other: <span class="ScoreColorP">${report.other}</span></p>`);
	}
	visible('post');
}
async function searchFunction() {
	var input, filter, table, tr, td, i, txtValue;
	input = document.getElementById("searchInput");
	filter = input.value.toUpperCase();
	table = document.getElementById("hard");
	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0];
		if (td) {
			txtValue = td.textContent || td.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}
async function searchFunctionTwo() {
	var input, filter, table, tr, td, i, txtValue;
	input = document.getElementById("searchInputTwo");
	filter = input.value.toUpperCase();
	table = document.getElementById("soft");
	tr = table.getElementsByTagName("tr");

	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0];
		if (td) {
			txtValue = td.textContent || td.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
}
Array.from(document.getElementsByName("radioStyle")).find(radio => radio.value === document.body.dataset.style)?.click()
Array.from(document.getElementsByName("radioStyle")).forEach(radio => radio.onclick = () => {
	document.body.dataset.style = radio.value
	localStorage.setItem("style", radio.value)
})