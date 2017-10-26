!function t(e,n,a){function r(i,s){if(!n[i]){if(!e[i]){var l="function"==typeof require&&require;if(!s&&l)return l(i,!0);if(o)return o(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var d=n[i]={exports:{}};e[i][0].call(d.exports,function(t){var n=e[i][1][t];return r(n||t)},d,d.exports,t,e,n,a)}return n[i].exports}for(var o="function"==typeof require&&require,i=0;i<a.length;i++)r(a[i]);return r}({1:[function(t,e,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});n.COMMUNITY_AREAS={1:"Rogers Park",2:"West Ridge",3:"Uptown",4:"Lincoln Square",5:"North Center",6:"Lake View",7:"Lincoln Park",8:"Near North Side",9:"Edison Park",10:"Norwood Park",11:"Jefferson Park",12:"Forest Glen",13:"North Park",14:"Albany Park",15:"Portage Park",16:"Irving Park",17:"Dunning",18:"Montclare",19:"Belmont Cragin",20:"Hermosa",21:"Avondale",22:"Logan Square",23:"Humboldt Park",24:"West Town",25:"Austin",26:"West Garfield Park",27:"East Garfield Park",28:"Near West Side",29:"North Lawndale",30:"South Lawndale",31:"Lower West Side",32:"Loop",33:"Near South Side",34:"Armour Square",35:"Douglas",36:"Oakland",37:"Fuller Park",38:"Grand Boulevard",39:"Kenwood",40:"Washington Park",41:"Hyde Park",42:"Woodlawn",43:"South Shore",44:"Chatham",45:"Avalon Park",46:"South Chicago",47:"Burnside",48:"Calumet Heights",49:"Roseland",50:"Pullman",51:"South Deering",52:"East Side",53:"West Pullman",54:"Riverdale",55:"Hegewisch",56:"Garfield Ridge",57:"Archer Heights",58:"Brighton Park",59:"Mckinley Park",60:"Bridgeport",61:"New City",62:"West Eldson",63:"Gage Park",64:"Clearing",65:"West Lawn",67:"West Englewood",68:"Englewood",69:"Greater Grand Crossing",70:"Ashburn",71:"Auburn Gresham",72:"Beverly",73:"Washington Heights",74:"Mount Greenwood",75:"Morgan Park",76:"O'Hare",77:"Edgewater"}},{}],2:[function(t,e,n){"use strict";e.exports={apiKey:"AIzaSyCGWEpvuy4sPR3n5xzwfATLzyMDvwE6tOY",authDomain:"illinois-tech-acm.firebaseapp.com",databaseURL:"https://illinois-tech-acm.firebaseio.com",projectId:"illinois-tech-acm",storageBucket:"illinois-tech-acm.appspot.com",messagingSenderId:"344533734310"}},{}],3:[function(t,e,n){"use strict";function a(t){return t.replace(/(?!\w|\s)./g,"").replace(/\s+/g," ").replace(/^(\s*)([\W\w]*)(\b\s*$)/g,"$2")}function r(t,e){Array.from(document.querySelectorAll(t)).forEach(function(t){t.innerText=e})}function o(t,e){T.ref("lyft/results/"+t).once("value",function(t){var n=t.val()||{};e(n)})}function i(t,e){T.ref("lyft/info/"+t).once("value",function(t){var n=t.val()||{};e(n)})}function s(t,e){var n=t||{},a=Object.keys(n).map(function(e){return t[e]}).sort(function(t,e){return t.start-e.start}),r=[],o={};if(a.length>0){var i=a[0],s=0;for(var l in i.data)l in o||(o[l]={info:{teamid:l,name:"Untitled Team "+N[s]+" ("+l+")"},revenue:[],trips:[],zones:[]},l in e&&(o[l].info=e[l],o[l].info.teamid=l)),s++;a.forEach(function(t){r.push(t.start);for(var e in t.data)if(e in o){var n=t.data[e];o[e].trips.push(n.trips);var a=n.revenue,i={lyft:parseFloat(a.lyft),taxi:parseFloat(a.taxi)};o[e].revenue.push(i);var s=n.zones||{};for(var l in s){var c=parseFloat(s[l].cost+"");s[l].cost=c}o[e].zones.push(s)}})}for(var c in e)if(!(c in o)){var d=e[c];d.teamid=c,o[c]={info:d,revenue:[],trips:[],zones:[]}}return{time:r,map:o}}function l(t){var e=t.revenue.reduce(function(t,e){return t+e.lyft},0),n=t.trips.reduce(function(t,e){return t+e.lyft},0),a=t.zones.reduce(function(t,e){var n=0;for(var a in e)n+=e[a].cost;return t+n},0);return{revenue:e,trips:n,loss:a,net:e-a}}function c(t,e){var n=[],a=0;for(var r in e)!function(r){var o=[],i=0;e[r].revenue.forEach(function(e,n){i+=e.lyft,o.push({x:t[n],y:i})}),n.push({label:e[r].info.name,borderColor:q[a],fill:!1,cubicInterpolationMode:"monotone",data:o}),a++}(r);var o=document.getElementById("plot1").getContext("2d");new Chart(o,{type:"line",data:{datasets:n},options:{responsive:!1,maintainAspectRatio:!0,legend:{position:"right",labels:{boxWidth:40,padding:10,generateLabels:function(t){return t.data.datasets.map(function(e,n){return{text:e.label,fillStyle:q[n],hidden:!t.isDatasetVisible(n),lineCap:e.borderCapStyle,lineDash:e.borderDash,lineDashOffset:e.borderDashOffset,lineJoin:e.borderJoinStyle,lineWidth:e.borderWidth,strokeStyle:e.borderColor,pointStyle:e.pointStyle,datasetIndex:n}})}}},title:{display:!0,text:"Revenue over Time"},scales:{xAxes:[{display:!0,type:"linear",scaleLabel:{display:!0,labelString:"Time"},ticks:{callback:function(t){return moment(t).format("M/D")}}}],yAxes:[{display:!0,type:"linear",scaleLabel:{display:!0,labelString:"Revenue ($)"},ticks:{callback:function(t){return"$"+t.toFixed(0)}}}]},elements:{point:{radius:0}},multiTooltipTemplate:"<%%=datasetLabel%>: $<%%=value%>"}})}function d(t,e){var n=[];for(var a in t){var r=l(t[a]);n.push({info:t[a].info,score:r})}var o=n.map(function(t){return t.finalScore=e?t.score.net:t.score.revenue,t}).sort(function(t,e){return e.finalScore-t.finalScore}),i=0,s=1/0;return o.forEach(function(t){t.finalScore<s&&(s=t.finalScore,i++),t.rank=i}),o}function u(t,e){var n=d(e,_),a=M.getLeaderboard({list:n,showFinal:_});document.getElementById("leaderboard").appendChild(a)}function f(t,e){return new Promise(function(n,r){if(t)if(t.indexOf("@")>-1){var o=a(t);console.log("Invite "+o+" to "+e),o&&e?T.ref("lyft/assignments/"+P+"/"+o).set({teamid:e,email:t}).then(function(e){n({success:!0,email:t})}).catch(function(t){console.error(t),r(t)}):r("Please enter a valid email address.")}else r("Please enter a valid email address.");else r("Please enter a valid email address.")})}function m(t,e){if(console.log("in here",t,e),t&&e){var n=M.getTeamManagement();document.getElementById("team-management").innerHTML=n.innerHTML,document.getElementById("team-space").classList.remove("is-hidden"),document.getElementById("no-team-space").classList.add("is-hidden");var a=document.getElementById("team-secret"),o=document.getElementById("show-team-secret");a.value=t,o.addEventListener("click",function(t){"password"===a.type?(a.type="text",o.innerText="Hide",o.classList.remove("is-danger"),o.classList.add("is-success")):(a.type="password",o.innerText="Show",o.classList.remove("is-success"),o.classList.add("is-danger"))});var i=document.getElementById("teammate-email"),s=document.getElementById("invite-teammate");s.addEventListener("click",function(n){s.classList.add("is-loading"),f(i.value,t).then(function(n){vex.dialog.alert("Invited "+i.value+" to "+e.info.name+"."),s.classList.remove("is-loading"),m(t,e)}).catch(function(t){console.error(t),vex.dialog.alert(t+""),s.classList.remove("is-loading")})}),T.ref("lyft/assignments/"+P).orderByChild("teamid").equalTo(t).once("value",function(t){var e=t.val()||{},n=document.getElementById("teammates-list");if(n.innerHTML="",Object.keys(e).length>0)for(var a in e)n.innerHTML+="<li>"+e[a].email+"</li>";else n.innerHTML+="<li>No teammates yet.</li>"});var l=document.getElementById("team-name"),c=document.getElementById("update-team-name");l.value=e.info.name,r(".fill-team-name",e.info.name),c.addEventListener("click",function(e){T.ref("lyft/info/"+P+"/"+t+"/name").set(l.value).then(function(t){window.location.reload()}).catch(console.error)});var d=document.getElementById("holder-pricing"),u=document.getElementById("holder-zones");d.innerHTML="",u.innerHTML="",T.ref("lyft/teams/"+P+"/"+t).on("value",function(e){T.ref("lyft/learnings/"+P+"/"+t).on("value",function(n){var a=n.val()||{},r=e.val()||{};d.innerHTML="",u.innerHTML="",r.pricing||(r.pricing={}),r.zones||(r.zones={});var o=a.pricing||{};for(var i in o)i in r.pricing&&(r.pricing[i].note=o[i].note);var s=a.zones||{};for(var l in s)l in r.zones&&(r.zones[l].note=s[l].note);var c=M.getPricingCards(r);d.appendChild(c),r.community=w.COMMUNITY_AREAS;var f=M.getZonesCards(r);u.appendChild(f),Array.from(d.querySelectorAll(".button[data-tkey]")).forEach(function(e){e.addEventListener("click",function(n){var a=e.dataset.tkey,r=d.querySelector('.textarea[data-tkey="'+a+'"]');console.log(t,a,r.value),r.value&&(e.classList.add("is-loading"),T.ref("lyft/learnings/"+P+"/"+t+"/pricing/"+a).set({timestamp:Date.now(),note:r.value}).then(function(t){e.classList.remove("is-loading"),vex.dialog.alert("Reflection saved successfully!")}).catch(function(t){vex.dialog.alert("Error: "+t)}))})}),Array.from(u.querySelectorAll(".button[data-tkey]")).forEach(function(e){e.addEventListener("click",function(n){var a=e.dataset.tkey,r=u.querySelector('.textarea[data-tkey="'+a+'"]');console.log(t,a,r.value),r.value&&(e.classList.add("is-loading"),T.ref("lyft/learnings/"+P+"/"+t+"/zones/"+a).set({timestamp:Date.now(),note:r.value}).then(function(t){e.classList.remove("is-loading"),vex.dialog.alert("Reflection saved successfully!")}).catch(function(t){vex.dialog.alert("Error: "+t)}))})})})})}else console.error("Cannot access team: ",t,e)}function v(t,e){var n=e||b();n||console.error("No game data available");var a={revenue:[],trips:[],info:{name:"No Team"}};t?(console.log("Your team is: "+t),a=n.map[t]):console.log("You do not have a team."),m(t,a)}function h(){var t=d(b().map,!0),e=document.getElementById("all-teams-table");e.innerHTML="";var n=M.getLeaderboard({list:t,admin:!0,showFinal:!0});e.appendChild(n),document.getElementById("admin-add-team").addEventListener("click",function(t){vex.dialog.prompt({message:"Team Name",callback:function(t){t&&T.ref("lyft/info/"+P).push({name:t}).then(function(t){window.location.reload()}).catch(function(t){console.error(t)})}})}),document.getElementById("admin-add-admin").addEventListener("click",function(t){vex.dialog.prompt({message:"Enter an email address:",callback:function(t){if(t){var e=a(t);t.indexOf("@")>-1&&e?T.ref("lyft/admin/"+P+"/"+e).set({level:!0,email:t}).then(function(e){vex.dialog.alert("Invited "+t+" as an admin.")}).catch(function(t){vex.dialog.alert("Error: "+t)}):vex.dialog.alert("Please enter a valid email address.")}}})}),document.getElementById("admin-export-teams").addEventListener("click",function(t){var e=b()||{},n=[];for(var a in e.map)n.push(a);vex.dialog.prompt({message:"Exported "+n.length+" team secrets:",value:n.join(","),callback:function(){}})})}function p(t){I="loading"===t?I:t;var e=document.querySelector("li[data-page].is-active");e&&e.classList.remove("is-active");var n=document.querySelector('li[data-page="'+t+'"]');n&&n.classList.add("is-active"),Array.from(document.querySelectorAll("section[data-page]")).forEach(function(t){t.classList.add("is-hidden")});var a=document.querySelector('section[data-page="'+t+'"]');a&&a.classList.remove("is-hidden")}function g(t){return new Promise(function(e,n){var r=a(t);T.ref("lyft/assignments/"+P+"/"+r).once("value",function(t){var n=t.val();e(n?n.teamid:!1)}).catch(n)})}function y(){return new Promise(function(t,e){var n=new firebase.auth.GoogleAuthProvider;firebase.auth().signInWithRedirect(n).then(function(t){var e=t.user;console.log(e)}).catch(e)})}function b(){return z}function k(){return new Promise(function(t,e){var n=a(A.email);T.ref("lyft/admin/"+P+"/"+n).once("value",function(e){e.val()?(B=!0,document.querySelector('[data-page="admin"]').classList.remove("is-hidden"),t(!0)):t(!1)}).catch(t)})}function x(){k().then(function(){o(P,function(t){i(P,function(e){var n=s(t,e);console.log(n),z=n,c(n.time,n.map),u(n.time,n.map),h(),B||g(A.email).then(function(t){v(t,n)}),D&&v(D),p(I)})})}),T.ref("lyft/time/"+P+"/time").on("value",function(t){var e=t.val();document.getElementById("sim-time").innerText="Today is "+moment(e).format("M/D/YYYY")+" in simulation time."})}function E(){P?(localStorage.setItem("acm_lyft_game_key",P),firebase.auth().onAuthStateChanged(function(t){t?(C=t.uid,A=t,T.ref("lyft/admin/"+P).once("value",function(t){t.val()?x():vex.dialog.confirm({message:"Do you want to start a new game with the code {"+P+"}?",callback:function(t){if(t){var e=a(A.email);T.ref("lyft/admin/"+P+"/"+e).set({level:!0,email:A.email}).then(function(t){window.location.reload()}).catch(console.error)}else localStorage.removeItem("acm_lyft_game_key")}})})):y()})):vex.dialog.alert("Please reload the page and enter a valid game key.")}var L=t("./views"),w=t("./communityareas"),S=t("./config"),M=(0,L.Views)(),T=firebase.initializeApp(S).database(),P=!1;(P=localStorage.getItem("acm_lyft_game_key"))?E():P=vex.dialog.prompt({message:"Enter your game key:",callback:function(t){P=t,E()}});var I="",C=!1,A={},B=!1,_=!1,N="abcdefghijklmnopqrstuvwxyz".toUpperCase().split(""),q="#e6194b-#3cb44b-#ffe119-#0082c8-#f58231-#911eb4-#46f0f0-#f032e6-#d2f53c-#fabebe-#008080-#e6beff-#aa6e28-#fffac8-#800000-#aaffc3-#808000-#ffd8b1-#000080-#808080-#000000".split("-").map(function(t){return""+t}),D=!1,H={"/":function(){console.log("landing"),p("results")},"/results":function(){console.log("results"),p("results")},"/leaderboard":function(){console.log("leaderboard"),p("leaderboard")},"/search":function(){console.log("search"),p("search")},"/team":function(){console.log("team"),p("team")},"/team/:teamid":function(t){console.log("team/"+t),D=t,B&&v(t),p("team")},"/delete/:teamid":function(t){console.log("delete/"+t),B?vex.dialog.confirm({message:"Are you sure you want to delete {"+t+"}?",callback:function(e){e&&(T.ref("lyft/info/"+P+"/"+t).remove(),T.ref("lyft/results/"+P+"/"+t).remove(),T.ref("lyft/teams/"+P+"/"+t).remove(),T.ref("lyft/assignments/"+P).orderByChild("teamid").equalTo(t).once("value",function(t){var e=t.val()||{};for(var n in e)T.ref("lyft/assignments/"+P+"/"+n).remove()}))}}):p("results")},"/admin":function(){console.log("admin"),p("admin")}};Router(H).init(),p("loading"),Array.from(document.querySelectorAll(".signout")).forEach(function(t){t.addEventListener("click",function(t){firebase.auth().signOut(),localStorage.removeItem("acm_lyft_game_key")})});var z={}},{"./communityareas":1,"./config":2,"./views":4}],4:[function(t,e,n){"use strict";function a(t){return"background-color: rgba(35, 209, 96, "+(.95*t+.05).toFixed(3)+")"}Object.defineProperty(n,"__esModule",{value:!0}),Number.prototype.formatMoney=function(t,e,n){var a=this,t=isNaN(t=Math.abs(t))?2:t,e=void 0==e?".":e,n=void 0==n?",":n,r=a<0?"-":"",o=String(parseInt(a=Math.abs(Number(a)||0).toFixed(t))),i=(i=o.length)>3?i%3:0;return r+(i?o.substr(0,i)+n:"")+o.substr(i).replace(/(\d{3})(?=\d)/g,"$1"+n)+(t?e+Math.abs(a-o).toFixed(t).slice(2):"")};n.Views=function(){return{getPricingCards:function(t){var e="",n=Object.keys(t.pricing).map(function(e){var n=t.pricing[e];return n.tkey=e,n}).sort(function(t,e){return e.in_effect-t.in_effect});n.length>0?n.forEach(function(t){e+='\n\t\t\t\t\t\t<div class="card">\n\t\t\t\t\t\t\t<div class="card-content">\n\t\t\t\t\t\t\t\t<h5 class="title is-5">Week of '+moment(t.in_effect).format("M/D/YYYY")+"</h5>\n\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t<th>Category</th>\n\t\t\t\t\t\t\t\t\t\t\t<th>Cost</th>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t<td>Base</td>\n\t\t\t\t\t\t\t\t\t\t\t<td>$"+t.base.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t<td>Pickup</td>\n\t\t\t\t\t\t\t\t\t\t\t<td>$"+t.pickup.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t<td>Per Mile</td>\n\t\t\t\t\t\t\t\t\t\t\t<td>$"+t.per_mile.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t<td>Per Minute</td>\n\t\t\t\t\t\t\t\t\t\t\t<td>$"+t.per_minute.formatMoney(2)+'</td>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t<h5 class="title is-5">Reflection</h5>\n\t\t\t\t\t\t\t',t.note?e+='\n\t\t\t\t\t\t\t\t\t<textarea class="textarea" data-tkey="'+t.tkey+'">'+t.note+"</textarea>\n\t\t\t\t\t\t\t\t":e+='\n\t\t\t\t\t\t\t\t\t<textarea class="textarea" data-tkey="'+t.tkey+'" placeholder="Why did you choose these prices?"></textarea>\n\t\t\t\t\t\t\t\t',e+='\n\t\t\t\t\t\t\t\t<button data-tkey="'+t.tkey+'" class="button is-primary">Save</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\x3c!--<footer class="card-footer">\n\t\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Save</a>\n\t\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Edit</a>\n\t\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Delete</a>\n\t\t\t\t\t\t\t</footer>--\x3e\n\t\t\t\t\t\t</div>\n\t\t\t\t\t'}):e+='\n\t\t\t\t\t<div class="notification is-primary">\n\t\t\t\t\t\t<h2 class="title is-3">No trip costs set.</h2>\n\t\t\t\t\t\t<p class="subtitle is-6">Make a POST request to the /pricing endpoint.</p>\n\t\t\t\t\t</div>\n\t\t\t\t';var a=document.createElement("div");return a.innerHTML=e,a},getZonesCards:function(t){var e="",n=Object.keys(t.zones).map(function(e){var n=t.zones[e];return n.tkey=e,n}).sort(function(t,e){return e.in_effect-t.in_effect});n.length>0?n.forEach(function(n){e+='\n\t\t\t\t\t\t<div class="card">\n\t\t\t\t\t\t\t<header class="card-header">\n\t\t\t\t\t\t\t\t<p class="card-header-title">Week of '+moment(n.in_effect).format("M/D/YYYY")+'</p>\n\t\t\t\t\t\t\t</header>\n\t\t\t\t\t\t\t<div class="card-content">\n\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t<th>Zone</th>\n\t\t\t\t\t\t\t\t\t\t\t<th>Community Area</th>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t';for(var a in n)"in_effect"!==a&&"tkey"!==a&&"note"!==a&&(e+="\n\t\t\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t\t\t\t<td>Zone "+a+"</td>\n\t\t\t\t\t\t\t\t\t\t\t<td>"+t.community[a]+"</td>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t");e+='\n\t\t\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t<h5 class="title is-5">Reflection</h5>\n\t\t\t\t\t\t\t',n.note?e+='\n\t\t\t\t\t\t\t\t\t<textarea class="textarea" data-tkey="'+n.tkey+'">'+n.note+"</textarea>\n\t\t\t\t\t\t\t\t":e+='\n\t\t\t\t\t\t\t\t\t<textarea class="textarea" data-tkey="'+n.tkey+'" placeholder="Why did you choose these zones?"></textarea>\n\t\t\t\t\t\t\t\t',e+='\n\t\t\t\t\t\t\t\t<button data-tkey="'+n.tkey+'" class="button is-primary">Save</button>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\x3c!--<footer class="card-footer">\n\t\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Save</a>\n\t\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Edit</a>\n\t\t\t\t\t\t\t\t<a href="#" class="card-footer-item">Delete</a>\n\t\t\t\t\t\t\t</footer>--\x3e\n\t\t\t\t\t\t</div>\n\t\t\t\t\t'}):e+='\n\t\t\t\t\t<div class="notification is-primary">\n\t\t\t\t\t\t<h2 class="title is-3">No power zones set.</h2>\n\t\t\t\t\t\t<p class="subtitle is-6">Make a POST request to the /zones endpoint.</p>\n\t\t\t\t\t</div>\n\t\t\t\t';var a=document.createElement("div");return a.innerHTML=e,a},getLeaderboard:function(t){var e="";if(t.list.length>0){var n=t.list[0].score.revenue,r=t.list[0].score.net;e+='\n\t\t\t\t\t<table class="is-fullwidth">\n\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th>Rank</th>\n\t\t\t\t\t\t\t\t<th>Team</th>\n\t\t\t\t\t\t\t\t<th>Net Revenue</th>\n\t\t\t\t\t\t\t\t<th>Gross Revenue</th>\n\t\t\t\t\t\t\t\t<th>Trips</th>\n\t\t\t\t',t.admin&&(e+="\n\t\t\t\t\t\t\t\t<th>View</th>\n\t\t\t\t\t\t\t\t<th>Delete</th>\n\t\t\t\t\t\t\t"),e+="\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody>\n\t\t\t\t",t.list.forEach(function(o){var i=o.score.revenue/n,s=o.score.net/r,l="";1===o.rank&&(l='\n\t\t\t\t\t\t\t<span class="icon">\n\t\t\t\t\t\t\t\t<i class="icon fa fa-trophy"></i>\n\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t'),e+="\n\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td><span>"+o.rank+"</span>"+l+"</td>\n\t\t\t\t\t\t\t\t<td>"+o.info.name+"</td>\n\t\t\t\t\t",t.showFinal?e+='\n\t\t\t\t\t\t\t\t<td style="'+a(s)+'">$'+o.score.net.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t":e+="\n\t\t\t\t\t\t\t\t<td>???</td>\n\t\t\t\t\t\t\t",e+='\n\t\t\t\t\t\t\t\t<td style="'+a(i)+'">$'+o.score.revenue.formatMoney(2)+"</td>\n\t\t\t\t\t\t\t\t<td>"+o.score.trips+"</td>\n\t\t\t\t\t",t.admin&&(e+='\n\t\t\t\t\t\t\t\t<td><a href="./#/team/'+o.info.teamid+'" class="button is-primary is-outlined">View</a></td>\n\t\t\t\t\t\t\t\t<td><a href="./#/delete/'+o.info.teamid+'" class="button is-danger is-outlined">Delete</a></td>\n\t\t\t\t\t\t\t'),e+="\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t"}),e+="\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t"}else e+="\n\t\t\t\t\t<p>There are no teams in this game yet.</p>\n\t\t\t\t";var o=document.createElement("div");return o.innerHTML=e,o.classList.add("table-holder"),o},getTeamManagement:function(){var t=document.createElement("div");return t.innerHTML='\n\t\t\t\t<div class="columns">\n\t\t\t\t\t<div class="column is-6">\n\t\t\t\t\t\t<h4 class="title is-4">Team Name</h4>\n\t\t\t\t\t\t<div class="field has-addons">\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<input id="team-name" class="input" type="text">\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<button id="update-team-name" class="button is-success">Update</button>\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<h4 class="title is-4">Team Secret</h4>\n\t\t\t\t\t\t<div class="field has-addons">\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<input id="team-secret" class="input is-static" type="password" value="secrettext" readonly>\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<button id="show-team-secret" class="button is-danger">Show</button>\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="column is-6">\n\t\t\t\t\t\t<h4 class="title is-4">Invite Teammate</h4>\n\t\t\t\t\t\t<div class="field has-addons">\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<input id="teammate-email" class="input" type="text">\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t\t<p class="control">\n\t\t\t\t\t\t\t\t<button id="invite-teammate" class="button is-success">Invite</button>\n\t\t\t\t\t\t\t</p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<h4 class="title is-4">Current Teammates</h4>\n\t\t\t\t\t\t<ul id="teammates-list"></ul>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t',t}}}},{}]},{},[3]);
//# sourceMappingURL=maps/main.js.map
