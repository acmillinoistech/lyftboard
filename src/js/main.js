let config = require('./config');

import {Views} from './views';
let views = Views();

import {COMMUNITY_AREAS} from './communityareas';

let FirebaseApp = firebase.initializeApp(config);
let db = FirebaseApp.database();

const showdown = require('showdown');
const classMap = {
	h1: 'title is-1',
	h2: 'title is-2',
	h3: 'title is-3',
	h4: 'title is-4',
	h5: 'title is-5',
	h6: 'title is-6'
}
const bindings = Object.keys(classMap).map(key => ({
	type: 'output',
	regex: new RegExp(`<${key}(.*)>`, 'g'),
	replace: `<${key} class="${classMap[key]}" $1>`
}));
let markdownConverter = new showdown.Converter({
	headerLevelStart: 3,
	extensions: [...bindings]
});

let GAME = false;
GAME = localStorage.getItem('acm_lyft_game_key');
if (!GAME) {
	GAME = vex.dialog.prompt({
		message: "Enter your game key:",
		callback: (gamekey) => {
			GAME = gamekey;
			init();
		}
	});
} else {
	init();
}

let PAGE = '';
let USER_ID = false;
let USER = {};
let IS_ADMIN = false;
let SHOW_FINAL_SCORES = false;

const PINK = `#EA38B9`;
const PURPLE = `#422E6E`;

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
const COLORS = `#e6194b-#3cb44b-#ffe119-#0082c8-#f58231-#911eb4-#46f0f0-#f032e6-#d2f53c-#fabebe-#008080-#e6beff-#aa6e28-#fffac8-#800000-#aaffc3-#808000-#ffd8b1-#000080-#808080-#000000`.split(`-`).map((hex) => `${hex}`);//.reverse();

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
					revenue: [],
					trips: [],
					zones: []
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
					let zoneMap = step.zones || {};
					for (let zid in zoneMap) {
						let zc = parseFloat(zoneMap[zid].cost + '');
						zoneMap[zid].cost = zc;
					}
					map[teamid].zones.push(zoneMap);
				}
			}
		});
	}
	for (let teamid in info) {
		if (!(teamid in map)) {
			let teamInfo = info[teamid];
				teamInfo.teamid = teamid;
			map[teamid] = {
				info: teamInfo,
				revenue: [],
				trips: [],
				zones: []
			}
		}
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
	let totalLoss = data.zones.reduce((sum, map) => {
		let loss = 0;
		for (let zid in map) {
			let cost = map[zid].cost;
			loss += cost;
		}
		return sum + loss;
	}, 0);
	return {
		revenue: totalRev,
		trips: totalTrips,
		loss: totalLoss,
		net: totalRev - totalLoss
	}
}

