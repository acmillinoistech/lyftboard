let config = require('./config');

import {Views} from './views';
let views = Views();

import {COMMUNITY_AREAS} from './communityareas';

let FirebaseApp = firebase.initializeApp(config);
let db = FirebaseApp.database();

const PARAMS = getQueryParams(document.location.search);
const GAME = 'workshop'; //prompt("Enter your game key:");

let PAGE = '';
let USER_ID = false;
let USER = {};
let IS_ADMIN = false;

const PINK = `#EA38B9`;
const PURPLE = `#422E6E`;

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
const COLORS = `#e6194b-#3cb44b-#ffe119-#0082c8-#f58231-#911eb4-#46f0f0-#f032e6-#d2f53c-#fabebe-#008080-#e6beff-#aa6e28-#fffac8-#800000-#aaffc3-#808000-#ffd8b1-#000080-#808080-#000000`.split(`-`).map((hex) => `${hex}`).reverse();

function getQueryParams(qs) {
	qs = qs.split('+').join(' ');
	var params = {},
		tokens,
		re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
}

// https://stackoverflow.com/questions/35803540/how-to-remove-special-characters-from-a-string-using-javascript
function removeSpecialChars(str) {
	return str.replace(/(?!\w|\s)./g, '')
		.replace(/\s+/g, ' ')
		.replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}

function fillSpans(queryStr, text) {
	Array.from(document.querySelectorAll(queryStr)).forEach((div) => {
		div.innerText = text;
	});
}

function getResults(gameid, callback) {
	db.ref(`lyft/results/${gameid}`).once('value', (snap) => {
		let val = snap.val() || {};
		callback(val);
	});
}

function getTeams(gameid, callback) {
	db.ref(`lyft/info/${gameid}`).once('value', (snap) => {
		let val = snap.val() || {};
		callback(val);
	});
}

function getTeamData(res, info) {
	let inMap = res || {};
	let sims = Object.keys(inMap).map((key) => res[key]).sort((a, b) => {
		return a.start - b.start;
	});
	let time = [];
	let map = {};
	if (sims.length > 0) {
		let first = sims[0];
		let counter = 0;
		for (let teamid in first.data) {
			if (!(teamid in map)) {
				map[teamid] = {
					info: {
						teamid: teamid,
						name: `Untitled Team ${ALPHABET[counter]} (${teamid})`
					},
					trips: [],
					revenue: []
				}
				if (teamid in info) {
					map[teamid].info = info[teamid];
					map[teamid].info.teamid = teamid;
				}
			}
			counter++;
		}
		sims.forEach((sim) => {
			time.push(sim.start);
			for (let teamid in sim.data) {
				if (teamid in map) {
					let step = sim.data[teamid];
					map[teamid].trips.push(step.trips);
					let inRev = step.revenue;
					let rev = {
						lyft: parseFloat(inRev.lyft),
						taxi: parseFloat(inRev.taxi)
					}
					map[teamid].revenue.push(rev);
				}
			}
		});
	}
	return {
		time: time,
		map: map
	};
}

function getTeamScore(data) {
	let totalRev = data.revenue.reduce((sum, val) => {
		return sum + val.lyft;
	}, 0);
	let totalTrips = data.trips.reduce((sum, val) => {
		return sum + val.lyft;
	}, 0);
	return {
		revenue: totalRev,
		trips: totalTrips
	}
}

function mainResults(time, map) {
	let datasets = [];
	let i = 0;
	for (let teamid in map) {
		let line = [];
		let total = 0;
		map[teamid].revenue.forEach((step, idx) => {
			total += step.lyft;
			line.push({
				x: time[idx],
				y: total
			});
		});
		datasets.push({
			label: map[teamid].info.name,
			borderColor: COLORS[i],
			fill: false,
			cubicInterpolationMode: 'monotone',
			data: line
		});
		i++;
	}
	let ctx = document.getElementById('plot1').getContext('2d');
	let chart = new Chart(ctx, {
		type: `line`,
		data: {
			datasets: datasets
		},
		options: {
			responsive: false,
			maintainAspectRatio: true,
			legend: {
				position: `right`,
			},
			title: {
				display: true,
				text: `Revenue over Time`
			},
			scales: {
				xAxes: [{
					display: true,
					type: `linear`,
					scaleLabel: {
						display: true,
						labelString: 'Time'
					},
					ticks: {
						callback: (ts) => {
							return moment(ts).format('M/D');
						}
					}
				}],
				yAxes: [{
					display: true,
					type: `linear`,
					scaleLabel: {
						display: true,
						labelString: 'Revenue ($)'
					},
					ticks: {
						callback: (rev) => {
							return `$${rev.toFixed(0)}`;
						}
					}
				}]
			},
			elements: {
				point: {
					radius: 0
				}
			},
			multiTooltipTemplate: `<%%=datasetLabel%>: $<%%=value%>`
		}
	});
}

function getTeamRankList(map) {
	let list = [];
	for (let teamid in map) {
		let score = getTeamScore(map[teamid]);
		list.push({
			info: map[teamid].info,
			score: score
		});
	}
	let sorted = list.sort((a, b) => {
		return b.score.revenue - a.score.revenue;
	});
	let rank = 0;
	let score = Infinity;
	sorted.forEach((team) => {
		if (team.score.revenue < score) {
			score = team.score.revenue;
			rank++;
		}
		team.rank = rank;
	});
	return sorted;
}

function mainLeaderboard(time, map) {
	let list = getTeamRankList(map);
	let view = views.getLeaderboard({
		list: list
	});
	document.getElementById('leaderboard').appendChild(view);
}

