import { getPagination } from "src/utils/pagination";
import { prisma } from "src/utils/prisma";

export async function createPost(data: {
  title: string;
  content: string;
  userId: number;
}) {
  // Ensure the post does not exists
  const existingPost = await prisma.post.findFirst({
    where: { title: data.title, userId: data.userId },
  });
  if (existingPost) throw new Error("Post already exists");

  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      userId: data.userId,
    },
  });
  return post;
}

export async function getAllMyPosts(
  userId: number,
  page?: number | string,
  perPage?: number | string
) {
  const {
    skip,
    take,
    page: currentPage,
    perPage: currentPerPage,
  } = getPagination({ page, perPage });
  const [totalItems, posts] = await Promise.all([
    prisma.post.count(),
    prisma.post.findMany({
      where: { id: userId },
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
  ]);
  const totalPages = Math.ceil(totalItems / currentPerPage);
  return {
    pagination: {
      page: currentPage,
      perPage: currentPerPage,
      totalItems,
      totalPages,
    },
    data: posts,
  };
}

export async function getAllPosts(
  page?: number | string,
  perPage?: number | string
) {
  const {
    skip,
    take,
    page: currentPage,
    perPage: currentPerPage,
  } = getPagination({ page, perPage });
  const [totalItems, posts] = await Promise.all([
    prisma.post.count(),
    prisma.post.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
  ]);
  const totalPages = Math.ceil(totalItems / currentPerPage);
  return {
    pagination: {
      page: currentPage,
      perPage: currentPerPage,
      totalItems,
      totalPages,
    },
    data: posts,
  };
}

export async function getPostById(id: number) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!post) throw new Error("Post not found");
  return post;
}

export async function updatePost(
  postId: number,
  userId: number,
  data: Partial<{
    title: string;
    content: string;
  }>
) {
  if (postId) {
    const post = await prisma.post.findUnique({
      where: { id: postId, userId },
    });
    if (!post) throw new Error("Post not found");
  }
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.content && { content: data.content }),
    },
  });
  return updatedPost;
}

export async function deletePost(postId: number, userId: number) {
  if (postId) {
    const post = await prisma.post.findUnique({
      where: { id: postId, userId },
    });
    if (!post) throw new Error("Post not found");
  }
  await prisma.post.delete({ where: { id: postId, userId } });
  return { message: "Post deleted" };
}
