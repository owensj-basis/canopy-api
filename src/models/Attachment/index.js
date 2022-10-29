import BaseClass from '../BaseClass';
import ModelRouter from '../ModelRouter';

class Attachment extends BaseClass {
  static modelName = 'attachment';
  static client = BaseClass.prisma.attachment;
  static {
    BaseClass.models[this.modelName] = Attachment;
    Attachment.initSchema();
  }
  static router = new ModelRouter(Attachment, Attachment.modelName);
  constructor(instance) {
    super(instance);
  }
  static autoPrefetchSingle = {Post: true}
  static autoPrefetchList = {Post: true}
}

export default Attachment;