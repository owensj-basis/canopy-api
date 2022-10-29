import { Prisma, PrismaClient } from '@prisma/client';
import ModelRouter from './ModelRouter';

class BaseClass {
  static modelName: string;
  static client: any;
  static prisma = new PrismaClient();
  static models: { [key: string]: typeof BaseClass } = {};
  static router: ModelRouter;
  static aggregate: Function;
  static count: Function;
  static create: Function;
  static createMany: Function;
  static delete: Function;
  static deleteMany: Function;
  static findFirst: Function;
  static findMany: Function;
  static findUnique: Function;
  static groupBy: Function;
  static update: Function;
  static updateMany: Function;
  static upsert: Function; 
  static get schema() {
    return Prisma.dmmf.datamodel.models.find(model => model.name.toLowerCase() === this.modelName);
  }
  static initSchema() {
    if (this.client) {
      for (let func of Object.keys(this.client)) {
        Object.defineProperty(this, func, {
          value: async function (...args: any[]) {
            const ret = await this.client[func](...args);
            if (ret.constructor == Object) {
              return new this(ret);
            } else if (ret instanceof Array) {
              return ret.map(x => new this(x));
            }
          }
        });
      }
    }
  }

  static getModelFromString(modelName: string): typeof BaseClass {
    return BaseClass.models[modelName];
  }

  constructor(instance: any) {
    const proto: typeof BaseClass = Object.getPrototypeOf(this).constructor;
    for (let field of proto.schema?.fields || [] ) {
      if (instance[field.name] && 
          field.kind == 'object' &&
          Object.keys(instance[field.name]).length !== 0 
      ) {
        const modelClass = BaseClass.getModelFromString(field.type.toLowerCase());
        if(modelClass) {
          const obj = instance[field.name];
          if (field.isList) {
            instance[field.name] = obj.map((x: any) => new modelClass(x))
          } else {
            instance[field.name] = new modelClass(obj);
          }
        }
      }
    }
    
    Object.assign(this, instance);
  }

  toJSON() {
    const proto = Object.getPrototypeOf(this);
    const json: any = Object.assign({}, this);
    Object.entries(Object.getOwnPropertyDescriptors(proto))
      .filter(([key, descriptor]) => typeof descriptor.get === 'function')
      .map(([key, descriptor]) => {
        if (descriptor && key[0] !== '_') {
          try {
            const val = (this as any)[key];
            json[key] = val;
          } catch (error) {
            console.error(`Error calling getter ${key}`, error);
          }
        }
      });
    return json;
  }
}

export default BaseClass;
