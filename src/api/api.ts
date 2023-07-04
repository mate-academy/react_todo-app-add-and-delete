import React from 'react';
import { Todo } from '../types/Todo';
import { UpdateTodoData } from '../types/types';
import { client } from '../utils/fetchClient';

const USER_ID = 10917;

export const addTodo = async (
  title: string,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
): Promise<Todo> => {
  try {
    const newTodo: Todo = await client.post(`/todos?userId=${USER_ID}`, {
      userId: USER_ID,
      completed: false,
      title,
    });

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    setTodos((prevTodos) => [...prevTodos, newTodo]);
    setErrorMessage('');
    setTempTodo(null);

    return newTodo;
  } catch (error) {
    setErrorMessage('Unable to add a todo');
    throw new Error('Error');
  }
};

export const updateTodo = async (
  todoId: number,
  data: UpdateTodoData,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    await client.patch(`/todos/${todoId}`, data);

    setTodos((prevTodos: Todo[]) => prevTodos
      .map((todo) => (todo.id === todoId ? { ...todo, ...data } : todo)));

    setErrorMessage('');
  } catch (error) {
    setErrorMessage('Unable to update a todo');
    throw new Error('Error');
  }
};

export const deleteTodo = async (
  todoId: number,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  try {
    await client.delete(`/todos/${todoId}`);

    setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));

    setErrorMessage('');
  } catch (error) {
    setErrorMessage('Unable to delete a todo');
    throw new Error('Error');
  }
};
