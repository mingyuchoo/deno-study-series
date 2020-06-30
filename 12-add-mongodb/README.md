# MongoDB 설치, 접속, 그리고 참고 내용

## Reference

- <https://github.com/slim-hmidi/deno-employees-api>
- <https://medium.com/javascript-in-plain-english/deno-oak-mongo-3d29542333fd>
- <https://www.freecodecamp.org/news/the-deno-handbook/#will-it-replace-node-js>
- <https://websiteforstudents.com/how-to-install-mongodb-on-ubuntu-20-04-18-04/>
- <https://docs.mongodb.com/manual/reference/connection-string/>

## Initial Setting

### Step 1: Add MongoDB Package repository to Ubuntu

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
```

### Step 2: Install MongoDB on Ubuntu 18.04

```bash
sudo apt update

sudo apt install mongodb-org
```

### Step 3: Manage MongoDB

```bash
sudo systemctl stop mongod.service

sudo systemctl start mongod.service

sudo systemctl enable mongod.service
```

### Step 4: Adding Admin User

```bash
$ mongo

> use admin
> db.createUser({user:"admin", pwd:"<new_password_here>", roles:[{role:"root", db:"admin"}]})
```

### Step 5: Edit MongoDB config file

```bash
sudo vi /lib/systemd/system/mongod.service
```

add **--auth** flag to ExecStart

```bash
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target
Documentation=https://docs.mongodb.org/manual

[Service]
User=mongodb
Group=mongodb
ExecStart=/usr/bin/mongod --auth --config /etc/mongod.conf
PIDFile=/var/run/mongodb/mongod.pid
# file size
```

```bash
sudo systemctl daemon-reload

sudo service mongod restart
```

### Step 6: Edit Default MongoDB configuration file

```bash
sudo vi /etc/mongod.conf
```

change to **enabled** of authorization

```bash
security:
  authorization: enabled
```

```bash
sudo service mongod restart
```

login as *admin* user

```bash
mongo -u admin -p <new_password_here> --authenticationDatabase admin
```

```bash

```

## Connect MongoDB using deno

### Step1: Add application user

```bash
$ mongo

> use admin
> db.createUser({user:"test", pwd:"<new_password_here>", roles:[{role:"readWrite", db:"test_db"}, {role:"read", db:"reporting"}]})
```

### Step2: Example of db.ts for deno

```typescript
// importing the deno_mongo package from url
import { MongoClient } from "https://deno.land/x/mongo@v0.8.0/mod.ts";

// Create client
const client = new MongoClient();
// Connect to mongodb
client.connectWithUri("mongodb://test:<new_password_here>@localhost:27017/?authSource=test_db");

// Specifying the database name
const dbname: string = "test_db";
const db = client.database(dbname);

// Declare the collections here. Here we are using only one collection (i.e friends).
const Friend = db.collection("friends");

export {db, Friend};
```
