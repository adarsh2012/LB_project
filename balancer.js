// some part of this code is from https://thecodebarbarian.com/building-your-own-load-balancer-with-express-js 
// useing express frame work 
const express = require('express'); 
const request = require('request'); 
const cookie = require('cookie-parser'); 
const server = express(); 
server.use(cookie()); 


const servers = ['<serverIP>', '<server2IP>'];//['http://localhost:8080', 'http://localhost:8081'];////, 'http://localhost:8082']; 
//const index = ['http://10.66.5.148:3000/', 'http://10.66.5.148:3001/']; 
const active = [1,1]; 
const last_check = [Date.now(),Date.now()]; 

console.log("hi"); 
let cur = 0; 
let sl = servers.length; 

const check = setInterval(function () { 
console.log("check"); 
var D = Date.now(); 
var e; 
for (e in last_check) { 
var t = D - last_check[e]; 
console.log("D", D); 
console.log("last_check[e]", last_check[e]); 
console.log("e", e); 
console.log("t", t); 
if (t > 3000) { 
active[e] = 0; 
console.log("CHECK2"); 
//insert inform logic 
//not very good logic but OK for now 
//might need to ask server first or use least resent used 
const alert = request.post(servers[e + 1], function (res) { 
json: { 
down: servers[cur]; 
} 
}) 
//console.log("down"); 
//console.log(c); 
} else { 
active[e] = 1; 
} 
//c = c + 1; 
} 
}, 4000); 



const handler = (req, res) => { 
// Pipe the vanilla node HTTP request (a readable stream) into `request` 
// to the next server URL. Then, since `res` implements the writable stream 
// interface, you can just `pipe()` into `res`. 
// stuff elegent shut down some where 
//res.cookie("server_no.", cur); 

//req.pipe(request({ url: servers[cur] + req.url })).pipe(res); 
//cur = (cur + 1) % sl; 
var server_no = req.cookies['server_no']; 
console.log("*******active[server_no]", active[server_no]); 
console.log("active list",active); 
console.log(server_no); 
if (!(server_no)) { 
console.log("no cookie"); 
res.cookie("server_no", cur); 
server_no = cur; 

cur = (cur + 1) % sl; 
} 
if (active[server_no] != 1) { 
console.log("------------------------"); 
console.log("active[server_no]", active[server_no]); 
console.log("inactive", server_no); 
console.log("sl", sl); 
if (server_no == (sl - 1)) { 
server_no = 0; 
} else { 
server_no = (server_no + 1) % sl; 
} 
console.log("new server no", server_no); 
//res.clearCookie("server_no"); 
res.cookie("server_no", server_no); 

console.log("------------------------"); 

} 
//res.send("update cookie"); //update cookie 
console.log("use server no",server_no); 
const _req = request({ url: servers[server_no] + req.url }).on('error', error => { 
res.status(500).send(error.message); 
}); 
req.pipe(_req).pipe(res); 
//cur = (cur + 1) % sl; 
}; 



const health = (req, res) => { 
console.log('POST') 
var origin = req.header('origin') 
console.log(origin); 
if (servers.includes(origin)) { 
index = servers.indexOf(origin); 
last_check[index] = Date.now(); 
console.log('update') 
} 
}; 




const down = (req, res) => { 
var origin = req.get('origin'); 
if (servers.includes(origin)) { 
index = servers.indexOf(origin); 
active[index] = 0; 
} 
}; 

const up = (req, res) => { 
var host = req.get('host'); 
if (servers.includes(host)) { 
index = servers.indexOf(host); 
active[index] = 1; 
last_check[index] = Date.now(); 
} 
}; 

const reg_server = (req, res) => { 
var origin = req.header('origin'); 
servers.push(origin); 
sl = sl + 1; 
active.push(1); 
last_check.push(Date.now); 
}; 

//server.post('/health', health); 
server.post('/down', down); 
server.post('/up', up); 
server.post('/reg_server', reg_server) 
server.get('*', handler).post('*', handler); 

server.listen(8000);
