require("dotenv").config();
import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/user";
import { HelloResolver } from "./resolvers/hello";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import monggose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Context } from "./types/Context";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "fsNta",
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  });

  const app = express();

  // Session cookie
  const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@fsnta.ljhcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  await monggose.connect(mongoUrl, {});
  console.log("MongoDB Connected");
  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({ mongoUrl }),
      cookie: {
        maxAge: 1000 * 60 * 60, // 1h
        httpOnly: true, // JS frontEnd cannot access cookie
        secure: __prod__, // cookie only works in https
        sameSite: "lax", // protection against CSRF
        // domain:
      },
      secret: process.env.SESSION_SECRET_DEV_PROD as string,
      saveUninitialized: false, // don't save empty sessions, right from the start
      resave: false,
    })
  );

  // Connect apolloServer
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  // Start server
  const PORT = process.env.PORT || 4040;
  app.listen(PORT, () =>
    console.log(
      `Server started on port ${PORT}. GrapQL server started on localhost:${PORT}${apolloServer.graphqlPath}`
    )
  );
};

main().catch((error) => console.log("system error: ", error));
