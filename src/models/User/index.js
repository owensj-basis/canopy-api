import BaseClass from '../BaseClass';
import ModelRouter from '../ModelRouter';

class User extends BaseClass {
  static modelName = 'user';
  static client = BaseClass.prisma.user;
  static {
    BaseClass.models[this.modelName] = User;
    User.initSchema();
  }
  static router = new ModelRouter(User, User.modelName);
  constructor(instance) {
    super(instance);
  }
  static autoPrefetchSingle = {"StaffProfile": true}
  static autoPrefetchList = {"StaffProfile": true}
}

export default User;