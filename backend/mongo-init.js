db.createUser({
  user: "admin",
  pwd: "example",
  roles: [
    {
      role: "readWrite",
      db: "test",
    },
  ],
});

db.auth('admin', 'example')
db = db.getSiblingDB('test2')

db.createUser({
  user: "admin2",
  pwd: "example",
  roles: [
    {
      role: "readWrite",
      db: "test2",
    },
  ],
});
