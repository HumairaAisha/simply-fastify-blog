import { Type } from "@sinclair/typebox";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const Role = Type.Union(
  [Type.Literal("VIEWER"), Type.Literal("ADMIN")],
  { additionalProperties: false },
);
