import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import React from 'react';
import { ErrorType } from '../enums/error';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<number[]>>;
  setHasError: React.Dispatch<React.SetStateAction<string>>;
  // completedTodos?: Todo[]
};

const changeStatusCompleteTodo = ({
  todo,
  setTodos,
  setLoading,
  setHasError,
  // completedTodos,
}: Props) => {
  setLoading(prev => [...prev, todo.id]);

  updateTodo(todo.id, { completed: !todo.completed })
    .then(updatedTodo => {
      setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
    })
    .catch(() => {
      setHasError(ErrorType.UPDATE);
    })
    .finally(() => {
      setLoading(prev => prev.filter(id => id !== todo.id));
    });
};

export default changeStatusCompleteTodo;
