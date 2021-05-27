'use strict';

import { config } from 'dotenv';
config();

import Express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';

import mongo from 'mongodb';
const { MongoClient } = mongo;

if (!("MONGO_URL" in process.env) || !("SESSION_SECRET" in process.env)) {
  throw new Error("Environment variables not defined");
}
const client = new MongoClient(process.env.MONGO_URL as string, {
  useUnifiedTopology: true,
});

import { initializePassport } from './passport-config.js';

initializePassport(
  passport,
  async function (neededEmail: string) {
    const user = new Promise((resolve) => {
      users.findOne({ email: neededEmail }, (error: Error, data: number) => {
        if (error) {
          console.log('Error on server');
        }
        resolve(data);
      })
    });
    return user;
  },
  (neededId: string) => {
    const user = new Promise((resolve) => {
      users.findOne({ _id: neededId }, (error: Error, data: number) => {
        if (error) {
          console.log('Error on server');
        }
        resolve(data);
      })
    });
    return user;
  }
);

let users: mongo.Collection<any>;
let templateBaseData: mongo.Collection<any>;

const start = async () => {
  try {
    await client.connect();
    //client.db().createCollection('users');
    //client.db().createCollection('template-base-data');
    users = client.db().collection('users');
    templateBaseData = client.db().collection('template-base-data');


    app.listen(process.env.PORT ?? 3000, () => console.log('open localhost:3000 in browser to use app'));

  } catch (error) {
    console.log('error below');
    console.log(error)
  }
};

start();

const app = Express();


app.use(Express.static('build'));
app.set('view-engine', 'ejs');
app.set('views', 'build/views');
app.use(Express.urlencoded({ extended: false}));
app.use(Express.json());
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// // Проверяет, авторизован ли пользователь
function checkAuthenticated(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
  if (request.isAuthenticated()) {
    return next()
  }
  response.redirect('/login');
};

// // Проверяет, авторизован ли пользователь
function checkNotAuthenticated(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
  if (request.isAuthenticated()) {
    return response.redirect('/');
  }
  return next()
};


//ЛОГИН, РЕГИСТРАЦИЯ И ЛОГАУТ

app.get('/login', checkNotAuthenticated, (_request: Express.Request, response: Express.Response) => {
  response.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/login',
  failureFlash: true
}));

// // **********

// // НАВИГАЦИЯ

app.get('/register', checkNotAuthenticated, (_request: Express.Request, response: Express.Response) => {
  response.render('register.ejs');
});

app.post('/register', async (request: Express.Request, response: Express.Response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    initUser(request.body.email, hashedPassword);
    response.redirect('/login');
  } catch {
    response.redirect('/register');
  }
});

app.delete('/logout', (request: Express.Request, response: Express.Response) => {
  request.logout();
  response.redirect('/login');
});

app.get('/', checkAuthenticated, (_request: Express.Request, response: Express.Response) => {
  response.render('index.ejs');
});


app.get('/index', checkAuthenticated, (_request: Express.Request, response: Express.Response) => {
  response.redirect('/');
});


app.post('/design-add-new', async (_request: Express.Request, response: Express.Response) => {
  const allTemplates = await templateBaseData.find({}).toArray();
  response.json(allTemplates);
  response.end();
});

app.get('/design-add-new', checkAuthenticated, (_request: Express.Request, response: Express.Response) => {
  response.render('design-add-new.ejs');
});


app.get('/design-catalog', checkAuthenticated, (_request: Express.Request, response: Express.Response) => {
  response.render('design-catalog.ejs');
});

app.post('/design-catalog', async (request: Express.Request, response: Express.Response) => {
  const userTemplates = await users.findOne(
    { email: request.body.email }
  );
  response.json(userTemplates);
  response.end();
});

app.post('/design-catalog-remove', (request: Express.Request, _response: Express.Response) => {
  users.updateOne(
    { email: request.body.email },
    { $pull: { 'templates': { 'id': request.body.templateID }}}
  );
});


app.get('/design-editor', checkAuthenticated, (_request: Express.Request, response: Express.Response) => {
  response.render('design-editor.ejs');
});

app.post('/design-editor-new', (request: Express.Request, _response: Express.Response) => {
  users.updateOne(
    { email: request.body.email },
    { $push: { 'templates': request.body.template }}
  );
});


app.post('/design-editor-old', (request: Express.Request, _response: Express.Response) => {
  users.updateOne(
    { email: request.body.email },
    { $set: { 'templates.$[elem]': request.body.template } },
    { 'arrayFilters': [ {'elem.id': { '$eq': request.body.template.id }} ]}
  );
});


app.get('/smm-catalog', checkAuthenticated, (_request: Express.Request, response: Express.Response) => {
  response.render('smm-catalog.ejs');
});



app.get('/smm-editor', checkAuthenticated, (_request: Express.Request, response: Express.Response) => {
  response.render('smm-editor.ejs');
});


// **********


// БАЗА ДАННЫХ, ПОЛЬЗОВАТЕЛИ

// Создаёт документ нового пользователя (при логине)
const initUser = (newEmail: string, newPassword: string) => {
  users.insertOne({
    email: newEmail,
    password: newPassword,
    templates: []
  });
};
