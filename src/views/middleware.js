import { keyBy, merge } from 'lodash';
import { BaseClass } from '../models';

const getPrefetchQuery = (prefetch, model) => {
  const fields = model.schema.fields;
  let query = {};
  query = Object.assign(query, prefetch);
  for(const [key, value] of Object.entries(prefetch)){
    if(key === "*"){
      for(const field of fields){
        if(field.kind === "object" && !query[field.name]){
          const newModel = BaseClass.getModelFromString(field.type.toLowerCase());
          if(newModel){
            query[field.name] = true;
          }
        }
      }
      delete(query["*"]);
    }
    if(value?.include) {
      const field = fields.find(f => f.name === key);
      if (field){
        const newModel = BaseClass.getModelFromString(field.type.toLowerCase());
        if (newModel){
          query[key].include = getPrefetchQuery(query[key].include, newModel);
          // temporary fix for many to many fields and properties
          if(Object.keys(query[key].include).length === 0){
            query[key] = true;
          } 
        } else {
          // temporary fix for many to many fields and properties
          delete(query[key]);
        }
      } else {
        // temporary fix for many to many fields and properties
        delete(query[key]);
      }
    }
  }
  return query;
}

// Must run after getModelFromReq
export const getQuery = async (req, res, nextFunc) => {
  let { query, include, page, page_size, orderby, exclude, filters } = req.query;
  if (query) {
    req.Query = JSON.parse(query);
    nextFunc();
  }
  if (include) {
    try {
      const includeObj = JSON.parse(include);
      include = includeObj;
    } catch (e) {
      const includeList = include.split(',');
      include = {};
      for (const item of includeList) {
        const [first, ...others] = item.split('__');
        if (others.length) {
          let last = {},
            next,
            relation;
          include[first] = last;
          for (relation of others) {
            next = {};
            last.include = {};
            last.include[relation] = next;
            const t = last;
            last = next;
            next = t;
          }
          next.include[relation] = true;
        } else {
          include[first] = true;
        }
      }
    }
  } else {
    let prefetch = (req.params.id ? req.Model.autoPrefetchSingle : req.Model.autoPrefetchList) || undefined;
    if (prefetch) {
      prefetch = getPrefetchQuery(prefetch, req.Model);
    }
    include = prefetch;
      
  }
  if (orderby) {
    try {
      const orderbyObj = JSON.parse(include);
      orderby = orderbyObj;
    } catch (e) {
      const orderbyList = orderby.split(',');
      orderby = [];
      for (const item of orderbyList) {
        let [first, ...others] = item.split('__');
        let prev = {};
        let prevRelation = first;
        let order = 'desc';
        if (first[0] == '-') {
          first = first.substring(1);
          order = 'asc';
        }
        orderby.push(prev);
        for (const relation of others) {
          let curr = {};
          prev[prevRelation] = curr;
          prev = curr;
          prevRelation = relation;
        }
        prev[prevRelation] = order;
      }
    }
  } else {
    orderby = req.Model.defaultOrderBy || undefined;
  }
  req.Query = {
    include,
    orderBy: req.params.id ? orderby : undefined
  };
  if(filters) {
    try {
      const filterObj = JSON.parse(filters);
      Object.assign(req.Query, filterObj);
      req.Filters = filterObj;
    }
    catch(e){
      return res.status(400).send(`Cannot parse filters: ${e.message}`);
    }
  }
  req.Include = include;
  req.orderBy = req.Query.orderBy;
  //   console.log(include);
  nextFunc();
};

export const parseUpdateFromBody = async (req, res, nextFunc) => {
  
}

export const DefaultMiddleware = [];
