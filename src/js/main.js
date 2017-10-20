let config = require('./config');
let FirebaseApp = firebase.initializeApp(config);
let db = FirebaseApp.database();

const PARAMS = getQueryParams(document.location.search);
const GAME = PARAMS.game;

const PINK = `#EA38B9`;
const PURPLE = `#422E6E`;

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

function onResults(gameid, callback) {
	db.ref(`lyft/results/${gameid}`).on('value', (snap) => {
		let val = snap.val() || {};
		callback(val);
	});
}

function getTeamData(res) {
	let inMap = res || {};
	let sims = Object.keys(inMap).map((key) => res[key]).sort((a, b) => {
		return a.start - b.start;
	});
	let time = [];
	let map = {};
	if (sims.length > 0) {
		let first = sims[0];
		for (let teamid in first.data) {
			if (!(teamid in map)) {
				map[teamid] = {
					info: {teamid: teamid},
					trips: [],
					revenue: []
				}
			}
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

function plotMain(time, map) {
	let datasets = [];
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
			label: teamid,
			borderColor: PINK,
			fill: false,
			cubicInterpolationMode: 'monotone',
			data: line
		});
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
				position: `bottom`,
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
			}
		}
	});
}

if (GAME) {
	onResults(GAME, (res) => {
		let data = getTeamData(res);
		console.log(data);
		plotMain(data.time, data.map);
	});
}
