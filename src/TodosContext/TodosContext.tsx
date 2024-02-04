/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-cycle */
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import * as api from '../api/todos';
import { USER_ID } from '../App';
import { Context } from '../types/Context';
import { Todos } from '../types/Todos';

type Props = {
  children: React.ReactNode;
};

export const TodosContext = React.createContext<Todos>({ todos: [] });

export const TodoUpdateContext = React.createContext<Context>({
  addTodo: (_todo: Todo) => {},
  removeTodo: (_id: number) => {},
  changeTodo: (_todoId: number, _todo: boolean) => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);

  function loadTodos() {
    api.getTodos(USER_ID)
      .then(setTodos);
  }

  useEffect(loadTodos, [newTodo]);

  function addTodo(todo: Todo) {
    api.createTodo(todo)
      .then(setNewTodo);
  }

  function removeTodo(todoId: number) {
    api.deleteTodo(todoId)
      .then(loadTodos);
  }

  function changeTodo(todoId: number, completed: boolean) {
    api.updateTodo(todoId, completed)
      .then(loadTodos);
  }

  const methods = useMemo(() => (
    { addTodo, removeTodo, changeTodo }), []);
  const value = useMemo(() => ({ todos }), [todos]);

  return (

    <TodoUpdateContext.Provider value={methods}>
      <TodosContext.Provider value={value}>
        {children}
      </TodosContext.Provider>
    </TodoUpdateContext.Provider>
  );
};
