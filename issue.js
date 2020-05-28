const { UserInputError } = require('apollo-server-express');

const { getDb, getNextSequence } = require('./db.js');

async function list(_, { status, effortMin, effortMax }) {
  const db = getDb();
  const filter = {};
  if (status) filter.status = status;
  if (effortMin !== undefined || effortMax !== undefined) {
    filter.effort = {};
    if (effortMin !== undefined) filter.effort.$gte = effortMin;
    if (effortMax !== undefined) filter.effort.$lte = effortMax;
  }
  const issues = await db.collection('issues').find(filter).toArray();
  return issues;
}

async function get(_, { id }) {
  const db = getDb();
  const issue = await db.collection('issues').findOne({ id });
  return issue;
}

function validate(issue) {
  const errors = [];
  if (issue.title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }
  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "Owner" is required when status is "Assigned".');
  }

  if (errors.length > 0) {
    throw new UserInputError('Invalid inputs', { errors });
  }
}

async function add(_, { issue }) {
  const db = getDb();
  validate(issue);
  const newIssue = { ...issue };
  newIssue.created = new Date();
  newIssue.id = await getNextSequence('issues') + 1;

  const result = await db.collection('issues').insertOne(newIssue);
  const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });
  return savedIssue;
}

module.exports = { list, add, get };
