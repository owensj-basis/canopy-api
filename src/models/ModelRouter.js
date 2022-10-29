import express from 'express';
import { toJSON } from '../utils';
import { getQuery, DefaultMiddleware } from '../views/middleware';

class ModelRouter {
  constructor(model, baseRoute) {
    this.Model = model;
    this.Router = express.Router();
    this.baseRoute = baseRoute;

    this.DefaultMiddleware = [this.addModelToReq.bind(this), ...DefaultMiddleware];

    this.initRoutes();
  }

  async addModelToReq(req, res, next) {
    req.Model = this.Model;
    next();
  }

  initRoutes(middlewareFunctions = []) {
    const middleware = [...this.DefaultMiddleware, ...middlewareFunctions];
    this.Router.get(
      '/:id?',
      [...this.DefaultMiddleware, getQuery, ...middlewareFunctions],
      this.get.bind(this)
    );
    this.Router.patch('/:id', ...middleware, this.update.bind(this));
    this.Router.post('/', ...middleware, this.create.bind(this));
    this.Router.delete('/', ...middleware, this.delete.bind(this));
  }

  async get(req, res) {
    const { id } = req.params;

    if (id) {
      const found = await this.Model.findUnique({
        where: { id: Number(id) },
        include: req.Include
      });
      return res.json(toJSON(found));
    }

    const found = await this.Model.findMany(req.Query);
    res.json(toJSON(found));
  }

  async update(req, res) {
    const instance = await req.Model.update({ where: { id: Number(id) }, data: req.body });
    res.json(toJSON(instance));
  }
  async create(req, res) {
    const instance = await req.Model.create({data: req.body});
    res.json(toJSON(instance));
  }
  async delete(req, res) {}
}

export default ModelRouter;
