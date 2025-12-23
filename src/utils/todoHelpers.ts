import { Todo } from '../types/Todo';
export const createTempTodo = (title: string, userId: number): Todo => ({
  id: 0,
  title,
  userId,
  completed: false,
});

export const validateInput = (input: string): string | null => {
  const clean = input.trim();

  if (!clean) {
    return 'Title should not be empty';
  }

  return null;
};
