import express from 'express';

// do not remove - required to initialize models
import * as models from './models';

const app = express();

app.use(express.json());

// here's how we add middleware to ALL routes
const testMiddlware = (req: any, res: any, next: Function) => {
  console.log('GLOBAL MIDDLEWARE');
  next();
};
app.use(testMiddlware);

app.get('/', async (req, res) => {
  res.status(200).send('OK');
});

for (const model of Object.values(models.BaseClass.models)) {
  app.use(`/api/${model.router.baseRoute}`, model.router.Router);
}

app.listen(3001, () =>
  console.log(
    `
🚀 Server ready at: http://localhost:3001
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`
  )
);

module.exports = app;
