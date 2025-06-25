import { Type } from "@sinclair/typebox";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PostPlain = Type.Object(
  {
    id: Type.Integer(),
    userId: Type.Integer(),
    title: Type.String(),
    content: Type.String(),
    createdAt: Type.Date(),
    updatedAt: Type.Date(),
  },
  { additionalProperties: false },
);

export const PostRelations = Type.Object(
  {
    user: Type.Object(
      {
        id: Type.Integer(),
        email: Type.String(),
        password: Type.String(),
        name: Type.String(),
        role: Type.Union([Type.Literal("VIEWER"), Type.Literal("ADMIN")], {
          additionalProperties: false,
        }),
        refreshToken: __nullable__(Type.String()),
        createdAt: Type.Date(),
        updatedAt: Type.Date(),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PostWhere = Type.Partial(
  Type.Recursive(
    (Self) =>
      Type.Object(
        {
          AND: Type.Union([
            Self,
            Type.Array(Self, { additionalProperties: false }),
          ]),
          NOT: Type.Union([
            Self,
            Type.Array(Self, { additionalProperties: false }),
          ]),
          OR: Type.Array(Self, { additionalProperties: false }),
          id: Type.Integer(),
          userId: Type.Integer(),
          title: Type.String(),
          content: Type.String(),
          createdAt: Type.Date(),
          updatedAt: Type.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "Post" },
  ),
);

export const PostWhereUnique = Type.Recursive(
  (Self) =>
    Type.Intersect(
      [
        Type.Partial(
          Type.Object({ id: Type.Integer() }, { additionalProperties: false }),
          { additionalProperties: false },
        ),
        Type.Union([Type.Object({ id: Type.Integer() })], {
          additionalProperties: false,
        }),
        Type.Partial(
          Type.Object({
            AND: Type.Union([
              Self,
              Type.Array(Self, { additionalProperties: false }),
            ]),
            NOT: Type.Union([
              Self,
              Type.Array(Self, { additionalProperties: false }),
            ]),
            OR: Type.Array(Self, { additionalProperties: false }),
          }),
          { additionalProperties: false },
        ),
        Type.Partial(
          Type.Object(
            {
              id: Type.Integer(),
              userId: Type.Integer(),
              title: Type.String(),
              content: Type.String(),
              createdAt: Type.Date(),
              updatedAt: Type.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "Post" },
);

export const PostSelect = Type.Partial(
  Type.Object(
    {
      id: Type.Boolean(),
      userId: Type.Boolean(),
      title: Type.Boolean(),
      content: Type.Boolean(),
      createdAt: Type.Boolean(),
      updatedAt: Type.Boolean(),
      user: Type.Boolean(),
      _count: Type.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const PostInclude = Type.Partial(
  Type.Object(
    { user: Type.Boolean(), _count: Type.Boolean() },
    { additionalProperties: false },
  ),
);

export const PostOrderBy = Type.Partial(
  Type.Object(
    {
      id: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
      userId: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
      title: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
      content: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
      createdAt: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
      updatedAt: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
    },
    { additionalProperties: false },
  ),
);

export const Post = Type.Composite([PostPlain, PostRelations], {
  additionalProperties: false,
});
