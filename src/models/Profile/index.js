import BaseClass from '../BaseClass';
import ModelRouter from '../ModelRouter';

class Profile extends BaseClass {
  static modelName = 'profile';
  static client = BaseClass.prisma.profile;
  static {
    BaseClass.models[this.modelName] = Profile;
    Profile.initSchema();
  }
  static router = new ModelRouter(Profile, Profile.modelName);
  constructor(instance) {
    super(instance);
  }
  static autoPrefetchSingle = {"StaffProfile": true}
  static autoPrefetchList = {"StaffProfile": true}
}

export default Profile;