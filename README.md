3.06:
Pros of DBaaS
- initialising the database is easier and more cost effective as you don’t have to acquire any own equipment nor use work hours to put it all together
- DBaaS service takes care of maintaining the database, potentially saving a lot of money, as fewer database developers are needed
- DBaaS services often have uptime guarantees
- The hardware used by DBaaS is usually better than what smaller businesses can afford

Pros of DIY
- running your own servers means more control: you have direct access to the database and its configuration
- running your own servers can may lead to marginally better performance as a result of smaller latency

3.07:
I decided to use Postgres with PersistentVolumeClaims in my project as 1) I had it mostly set up already and 2) researching Google Cloud SQL seemed like too much of a hassle.