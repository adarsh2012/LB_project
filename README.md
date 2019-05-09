# LB_project
Our load balancer.

When cloned/downloaded, run the following commond:
```
node balancer.js
```
Change <serverIP> and <server2IP> in balancer.js to your server's IP address (For example: http://0.0.0.0:2000)
```
const servers = ['<serverIP>','<server2IP>'];
```
If you have a SSL certificate, then replace the keys/ folder with your .key and .cert 
