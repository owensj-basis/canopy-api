import BaseClass from '../BaseClass';
import ModelRouter from '../ModelRouter';

class Post extends BaseClass {
  static modelName = 'post';
  static client = BaseClass.prisma.post;
  static {
    BaseClass.models[this.modelName] = Post;
    Post.initSchema();
  }
  static router = new ModelRouter(Post, Post.modelName);
  constructor(instance) {
    super(instance);
  }
  static autoPrefetchSingle = {Author: true, Attachments: true }
  static autoPrefetchList = {Author: true, Attachments: true }
}

export default Post;