function mainTeam(teamid, team) {

	if (teamid && team) {

		let reset = views.getTeamManagement();
		document.getElementById('team-management').innerHTML = reset.innerHTML;

		document.getElementById('team-space').classList.remove('is-hidden');
		document.getElementById('no-team-space').classList.add('is-hidden');

		let teamSecretField = document.getElementById('team-secret');
		let teamSecretButton = document.getElementById('show-team-secret');
			teamSecretField.value = teamid;
		
		teamSecretButton.addEventListener('click', (e) => {
			if (teamSecretField.type === 'password') {
				teamSecretField.type = 'text';
				teamSecretButton.innerText = 'Hide';
				teamSecretButton.classList.remove('is-danger');
				teamSecretButton.classList.add('is-success');
			} else {
				teamSecretField.type = 'password';
				teamSecretButton.innerText = 'Show';
				teamSecretButton.classList.remove('is-success');
				teamSecretButton.classList.add('is-danger');
			}
		});

		let teamNameField = document.getElementById('team-name');
		let teamNameButton = document.getElementById('update-team-name');
			teamNameField.value = team.info.name;
			fillSpans('.fill-team-name', team.info.name);

		teamNameButton.addEventListener('click', (e) => {
			db.ref(`lyft/info/${GAME}/${teamid}/name`).set(teamNameField.value).then((done) => {
				window.location.reload();
			}).catch(console.error);
		});

		let pricingHolder = document.getElementById('holder-pricing');
		let zonesHolder = document.getElementById('holder-zones');

		db.ref(`lyft/teams/${GAME}/${teamid}`).on('value', (snap) => {
			let val = snap.val();
			if (val) {
				if (val.pricing) {
					pricingHolder.innerHTML = '';
					let pView = views.getPricingCards(val);
					pricingHolder.appendChild(pView);
				}
				if (val.zones) {
					zonesHolder.innerHTML = '';
					val.community = COMMUNITY_AREAS;
					let zView = views.getZonesCards(val);
					zonesHolder.appendChild(zView);
				}
			}
		});

	} else {
		console.error('Cannot access team: ', teamid, team);
	}

}

function showTeam(teamid, inData) {
	let data = inData || getGameData();
	if (!data) {
		console.error('No game data available');
	}
	let team = {revenue: [], trips: [], info: {name: 'No Team'}};
	if (teamid) {
		console.log(`Your team is: ${teamid}`);
		team = data.map[teamid];
	} else {
		console.log(`You do not have a team.`);
	}
	mainTeam(teamid, team);
}

function mainAdmin() {
	let data = getGameData();
	let list = getTeamRankList(data.map);
	let teamTable = document.getElementById('all-teams-table');
	teamTable.innerHTML = '';
	let table = views.getAdminTeamTable({
		list: list
	});
	teamTable.appendChild(table);
}

function showPage(pageid) {
	PAGE = (pageid === 'loading') ? PAGE : pageid;
	// Tabs
	let currentTab = document.querySelector(`li[data-page].is-active`);
	if (currentTab) {
		currentTab.classList.remove('is-active');
	}
	let newTab = document.querySelector(`li[data-page="${pageid}"]`);
	if (newTab) {
		newTab.classList.add('is-active');
	}
	// Sections
	Array.from(document.querySelectorAll(`section[data-page]`)).forEach((page) => {
		page.classList.add('is-hidden');
	});
	let newPage = document.querySelector(`section[data-page="${pageid}"]`);
	if (newPage) {
		newPage.classList.remove('is-hidden');
	}
}

function getTeamByEmail(email) {
	return new Promise((resolve, reject) => {
		let emailid = removeSpecialChars(email);
		db.ref(`lyft/assignments/${GAME}/${emailid}`).once('value', (snap) => {
			let teamid = snap.val();
			resolve(teamid);
		}).catch(reject);
	});
}

function login() {
	return new Promise((resolve, reject) => {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider).then((data) => {
			var user = data.user;
			console.log(user);
		}).catch(reject);
	});
}

let routes = {

	'/results': () => {
		console.log('results')
		showPage('results');
	},


	'/leaderboard': () => {
		console.log('leaderboard')
		showPage('leaderboard');
	},

	'/search': () => {
		console.log('search')
		showPage('search');
	},

	'/team': () => {
		console.log('team')
		showPage('team');
	},

	'/team/:teamid': (teamid) => {
		console.log(`team/${teamid}`);
		if (IS_ADMIN) {
			showTeam(teamid);
		}
		showPage('team');
	},

	'/admin': () => {
		console.log('admin')
		showPage('admin');
	},

}

let router = Router(routes);
router.init();
showPage('loading');

document.getElementById('signout').addEventListener('click', (e) => {
	firebase.auth().signOut();
});

let gameData = {};

function getGameData() {
	return gameData;
}

function main() {

	getResults(GAME, (res) => {
		getTeams(GAME, (teamInfo) => {
			let data = getTeamData(res, teamInfo);
			console.log(data);
			gameData = data;
			mainResults(data.time, data.map);
			mainLeaderboard(data.time, data.map);
			mainAdmin();
			getTeamByEmail(USER.email).then((teamid) => {
				showTeam(teamid, data);
			});
			showPage(PAGE);
		});
	});

	let emailid = removeSpecialChars(USER.email);
	db.ref(`lyft/admin/${GAME}/${emailid}`).once('value', (snap) => {
		let val = snap.val();
		if (val) {
			IS_ADMIN = true;
			document.querySelector('[data-page="admin"]').classList.remove('is-hidden');
		}
	});

}

if (GAME) {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			USER_ID = user.uid;
			USER = user;
			main();
		} else {
			login();
		}
	});
} else {
	alert('Please reload and enter a valid game key.');
}

