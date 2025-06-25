import { Type } from "@sinclair/typebox";

export const PostSchema = Type.Object({
  title: Type.String(),
  content: Type.String(),
});
