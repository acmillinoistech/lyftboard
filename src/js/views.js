// https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
	c = isNaN(c = Math.abs(c)) ? 2 : c, 
	d = d == undefined ? "." : d, 
	t = t == undefined ? "," : t, 
	s = n < 0 ? "-" : "", 
	i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

function getMoneyStyleStr(ratio) {
	let opac = (0.95 * ratio) + 0.05;
	let styleStr = `background-color: rgba(35, 209, 96, ${opac.toFixed(3)})`;
	return styleStr;
}

let Views = () => {

	let views = {

		/*getLeaderboard: (model) => {
			let html = ``;
			if (model.list.length > 0) {
				let maxRev = model.list[0].score.revenue;
				html += `
					<table class="is-fullwidth">
						<thead>
							<tr>
								<th>Rank</th>
								<th>Team</th>
								<th>Net Revenue</th>
								<th>Gross Revenue</th>
								<th>Trips</th>
							</tr>
						</thead>
						<tbody>
				`;
				model.list.forEach((team) => {
					let revRatio = team.score.revenue / maxRev;
					let opac = (0.95 * revRatio) + 0.05;
					let styleStr = `background-color: rgba(35, 209, 96, ${opac.toFixed(3)})`;
					let spanHTML = '';
					if (team.rank === 1) {
						spanHTML = `
							<span class="icon">
								<i class="icon fa fa-trophy"></i>
							</span>
						`;
					}
					html += `
							<tr>
								<td><span>${team.rank}</span>${spanHTML}</td>
								<td>${team.info.name}</td>
								<td>???</td>
								<td style="${styleStr}">$${team.score.revenue.formatMoney(2)}</td>
								<td>${team.score.trips}</td>
							</tr>
					`;
				});
				html += `
						</tbody>
					</table>
				`;
			} else {
				html += `
					<p>There are no teams in this game yet.</p>
				`;
			}
			let div = document.createElement('div');
				div.innerHTML = html;
				div.classList.add('table-holder');
			return div;
		},*/

		getPricingCards: (model) => {
			let html = ``;
			let list = Object.keys(model.pricing).map((tkey) => {
				let entry = model.pricing[tkey];
					entry.tkey = tkey;
				return entry;
			}).sort((a, b) => {
				return b.in_effect - a.in_effect;
			});
			if (list.length > 0) {
				list.forEach((step) => {
					html += `
						<div class="card">
							<div class="card-content">
								<h5 class="title is-5">Week of ${moment(step.in_effect).format('M/D/YYYY')}</h5>
								<table>
									<thead>
										<tr>
											<th>Category</th>
											<th>Cost</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Base</td>
											<td>$${step.base.formatMoney(2)}</td>
										</tr>
										<tr>
											<td>Pickup</td>
											<td>$${step.pickup.formatMoney(2)}</td>
										</tr>
										<tr>
											<td>Per Mile</td>
											<td>$${step.per_mile.formatMoney(2)}</td>
										</tr>
										<tr>
											<td>Per Minute</td>
											<td>$${step.per_minute.formatMoney(2)}</td>
										</tr>
									</tbody>
								</table>
								<h5 class="title is-5">Reflection</h5>
							`;
							if (step.note) {
								html += `
									<textarea class="textarea" data-tkey="${step.tkey}">${step.note}</textarea>
								`;
							} else {
								html += `
									<textarea class="textarea" data-tkey="${step.tkey}" placeholder="Why did you choose these prices?"></textarea>
								`;
							}
							html += `
								<button data-tkey="${step.tkey}" class="button is-primary">Save</button>
							</div>
							<!--<footer class="card-footer">
								<a href="#" class="card-footer-item">Save</a>
								<a href="#" class="card-footer-item">Edit</a>
								<a href="#" class="card-footer-item">Delete</a>
							</footer>-->
						</div>
					`;
				});
			} else {
				html += `
					<div class="notification is-primary">
						<h2 class="title is-3">No trip costs set.</h2>
						<p class="subtitle is-6">Make a POST request to the /pricing endpoint.</p>
					</div>
				`;
			}
			let div = document.createElement('div');
				div.innerHTML = html;
			return div;
		},

		getZonesCards: (model) => {
			let html = ``;
			let list = Object.keys(model.zones).map((tkey) => {
				let entry = model.zones[tkey];
					entry.tkey = tkey;
				return entry;
			}).sort((a, b) => {
				return b.in_effect - a.in_effect;
			});
			if (list.length > 0) {
				list.forEach((step) => {
					html += `
						<div class="card">
							<header class="card-header">
								<p class="card-header-title">Week of ${moment(step.in_effect).format('M/D/YYYY')}</p>
							</header>
							<div class="card-content">
								<table>
									<thead>
										<tr>
											<th>Zone</th>
											<th>Community Area</th>
										</tr>
									</thead>
									<tbody>
					`;
					for (let zid in step) {
						if (zid !== 'in_effect' && zid !== 'tkey' && zid !== 'note') {
							html += `
										<tr>
											<td>Zone ${zid}</td>
											<td>${model.community[zid]}</td>
										</tr>
							`;
						}
					}
					html += `
									</tbody>
								</table>
								<h5 class="title is-5">Reflection</h5>
							`;
							if (step.note) {
								html += `
									<textarea class="textarea" data-tkey="${step.tkey}">${step.note}</textarea>
								`;
							} else {
								html += `
									<textarea class="textarea" data-tkey="${step.tkey}" placeholder="Why did you choose these zones?"></textarea>
								`;
							}
							html += `
								<button data-tkey="${step.tkey}" class="button is-primary">Save</button>
							</div>
							<!--<footer class="card-footer">
								<a href="#" class="card-footer-item">Save</a>
								<a href="#" class="card-footer-item">Edit</a>
								<a href="#" class="card-footer-item">Delete</a>
							</footer>-->
						</div>
					`;
				});
			} else {
				html += `
					<div class="notification is-primary">
						<h2 class="title is-3">No power zones set.</h2>
						<p class="subtitle is-6">Make a POST request to the /zones endpoint.</p>
					</div>
				`;
			}
			let div = document.createElement('div');
				div.innerHTML = html;
			return div;
		},

		//getAdminTeamTable: (model) => {
		getLeaderboard: (model) => {
			let html = ``;
			if (model.list.length > 0) {
				let maxRev = model.list[0].score.revenue;
				let maxNet = model.list[0].score.net;
				html += `
					<table class="is-fullwidth">
						<thead>
							<tr>
								<th>Rank</th>
								<th>Team</th>
								<th>Net Revenue</th>
								<th>Gross Revenue</th>
								<th>Trips</th>
				`;
						if (model.admin) {
							html += `
								<th>View</th>
								<th>Delete</th>
							`;
						}
				html += `
							</tr>
						</thead>
						<tbody>
				`;
				model.list.forEach((team) => {
					let revRatio = team.score.revenue / maxRev;
					let netRatio = team.score.net / maxNet;
					let spanHTML = '';
					if (team.rank === 1) {
						spanHTML = `
							<span class="icon">
								<i class="icon fa fa-trophy"></i>
							</span>
						`;
					}
					html += `
							<tr>
								<td><span>${team.rank}</span>${spanHTML}</td>
								<td>${team.info.name}</td>
					`;
						if (model.showFinal) {
							html += `
								<td class="money-cell" style="${getMoneyStyleStr(netRatio)}">$${team.score.net.formatMoney(2)}</td>
							`;
						} else {
							html += `
								<td>???</td>
							`;
						}
					html += `
								<td class="money-cell" style="${getMoneyStyleStr(revRatio)}">$${team.score.revenue.formatMoney(2)}</td>
								<td>${team.score.trips}</td>
					`;
						if (model.admin) {
							html += `
								<td><a href="./#/team/${team.info.teamid}" class="button is-primary is-outlined">View</a></td>
								<td><a href="./#/delete/${team.info.teamid}" class="button is-danger is-outlined">Delete</a></td>
							`;
						}
					html += `
							</tr>
					`;
				});
				html += `
						</tbody>
					</table>
				`;
			} else {
				html += `
					<p>There are no teams in this game yet.</p>
				`;
			}
			let div = document.createElement('div');
				div.innerHTML = html;
				div.classList.add('table-holder');
			return div;
		},

		getTeamManagement: () => {
			let html = `
				<div class="columns">
					<div class="column is-6">
						<h4 class="title is-4">Team Name</h4>
						<div class="field has-addons">
							<p class="control">
								<input id="team-name" class="input" type="text">
							</p>
							<p class="control">
								<button id="update-team-name" class="button is-success">Update</button>
							</p>
						</div>
						<h4 class="title is-4">Team Secret</h4>
						<div class="field has-addons">
							<p class="control">
								<input id="team-secret" class="input is-static" type="password" value="secrettext" readonly>
							</p>
							<p class="control">
								<button id="show-team-secret" class="button is-danger">Show</button>
							</p>
						</div>
					</div>
					<div class="column is-6">
						<h4 class="title is-4">Invite Teammate</h4>
						<div class="field has-addons">
							<p class="control">
								<input id="teammate-email" class="input" type="text">
							</p>
							<p class="control">
								<button id="invite-teammate" class="button is-success">Invite</button>
							</p>
						</div>
						<h4 class="title is-4">Current Teammates</h4>
						<ul id="teammates-list"></ul>
					</div>
				</div>
			`;
			let div = document.createElement('div');
				div.innerHTML = html;
			return div;
		}

	}

	return views;

}

export {Views};
