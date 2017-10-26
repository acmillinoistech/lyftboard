!function t(e,n,a){function r(i,s){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!s&&c)return c(i,!0);if(o)return o(i,!0);var d=new Error("Cannot find module '"+i+"'");throw d.code="MODULE_NOT_FOUND",d}var l=n[i]={exports:{}};e[i][0].call(l.exports,function(t){var n=e[i][1][t];return r(n||t)},l,l.exports,t,e,n,a)}return n[i].exports}for(var o="function"==typeof require&&require,i=0;i<a.length;i++)r(a[i]);return r}({1:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.COMMUNITY_AREAS={1:"Rogers Park",2:"West Ridge",3:"Uptown",4:"Lincoln Square",5:"North Center",6:"Lake View",7:"Lincoln Park",8:"Near North Side",9:"Edison Park",10:"Norwood Park",11:"Jefferson Park",12:"Forest Glen",13:"North Park",14:"Albany Park",15:"Portage Park",16:"Irving Park",17:"Dunning",18:"Montclare",19:"Belmont Cragin",20:"Hermosa",21:"Avondale",22:"Logan Square",23:"Humboldt Park",24:"West Town",25:"Austin",26:"West Garfield Park",27:"East Garfield Park",28:"Near West Side",29:"North Lawndale",30:"South Lawndale",31:"Lower West Side",32:"Loop",33:"Near South Side",34:"Armour Square",35:"Douglas",36:"Oakland",37:"Fuller Park",38:"Grand Boulevard",39:"Kenwood",40:"Washington Park",41:"Hyde Park",42:"Woodlawn",43:"South Shore",44:"Chatham",45:"Avalon Park",46:"South Chicago",47:"Burnside",48:"Calumet Heights",49:"Roseland",50:"Pullman",51:"South Deering",52:"East Side",53:"West Pullman",54:"Riverdale",55:"Hegewisch",56:"Garfield Ridge",57:"Archer Heights",58:"Brighton Park",59:"Mckinley Park",60:"Bridgeport",61:"New City",62:"West Eldson",63:"Gage Park",64:"Clearing",65:"West Lawn",67:"West Englewood",68:"Englewood",69:"Greater Grand Crossing",70:"Ashburn",71:"Auburn Gresham",72:"Beverly",73:"Washington Heights",74:"Mount Greenwood",75:"Morgan Park",76:"O'Hare",77:"Edgewater"}},{}],2:[function(t,e,n){"use strict";e.exports={apiKey:"AIzaSyCGWEpvuy4sPR3n5xzwfATLzyMDvwE6tOY",authDomain:"illinois-tech-acm.firebaseapp.com",databaseURL:"https://illinois-tech-acm.firebaseio.com",projectId:"illinois-tech-acm",storageBucket:"illinois-tech-acm.appspot.com",messagingSenderId:"344533734310"}},{}],3:[function(t,e,n){"use strict";function a(t){return t.replace(/(?!\w|\s)./g,"").replace(/\s+/g," ").replace(/^(\s*)([\W\w]*)(\b\s*$)/g,"$2")}function r(t,e){Array.from(document.querySelectorAll(t)).forEach(function(t){t.innerText=e})}function o(t,e){M.ref("lyft/results/"+t).once("value",function(t){var n=t.val()||{};e(n)})}function i(t,e){M.ref("lyft/info/"+t).once("value",function(t){var n=t.val()||{};e(n)})}function s(t,e){var n=t||{},a=Object.keys(n).map(function(e){return t[e]}).sort(function(t,e){return t.start-e.start}),r=[],o={};if(a.length>0){var i=a[0],s=0;for(var c in i.data)c in o||(o[c]={info:{teamid:c,name:"Untitled Team "+A[s]+" ("+c+")"},trips:[],revenue:[]},c in e&&(o[c].info=e[c],o[c].info.teamid=c)),s++;a.forEach(function(t){r.push(t.start);for(var e in t.data)if(e in o){var n=t.data[e];o[e].trips.push(n.trips);var a=n.revenue,i={lyft:parseFloat(a.lyft),taxi:parseFloat(a.taxi)};o[e].revenue.push(i)}})}return{time:r,map:o}}function c(t){return{revenue:t.revenue.reduce(function(t,e){return t+e.lyft},0),trips:t.trips.reduce(function(t,e){return t+e.lyft},0)}}function d(t,e){var n=[],a=0;for(var r in e)!function(r){var o=[],i=0;e[r].revenue.forEach(function(e,n){i+=e.lyft,o.push({x:t[n],y:i})}),n.push({label:e[r].info.name,borderColor:I[a],fill:!1,cubicInterpolationMode:"monotone",data:o}),a++}(r);var o=document.getElementById("plot1").getContext("2d");new Chart(o,{type:"line",data:{datasets:n},options:{responsive:!1,maintainAspectRatio:!0,legend:{position:"right"},title:{display:!0,text:"Revenue over Time"},scales:{xAxes:[{display:!0,type:"linear",scaleLabel:{display:!0,labelString:"Time"},ticks:{callback:function(t){return moment(t).format("M/D")}}}],yAxes:[{display:!0,type:"linear",scaleLabel:{display:!0,labelString:"Revenue ($)"},ticks:{callback:function(t){return"$"+t.toFixed(0)}}}]},elements:{point:{radius:0}},multiTooltipTemplate:"<%%=datasetLabel%>: $<%%=value%>"}})}function l(t){var e=[];for(var n in t){var a=c(t[n]);e.push({info:t[n].info,score:a})}var r=e.sort(function(t,e){return e.score.revenue-t.score.revenue}),o=0,i=1/0;return r.forEach(function(t){t.score.revenue<i&&(i=t.score.revenue,o++),t.rank=o}),r}function u(t,e){var n=l(e),a=L.getLeaderboard({list:n});document.getElementById("leaderboard").appendChild(a)}function f(t,e){if(t&&e){var n=L.getTeamManagement();document.getElementById("team-management").innerHTML=n.innerHTML,document.getElementById("team-space").classList.remove("is-hidden"),document.getElementById("no-team-space").classList.add("is-hidden");var a=document.getElementById("team-secret"),o=document.getElementById("show-team-secret");a.value=t,o.addEventListener("click",function(t){"password"===a.type?(a.type="text",o.innerText="Hide",o.classList.remove("is-danger"),o.classList.add("is-success")):(a.type="password",o.innerText="Show",o.classList.remove("is-success"),o.classList.add("is-danger"))});var i=document.getElementById("team-name"),s=document.getElementById("update-team-name");i.value=e.info.name,r(".fill-team-name",e.info.name),s.addEventListener("click",function(e){M.ref("lyft/info/"+T+"/"+t+"/name").set(i.value).then(function(t){window.location.reload()}).catch(console.error)});var c=document.getElementById("holder-pricing"),d=document.getElementById("holder-zones");M.ref("lyft/teams/"+T+"/"+t).on("value",function(t){var e=t.val();if(e){if(e.pricing){c.innerHTML="";var n=L.getPricingCards(e);c.appendChild(n)}if(e.zones){d.innerHTML="",e.community=w.COMMUNITY_AREAS;var a=L.getZonesCards(e);d.appendChild(a)}}})}else console.error("Cannot access team: ",t,e)}function m(t,e){var n=e||y();n||console.error("No game data available");var a={revenue:[],trips:[],info:{name:"No Team"}};t?(console.log("Your team is: "+t),a=n.map[t]):console.log("You do not have a team."),f(t,a)}function v(){var t=l(y().map),e=document.getElementById("all-teams-table");e.innerHTML="";var n=L.getAdminTeamTable({list:t});e.appendChild(n)}function h(t){P="loading"===t?P:t;var e=document.querySelector("li[data-page].is-active");e&&e.classList.remove("is-active");var n=document.querySelector('li[data-page="'+t+'"]');n&&n.classList.add("is-active"),Array.from(document.querySelectorAll("section[data-page]")).forEach(function(t){t.classList.add("is-hidden")});var a=document.querySelector('section[data-page="'+t+'"]');a&&a.classList.remove("is-hidden")}function p(t){return new Promise(function(e,n){var r=a(t);M.ref("lyft/assignments/"+T+"/"+r).once("value",function(t){var n=t.val();e(n)}).catch(n)})}function g(){return new Promise(function(t,e){var n=new firebase.auth.GoogleAuthProvider;firebase.auth().signInWithRedirect(n).then(function(t){var e=t.user;console.log(e)}).catch(e)})}function y(){return N}function b(){o(T,function(t){i(T,function(e){var n=s(t,e);console.log(n),N=n,d(n.time,n.map),u(n.time,n.map),v(),p(x.email).then(function(t){m(t,n)}),h(P)})});var t=a(x.email);M.ref("lyft/admin/"+T+"/"+t).once("value",function(t){t.val()&&(C=!0,document.querySelector('[data-page="admin"]').classList.remove("is-hidden"))})}var k=t("./views"),w=t("./communityareas"),E=t("./config"),L=(0,k.Views)(),M=firebase.initializeApp(E).database(),T=(function(t){t=t.split("+").join(" ");for(var e,n={},a=/[?&]?([^=]+)=([^&]*)/g;e=a.exec(t);)n[decodeURIComponent(e[1])]=decodeURIComponent(e[2])}(document.location.search),"workshop"),P="",S=!1,x={},C=!1,A="abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""),I="#e6194b-#3cb44b-#ffe119-#0082c8-#f58231-#911eb4-#46f0f0-#f032e6-#d2f53c-#fabebe-#008080-#e6beff-#aa6e28-#fffac8-#800000-#aaffc3-#808000-#ffd8b1-#000080-#808080-#000000".split("-").map(function(t){return""+t}).reverse(),B={"/results":function(){console.log("results"),h("results")},"/leaderboard":function(){console.log("leaderboard"),h("leaderboard")},"/search":function(){console.log("search"),h("search")},"/team":function(){console.log("team"),h("team")},"/team/:teamid":function(t){console.log("team/"+t),C&&m(t),h("team")},"/admin":function(){console.log("admin"),h("admin")}};Router(B).init(),h("loading"),document.getElementById("signout").addEventListener("click",function(t){firebase.auth().signOut()});var N={};T?firebase.auth().onAuthStateChanged(function(t){t?(S=t.uid,x=t,b()):g()}):alert("Please reload and enter a valid game key.")},{"./communityareas":1,"./config":2,"./views":4}],4:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),Number.prototype.formatMoney=function(t,e,n){var a=this,t=isNaN(t=Math.abs(t))?2:t,e=void 0==e?".":e,n=void 0==n?",":n,r=a<0?"-":"",o=String(parseInt(a=Math.abs(Number(a)||0).toFixed(t))),i=(i=o.length)>3?i%3:0;return r+(i?o.substr(0,i)+n:"")+o.substr(i).replace(/(\d{3})(?=\d)/g,"$1"+n)+(t?e+Math.abs(a-o).toFixed(t).slice(2):"")};n.Views=function(){return{getLeaderboard:function(t){var e=t.list[0].score.revenue,n='\n\t\t\t\t<table class="is-fullwidth">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th>Rank</th>\n\t\t\t\t\t\t\t<th>Team</th>\n\t\t\t\t\t\t\t<th>Revenue</th>\n\t\t\t\t\t\t\t<th>Trips</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>\n\t\t\t';t.list.forEach(function(t){var a="background-color: rgba(152, 244, 66, "+(t.score.revenue/e*.5+.5).toFixed(3)+")",r="";1===t.rank&&(r='\n\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t<i class="icon fa fa-trophy"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t'),n+="\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><span>"+t.rank+"</span>"+r+"</td>\n\t\t\t\t\t\t\t<td>"+t.info.name+'</td>\n\t\t\t\t\t\t\t<td style="'+a+'">$'+t.score.revenue.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t<td>"+t.score.trips+"</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t"}),n+="\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t";var a=document.createElement("div");return a.innerHTML=n,a.classList.add("table-holder"),a},getPricingCards:function(t){var e="";Object.keys(t.pricing).map(function(e){return t.pricing[e]}).sort(function(t,e){return e.in_effect-t.in_effect}).forEach(function(t){e+='\n\t\t\t\t\t<div class="card">\n\t\t\t\t\t\t<header class="card-header">\n\t\t\t\t\t\t\t<p class="card-header-title">Week of '+moment(t.in_effect).format("M/D/YYYY")+'</p>\n\t\t\t\t\t\t</header>\n\t\t\t\t\t\t<div class="card-content">\n\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<th>Category</th>\n\t\t\t\t\t\t\t\t\t\t<th>Cost</th>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<td>Base</td>\n\t\t\t\t\t\t\t\t\t\t<td>$'+t.base.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<td>Pickup</td>\n\t\t\t\t\t\t\t\t\t\t<td>$"+t.pickup.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<td>Per Mile</td>\n\t\t\t\t\t\t\t\t\t\t<td>$"+t.per_mile.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<td>Per Minute</td>\n\t\t\t\t\t\t\t\t\t\t<td>$"+t.per_minute.formatMoney(2)+'</td>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\x3c!--<footer class="card-footer">\n\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Save</a>\n\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Edit</a>\n\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Delete</a>\n\t\t\t\t\t\t</footer>--\x3e\n\t\t\t\t\t</div>\n\t\t\t\t'});var n=document.createElement("div");return n.innerHTML=e,n},getZonesCards:function(t){var e="";Object.keys(t.zones).map(function(e){return t.zones[e]}).sort(function(t,e){return e.in_effect-t.in_effect}).forEach(function(n){e+='\n\t\t\t\t\t<div class="card">\n\t\t\t\t\t\t<header class="card-header">\n\t\t\t\t\t\t\t<p class="card-header-title">Week of '+moment(n.in_effect).format("M/D/YYYY")+'</p>\n\t\t\t\t\t\t</header>\n\t\t\t\t\t\t<div class="card-content">\n\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<th>Zone</th>\n\t\t\t\t\t\t\t\t\t\t<th>Community Area</th>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t\t\t<tbody>\n\t\t\t\t';for(var a in n)"in_effect"!==a&&(e+="\n\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t<td>Zone "+a+"</td>\n\t\t\t\t\t\t\t\t\t\t<td>"+t.community[a]+"</td>\n\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t");e+='\n\t\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\x3c!--<footer class="card-footer">\n\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Save</a>\n\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Edit</a>\n\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Delete</a>\n\t\t\t\t\t\t</footer>--\x3e\n\t\t\t\t\t</div>\n\t\t\t\t'});var n=document.createElement("div");return n.innerHTML=e,n},getAdminTeamTable:function(t){var e=t.list[0].score.revenue,n='\n\t\t\t\t<table class="is-fullwidth">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th>Rank</th>\n\t\t\t\t\t\t\t<th>Team</th>\n\t\t\t\t\t\t\t<th>Revenue</th>\n\t\t\t\t\t\t\t<th>Trips</th>\n\t\t\t\t\t\t\t<th>View</th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>\n\t\t\t';t.list.forEach(function(t){var a="background-color: rgba(152, 244, 66, "+(t.score.revenue/e*.5+.5).toFixed(3)+")",r="";1===t.rank&&(r='\n\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t<i class="icon fa fa-trophy"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t'),n+="\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<td><span>"+t.rank+"</span>"+r+"</td>\n\t\t\t\t\t\t\t<td>"+t.info.name+'</td>\n\t\t\t\t\t\t\t<td style="'+a+'">$'+t.score.revenue.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t<td>"+t.score.trips+'</td>\n\t\t\t\t\t\t\t<td><a href="/#/team/'+t.info.teamid+'" class="button is-primary is-outlined">View Team</a></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t'}),n+="\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t";var a=document.createElement("div");return a.innerHTML=n,a.classList.add("table-holder"),a},getTeamManagement:function(){var t=document.createElement("div");return t.innerHTML='\n\t\t\t\t<div class="columns">\n\t\t\t\t\t<div class="column is-6">\n\t\t\t\t\t\t<h4 class="title is-4">Team Name</h4>\n\t\t\t\t\t\t<div class="field has-addons">\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<input id="team-name" class="input" type="text">\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<button id="update-team-name" class="button is-success">Update</button>\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="column is-6">\n\t\t\t\t\t\t<h4 class="title is-4">Team Secret</h4>\n\t\t\t\t\t\t<div class="field has-addons">\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<input id="team-secret" class="input is-static" type="password" value="secrettext" readonly>\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<button id="show-team-secret" class="button is-danger">Show</button>\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t',t}}}},{}]},{},[3]);
//# sourceMappingURL=maps/main.js.map
