if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const Datastore = require('nedb');
const bcrypt = require('bcrypt');
const passport = require('passport');
const showError = require('express-flash');
const session = require('express-session');
const logout = require('method-override');
const initializePassport = require('./passport-config');
const path = require('path');

const templateBaseData = new Datastore('template-base-data.db');
const users = new Datastore('users.db');

templateBaseData.loadDatabase();
users.loadDatabase();
initializePassport(
  passport,
  async function (neededEmail) {
    const user = new Promise((resolve, reject) => {
      users.findOne({ email: neededEmail }, (error, data) => {
        if (error) {
          console.log('Error on server');
        }
        resolve(data);
      })
    });
    return user;
  },
  neededId => {
    const user = new Promise((resolve, reject) => {
      users.findOne({ _id: neededId }, (error, data) => {
        if (error) {
          console.log('Error on server');
        }
        resolve(data);
      })
    });
    return user;
  }
);

const app = express();

app.listen(3000, () => console.log('open localhost:3000 in browser to use app'));
app.use(express.static('build'));
app.set('view-engine', 'ejs');
app.set('views', 'build/views');
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(showError());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logout('_method'));

// Проверяет, авторизован ли пользователь
function checkAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return next()
  }
  response.redirect('/login');
};

// Проверяет, авторизован ли пользователь
function checkNotAuthenticated(request, response, next) {
  if (request.isAuthenticated()) {
    return response.redirect('/');
  }
  return next()
};


//ЛОГИН, РЕГИСТРАЦИЯ И ЛОГАУТ

app.get('/login', (request, response) => {
  response.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/login',
  failureFlash: true
}));

// **********

// НАВИГАЦИЯ

app.get('/register', (request, response) => {
  response.render('register.ejs');
});

app.post('/register', async (request, response) => {
  console.log(request.body.password);
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    createUser(request.body.email, hashedPassword);
    response.redirect('/login');
  } catch {
    response.redirect('/register');
  }
});

app.delete('/logout', (request, response) => {
  request.logout();
  response.redirect('/login');
});



app.get('/', (request, response) => {
  response.render('index.ejs');
});



app.get('/index', (request, response) => {
  response.redirect('/');
});



app.get('/design-catalog', (request, response) => {
  response.render('design-catalog.ejs');
});

app.post('/design-add-new', (request, response) => {
  templateBaseData.find({}, function (error, docs) {
    if (error) {
      console.log('No such data');
      response.end();
      return;
    }
    response.json(docs);
    response.end();
  });
});



app.get('/design-add-new', (request, response) => {
  response.render('design-add-new.ejs');
});

app.post('/design-catalog', (request, response) => {
  users.findOne({ email: request.body.email }, function (error, docs) {
    if (error) {
      console.log('No such data');
      response.end();
      return;
    }
    response.json(docs);
    response.end();
  });
});



app.get('/design-editor', (request, response) => {
  response.render('design-editor.ejs');
});

app.post('/design-editor-new', (request, response) => {
  users.update({ email: request.body.email }, { $push: { 'templates': request.body.template}},
    {}, function(err, numReplaced) {
      users.persistence.compactDatafile();
  });
});

app.post('/design-editor-old', (request, response) => {
  users.update({ email: request.body.email }, { $push: { 'templates': request.body.template}},
    {}, function(err, numReplaced) {
      users.persistence.compactDatafile();
  });
});



app.get('/smm-catalog', (request, response) => {
  response.render('smm-catalog.ejs');
});



app.get('/smm-editor', (request, response) => {
  response.render('smm-editor.ejs');
});


// **********


// БАЗА ДАННЫХ, ПОЛЬЗОВАТЕЛИ

// Создаёт документ нового пользователя (при логине)
const createUser = (newEmail, newPassword) => {
  users.insert({
    email: newEmail,
    password: newPassword,
    templates: []
  });
};

const addNewTemplate = (emailName, template) => {
  console.log('try');
  users.update({ email: emailName }, { $push: { 'templates': template}},
    {}, (error, numReplaced) => {
      if(error) {
        console.log('Error on server');
      }
    users.persistence.compactDatafile();
  });
};

// templateBaseData.insert({
//   id: 'YouTube',
//   data: []
// });

// addNewTemplate('login@login',
//   {
//     id: '14325499801276',
//     social: 'Instagram',
//     type: 'Post',
//     name: 'First try',
//     width: 1080,
//     height: 1080,
//     ratio: '1x1',
//     background: '#aaddaa',
//     layers: 1
//   }
// );
// Изменяет личные данные пользователя (пока что имя, адрес)
// const changeUserPersonal = function (data, emailName, fieldName) {
//   const fullFieldName = 'personalData.' + fieldName;
//   users.update({ email: emailName }, { $set: { [fullFieldName] : data
//     }}, {}, function(error, numReplaced) {
//     users.persistence.compactDatafile();
//   });
// };

// // Добавляет заказ в список активных заказов (вызывается при отправке текущего заказа)
// const addActiveOrder = function (data, emailName) {
//   usersList.update({ email: emailName }, { $push: { 'activeOrders': data}},
//     {}, function(error, numReplaced) {
//     users.persistence.compactDatafile();
//   });
// };

// // Переводит самый старый активный заказ из активных в старые (вызывается, когда активный заказ завершается)
// const moveOrderToOld = function (emailName) {
//   usersList.findOne({ email: emailName }, (error, data) => {
//     const orderToMove = (data.activeOrders[0]);
//     users.update({ email: emailName }, { $push: { 'oldOrders': orderToMove }}, {}, function(){});
//   });
//   usersList.findOne({ email: emailName }, (error, data) => {
//     usersList.update({ email: emailName }, { $pop: { 'activeOrders': -1 }}, {}, function(){
//       users.persistence.compactDatafile();
//     });
//   });
// };

// **********



// СТАРОЕ

// ЗАГРУЗКА ДАННЫХ НА СЕРВЕР

// Отправляет текущий заказ
// app.post('/purchase', (request, response) => {
//   addActiveOrder(request.body.order, request.body.email);
// });

// Отправляет новое имя
// app.post('/name', (request, response) => {
//   changeUserPersonal(request.body.name, request.body.email, 'name');
// });

// Отправляет новый адрес
// app.post('/addres', (request, response) => {
//   changeUserPersonal(request.body.addres, req.body.email, 'addres');
// });

// ВЫГРУЗКА ДАННЫХ С СЕРВЕРА

// Возвращает документ пользователя с соответствующим email'ом
// app.post('/personal', (request, response) => {
//   usersList.findOne({ email: request.body.email }, (error, data) => {
//     if (error) {
//       console.log('nothing here!');
//       response.end();
//       return;
//     }
//     response.json(data);
//     response.end();
//   });
// });

// Возвращает документ всех товаров каталога
// app.post('/items', (request, response) => {
//   itemsList.find({}, (error, data) => {
//     if (error) {
//       console.log('nothing here!');
//       response.end();
//       return;
//     }
//     response.json(data);
//     response.end();
//   });
// });

// **********