function mainResults(time, map, showFinal) {
	let datasets = [];
	let i = 0;
	for (let teamid in map) {
		let line = [];
		let total = 0;
		map[teamid].revenue.forEach((step, idx) => {
			total += step.lyft;
			if (showFinal) {
				for (let zid in map[teamid].zones[idx]) {
					let losses = map[teamid].zones[idx][zid].cost;
					total -= losses;
				}
			}
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
				// https://github.com/chartjs/Chart.js/issues/4212
				labels: {
					boxWidth: 40,
					padding: 10,
					generateLabels: function(chart) {
						var data = chart.data;
						return data.datasets.map((dataset, j) => {
							return {
								text: dataset.label,
								fillStyle: COLORS[j],
								hidden: !chart.isDatasetVisible(j),
								lineCap: dataset.borderCapStyle,
								lineDash: dataset.borderDash,
								lineDashOffset: dataset.borderDashOffset,
								lineJoin: dataset.borderJoinStyle,
								lineWidth: dataset.borderWidth,
								strokeStyle: dataset.borderColor,
								pointStyle: dataset.pointStyle,
								// Below is extra data used for toggling the datasets
								datasetIndex: j
							}
						});
					}
				}
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

function getTeamRankList(map, useFinalRanking) {
	let list = [];
	for (let teamid in map) {
		let score = getTeamScore(map[teamid]);
		list.push({
			info: map[teamid].info,
			score: score
		});
	}
	let sorted = list.map((t) => {
		if (useFinalRanking) {
			t.finalScore = t.score.net;
		} else {
			t.finalScore = t.score.revenue;
		}
		return t;
	}).sort((a, b) => {
		return b.finalScore - a.finalScore;
	});
	let rank = 0;
	let score = Infinity;
	sorted.forEach((team) => {
		if (team.finalScore < score) {
			score = team.finalScore;
			rank++;
		}
		team.rank = rank;
	});
	return sorted;
}

function mainLeaderboard(time, map) {
	let list = getTeamRankList(map, SHOW_FINAL_SCORES);
	let view = views.getLeaderboard({
		list: list,
		showFinal: SHOW_FINAL_SCORES
	});
	document.getElementById('leaderboard').innerHTML = '';
	document.getElementById('leaderboard').appendChild(view);
}

function inviteTeammate(teammateEmail, teamid) {
	return new Promise((resolve, reject) => {
		if (teammateEmail) {
			if (teammateEmail.indexOf('@') > -1) {
				let emailid = removeSpecialChars(teammateEmail);
				console.log(`Invite ${emailid} to ${teamid}`);
				if (emailid && teamid) {
					db.ref(`lyft/assignments/${GAME}/${emailid}`).set({
						teamid: teamid,
						email: teammateEmail
					}).then((done) => {
						resolve({
							success: true,
							email: teammateEmail
						});
					}).catch((err) => {
						console.error(err);
						reject(err);
					});
				} else {
					reject('Please enter a valid email address.');
				}
			} else {
				reject('Please enter a valid email address.');
			}
		} else {
			reject('Please enter a valid email address.');
		}
	});
}

function mainTeam(teamid, team) {

	console.log('in here', teamid, team)

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

		let teamInviteField = document.getElementById('teammate-email');
		let teamInviteButton = document.getElementById('invite-teammate');
		
		teamInviteButton.addEventListener('click', (e) => {
			teamInviteButton.classList.add('is-loading');
			inviteTeammate(teamInviteField.value, teamid).then((done) => {
				vex.dialog.alert(`Invited ${teamInviteField.value} to ${team.info.name}.`);
				teamInviteButton.classList.remove('is-loading');
				mainTeam(teamid, team);
			}).catch((error) => {
				console.error(error);
				vex.dialog.alert(error + '');
				teamInviteButton.classList.remove('is-loading');
			});
		});

		db.ref(`lyft/assignments/${GAME}`).orderByChild('teamid').equalTo(teamid).once('value', (snap) => {
			let nodes = snap.val() || {};
			let ul = document.getElementById('teammates-list');
			ul.innerHTML = '';
			if (Object.keys(nodes).length > 0) {
				for (let nid in nodes) {
					ul.innerHTML += `<li>${nodes[nid].email}</li>`
				}
			} else {
					ul.innerHTML += `<li>No teammates yet.</li>`
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

		pricingHolder.innerHTML = '';
		zonesHolder.innerHTML = '';
		db.ref(`lyft/teams/${GAME}/${teamid}`).on('value', (snap) => {
			db.ref(`lyft/learnings/${GAME}/${teamid}`).on('value', (learnSnap) => {
				let learnVal = learnSnap.val() || {};
				let val = snap.val() || {};
				pricingHolder.innerHTML = '';
				zonesHolder.innerHTML = '';

				if (!val.pricing) {
					val.pricing = {};
				}

				if (!val.zones) {
					val.zones = {};
				}

				let learnPricing = learnVal.pricing || {};
				for (let tkey in learnPricing) {
					if (tkey in val.pricing) {
						val.pricing[tkey].note = learnPricing[tkey].note;
					}
				}

				let learnZones = learnVal.zones || {};
				for (let tkey in learnZones) {
					if (tkey in val.zones) {
						val.zones[tkey].note = learnZones[tkey].note;
					}
				}

				let pView = views.getPricingCards(val);
				pricingHolder.appendChild(pView);

				val.community = COMMUNITY_AREAS;
				let zView = views.getZonesCards(val);
				zonesHolder.appendChild(zView);

				Array.from(pricingHolder.querySelectorAll('.button[data-tkey]')).forEach((btn) => {
					btn.addEventListener('click', (e) => {
						let tkey = btn.dataset.tkey;
						let form = pricingHolder.querySelector(`.textarea[data-tkey="${tkey}"]`);
						console.log(teamid, tkey, form.value);
						if (form.value) {
							btn.classList.add('is-loading');
							db.ref(`lyft/learnings/${GAME}/${teamid}/pricing/${tkey}`).set({
								timestamp: Date.now(),
								note: form.value
							}).then((complete) => {
								btn.classList.remove('is-loading');
								vex.dialog.alert(`Reflection saved successfully!`);
							}).catch((err) => {
								vex.dialog.alert('Error: ' + err);
							});
						}
					});
				});

				Array.from(zonesHolder.querySelectorAll('.button[data-tkey]')).forEach((btn) => {
					btn.addEventListener('click', (e) => {
						let tkey = btn.dataset.tkey;
						let form = zonesHolder.querySelector(`.textarea[data-tkey="${tkey}"]`);
						console.log(teamid, tkey, form.value);
						if (form.value) {
							btn.classList.add('is-loading');
							db.ref(`lyft/learnings/${GAME}/${teamid}/zones/${tkey}`).set({
								timestamp: Date.now(),
								note: form.value
							}).then((complete) => {
								btn.classList.remove('is-loading');
								vex.dialog.alert(`Reflection saved successfully!`);
							}).catch((err) => {
								vex.dialog.alert('Error: ' + err);
							});
						}
					});
				});

			});
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
	let list = getTeamRankList(data.map, true);
	let teamTable = document.getElementById('all-teams-table');
	teamTable.innerHTML = '';
	let table = views.getLeaderboard({
		list: list,
		admin: true,
		showFinal: true
	});
	teamTable.appendChild(table);

	let addTeamButton = document.getElementById('admin-add-team');
	addTeamButton.addEventListener('click', (e) => {
		vex.dialog.prompt({
			message: 'Team Name',
			callback: (teamName) => {
				if (teamName) {
					db.ref(`lyft/info/${GAME}`).push({
						name: teamName
					}).then((done) => {
						window.location.reload();
					}).catch((error) => {
						console.error(error);
					});
				}
			}
		});
	});

	let addAdminButton = document.getElementById('admin-add-admin');
	addAdminButton.addEventListener('click', (e) => {
		vex.dialog.prompt({
			message: `Enter an email address:`,
			callback: (email) => {
				if (email) {
					let emailid = removeSpecialChars(email);
					if (email.indexOf('@') > -1 && emailid) {
						db.ref(`lyft/admin/${GAME}/${emailid}`).set({
							level: true,
							email: email
						}).then((done) => {
							vex.dialog.alert(`Invited ${email} as an admin.`);
						}).catch((err) => {
							vex.dialog.alert('Error: ' + err);
						});
					} else {
						vex.dialog.alert('Please enter a valid email address.');
					}
				}
			}
		});
	});

	let exportTeamsButton = document.getElementById('admin-export-teams');
	exportTeamsButton.addEventListener('click', (e) => {
		let data = getGameData() || {};
		let out = [];
		for (let tid in data.map) {
			out.push(tid)
		}
		vex.dialog.prompt({
			message: `Exported ${out.length} team secrets:`,
			value: out.join(','),
			callback: () => {}
		});
	});

	let toggleFinalButton = document.getElementById('admin-toggle-final');
	toggleFinalButton.addEventListener('click', (e) => {
		db.ref(`lyft/mode/${GAME}`).once('value', (gs) => {
			let val = gs.val() || {};
			let currMode = val.final || false;
			let newMode = !(currMode);
			db.ref(`lyft/mode/${GAME}/final`).set(newMode);
		});
	});

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
			let node = snap.val();
			if (node) {
				resolve(node.teamid);
			} else {
				resolve(false);
			}
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

let SHOW_TEAM_ID = false;

let routes = {

	'/': () => {
		console.log('docs')
		showPage('docs');
	},

	'/docs': () => {
		console.log('docs')
		showPage('docs');
	},

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
		SHOW_TEAM_ID = teamid;
		if (IS_ADMIN) {
			showTeam(teamid);
		}
		showPage('team');
	},

	'/delete/:teamid': (teamid) => {
		console.log(`delete/${teamid}`);
		if (IS_ADMIN) {
			vex.dialog.confirm({
				message: `Are you sure you want to delete {${teamid}}?`,
				callback: (yes) => {
					if (yes) {
						db.ref(`lyft/info/${GAME}/${teamid}`).remove();
						db.ref(`lyft/results/${GAME}/${teamid}`).remove();
						db.ref(`lyft/teams/${GAME}/${teamid}`).remove();
						db.ref(`lyft/assignments/${GAME}`).orderByChild('teamid').equalTo(teamid).once('value', (snap) => {
							let nodes = snap.val() || {};
							for (let nid in nodes) {
								db.ref(`lyft/assignments/${GAME}/${nid}`).remove();
							}
						});
					}
				}
			});
		} else {
			showPage('results');
		}
	},

	'/admin': () => {
		console.log('admin')
		showPage('admin');
	},

}

let router = Router(routes);
router.init();
showPage('loading');

Array.from(document.querySelectorAll('.signout')).forEach((btn) => {
	btn.addEventListener('click', (e) => {
		firebase.auth().signOut();
		localStorage.removeItem('acm_lyft_game_key');
	});
});

let gameData = {};

function getGameData() {
	return gameData;
}

function checkAdmin() {
	return new Promise((resolve, reject) => {
		let emailid = removeSpecialChars(USER.email);
		db.ref(`lyft/admin/${GAME}/${emailid}`).once('value', (snap) => {
			let val = snap.val();
			if (val) {
				IS_ADMIN = true;
				document.querySelector('[data-page="admin"]').classList.remove('is-hidden');
				resolve(true);
			} else {
				resolve(false);
			}
		}).catch(resolve);
	});
}

function main() {

	checkAdmin().then(() => {
		getResults(GAME, (res) => {
			getTeams(GAME, (teamInfo) => {
				let data = getTeamData(res, teamInfo);
				console.log(data);
				gameData = data;

				try {
					db.ref(`lyft/mode/${GAME}`).on('value', (gs) => {
						let mode = gs.val() || {};
						SHOW_FINAL_SCORES = mode.final || false;
						mainResults(data.time, data.map, SHOW_FINAL_SCORES);
						mainLeaderboard(data.time, data.map);
					});
				} catch (err) {
					vex.dialog.alert('Error: ' + err);
				}

				mainAdmin();
				if (!IS_ADMIN) {
					getTeamByEmail(USER.email).then((teamid) => {
						showTeam(teamid, data);
					});
				}
				if (SHOW_TEAM_ID) {
					showTeam(SHOW_TEAM_ID);
				}
				// console.log(`showPage(PAGE) = showPage(${PAGE})`);
				// showPage(PAGE);
				Array.from(document.querySelectorAll('.show-game-key')).forEach((span) => {
					span.innerText = GAME;
				});
				showPage('docs');
				// const DOCS_URL = 'https://raw.githubusercontent.com/acmillinoistech/lyftboard/master/api.md';
				const DOCS_URL = '/api.md';
				$.get(DOCS_URL).then((res) => {
					console.log('Got it.');
					let apiHTML = markdownConverter.makeHtml(res);
					document.querySelector('#api-docs').innerHTML = apiHTML;
				});
			});
		});
	});

	db.ref(`lyft/time/${GAME}/time`).on('value', (snap) => {
		let ts = snap.val();
		Array.from(document.querySelectorAll(".sim-time")).forEach((span) => {
			span.innerText = `Today is ${moment(ts).format('M/D/YYYY')} in simulation time.`;
		});
	});

}

function init() {

	if (GAME) {
		localStorage.setItem('acm_lyft_game_key', GAME);
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				USER_ID = user.uid;
				USER = user;
				db.ref(`lyft/admin/${GAME}`).once('value', (snap) => {
					let val = snap.val();
					if (val) {
						main();
					} else {
						vex.dialog.confirm({
							message: `Do you want to start a new game with the code {${GAME}}?`,
							callback: (yes) => {
								if (yes) {
									let emailid = removeSpecialChars(USER.email);
									db.ref(`lyft/admin/${GAME}/${emailid}`).set({
										level: true,
										email: USER.email
									}).then((done) => {
										window.location.reload();
									}).catch(console.error);
								} else {
									localStorage.removeItem('acm_lyft_game_key');
								}
							}
						});
					}
				});
			} else {
				login();
			}
		});
	} else {
		vex.dialog.alert('Please reload the page and enter a valid game key.');
	}

}
