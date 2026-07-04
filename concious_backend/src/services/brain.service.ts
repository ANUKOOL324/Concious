import { ContentModel, LinkModel, UserModel } from "../db.js";
import { random } from "../utils.js";

export async function toggleShareLink(userId: string, enable: boolean) {
  if (enable) {
    const existLink = await LinkModel.findOne({ userId });

    if (existLink) {
      return { hash: existLink.hash };
    }

    const hash = random(10);
    await LinkModel.create({ hash, userId });
    return { hash };
  }

  await LinkModel.deleteOne({ userId });
  return { message: "Removed link" };
}

export async function getSharedBrain(hash: string) {
  const link = await LinkModel.findOne({ hash });

  if (!link) {
    return { error: "it is not correct link !" };
  }

  const content = await ContentModel.find({ userId: link.userId });
  const user = await UserModel.findOne({ _id: link.userId });

  if (!user) {
    return { error: "user not found, rare error !" };
  }

  return { username: user.username, content };
}
