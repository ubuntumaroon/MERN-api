/* eslint-disable no-restricted-globals */
/* global db print */
const numToInsernt = 200;

const owners = ['Ravan', 'Eddie', 'Pieta', 'Parvati', 'Victor'];
const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];
const titles = ['Fix bugs', 'Backend', 'Frontend', 'Database', 'Connection', 'Web issues'];

// const initialCount = db.issues.count();
const counter = db.counters.findOne({ _id: 'issues' });
const maxId = counter.current + 1;

for (let i = 0; i < numToInsernt; i += 1) {
  const randomCreatedDate = (new Date()) - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24;
  const randomDueDate = randomCreatedDate + Math.floor(Math.random() * 30) * 1000 * 60 * 60 * 24;
  const created = new Date(randomCreatedDate);
  const due = new Date(randomDueDate);
  const owner = owners[Math.floor(Math.random() * owners.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const title = `${titles[Math.floor(Math.random * titles.length)]}, ${i}`;
  const effort = Math.floor(Math.random() * 50);
  const id = maxId + i + 1;

  const issue = {
    id, title, created, due, owner, status, effort,
  };

  db.issues.insertOne(issue);
}

db.counters.update({ _id: 'issues' }, { $inc: { current: numToInsernt } });

print('Total issues: ', db.issues.count());
