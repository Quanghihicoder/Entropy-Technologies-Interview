## Live Demo: http://3.104.186.235:8001

### I am using AWS EC2 instances, please test ASAP. Uptime: 8AM-9PM every day until Sunday 10 Mar 2024.

## Youtube Demo: https://youtu.be/LoshLYWeUk4

### If EC2 is off, please check the YouTube demo.

# Installation:

1. Pull the code.
2. MANUALLY create a database in POSTGRES (e.g., pgAdmin 4). Database name: entropy
3. Run the initialization SQL script in ./backend/init_script/initTable.sql.
4. Perform the npm install command in the backend.
5. Change the db config to your setting. Make sure you do the correct configuration.
6. In the backend it is already a build folder. Just "npm start" the backend. Then open localhost:8001/
7. You may want to run React. new frontend terminal then "npm start" open localhost:3000/
8. Enjoy!

Note:

+) The weather API is fixed, the location is Sydney

+) The news API has a 1 request/s limit. So can not be quick.

+) No handle for SQL injection.

+) No test case
