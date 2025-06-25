import { Type } from "@sinclair/typebox";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = Type.Object(
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
);

export const UserRelations = Type.Object(
  {
    posts: Type.Array(
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
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const UserWhere = Type.Partial(
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
          email: Type.String(),
          password: Type.String(),
          name: Type.String(),
          role: Type.Union([Type.Literal("VIEWER"), Type.Literal("ADMIN")], {
            additionalProperties: false,
          }),
          refreshToken: Type.String(),
          createdAt: Type.Date(),
          updatedAt: Type.Date(),
        },
        { additionalProperties: false },
      ),
    { $id: "User" },
  ),
);

export const UserWhereUnique = Type.Recursive(
  (Self) =>
    Type.Intersect(
      [
        Type.Partial(
          Type.Object(
            { id: Type.Integer(), email: Type.String() },
            { additionalProperties: false },
          ),
          { additionalProperties: false },
        ),
        Type.Union(
          [
            Type.Object({ id: Type.Integer() }),
            Type.Object({ email: Type.String() }),
          ],
          { additionalProperties: false },
        ),
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
              email: Type.String(),
              password: Type.String(),
              name: Type.String(),
              role: Type.Union(
                [Type.Literal("VIEWER"), Type.Literal("ADMIN")],
                { additionalProperties: false },
              ),
              refreshToken: Type.String(),
              createdAt: Type.Date(),
              updatedAt: Type.Date(),
            },
            { additionalProperties: false },
          ),
        ),
      ],
      { additionalProperties: false },
    ),
  { $id: "User" },
);

export const UserSelect = Type.Partial(
  Type.Object(
    {
      id: Type.Boolean(),
      email: Type.Boolean(),
      password: Type.Boolean(),
      name: Type.Boolean(),
      role: Type.Boolean(),
      refreshToken: Type.Boolean(),
      createdAt: Type.Boolean(),
      updatedAt: Type.Boolean(),
      posts: Type.Boolean(),
      _count: Type.Boolean(),
    },
    { additionalProperties: false },
  ),
);

export const UserInclude = Type.Partial(
  Type.Object(
    { role: Type.Boolean(), posts: Type.Boolean(), _count: Type.Boolean() },
    { additionalProperties: false },
  ),
);

export const UserOrderBy = Type.Partial(
  Type.Object(
    {
      id: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
      email: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
      password: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
      name: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
        additionalProperties: false,
      }),
      refreshToken: Type.Union([Type.Literal("asc"), Type.Literal("desc")], {
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

export const User = Type.Composite([UserPlain, UserRelations], {
  additionalProperties: false,
});
