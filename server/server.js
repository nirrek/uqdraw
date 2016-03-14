import express from 'express';
import graphqlHTTP from 'express-graphql';
import cors from 'cors';
import schema from './schemas/uqdrawSchema.js';
import path from 'path';
import { graphql } from 'graphql';
import database from './database/database.js';

const port = 8080;
const databaseFilename = path.join(__dirname, '.sqlite3');
database.initialize(databaseFilename);

const graphQLServer = express();

// Middleware
graphQLServer.use(cors());
graphQLServer.use('/', graphqlHTTP({ schema , graphiql: true }));

graphQLServer.listen(port, () => {
  console.log(`GraphQL server listening at http://localhost:${port}`);
});
