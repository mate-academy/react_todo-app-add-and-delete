import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3093;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

// import { Post } from '../types';
// import { client } from '../utils/httpClient';

// export function getUserPosts(userId: number) {
//   return client.get<Post[]>(`/posts?userId=${userId}`)
// }

// export function deleteUserPosts(postId: number) {
//   return client.delete<number>(`/posts/${postId}`)
// }

// export function createUserPosts({title, body, userId}: Omit<Post, 'id'>) {
//   return client.post<Post>(`/posts`, {title, body, userId} )
// }

// export function updateUserPosts({ id, title, body, userId }: Post) {
//   return client.patch<Post[]>(`/posts/${id}`, {title, body, userId} )
// }
