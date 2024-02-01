import React, { useEffect, useMemo, useState } from 'react';
import { filterForTodos } from '../services/chooseFilterForTodos';
import { getTodos } from '../api/todos';
import { USER_ID } from '../variables/UserID';
import { Todo } from '../types/Todo';
import { TodoContext } from '../types/TodoContext.1';
import { wait } from '../utils/fetchClient';
import * as todosServices from '../api/todos';
import { Status } from '../types/Status';

export const TodosContext = React.createContext<TodoContext>({
  todos: [],
  addTodo: () => { },
  setCompleted: () => { },
  makeAllCompleted: () => { },
  query: Status.All,
  setQuery: () => { },
  filteredTodos: [],
  deleteCompletedTodos: () => { },
  deleteTodo: () => { },
  saveEditingTitle: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  deleteTodosId: [],
  setDeleteTodosId: () => { },
});

interface Props {
  children: React.ReactNode;
}

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodosId, setDeleteTodosId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');

        wait(3000).then(() => setErrorMessage(''));
      });
  }, []);

  function addTodo(todo: Todo) {
    if (todo.title.trim().length) {
      setTodos(prevTodos => [
        ...prevTodos,
        todo,
      ]);
    }
  }

  function setCompleted(todoID: number) {
    const changeCompletedTodos = todos.map(todo => {
      return todo.id === todoID
        ? { ...todo, completed: !todo.completed }
        : todo;
    });

    setTodos(changeCompletedTodos);
  }

  const filteredTodos = filterForTodos(query, todos);

  function saveEditingTitle(todoID: number, changedTitle: string) {
    let changedTodos = [...todos];

    if (changedTitle.trim()) {
      changedTodos = changedTodos.map(todo => (
        todo.id === todoID
          ? { ...todo, title: changedTitle }
          : todo));
    }

    setTodos(changedTodos);
  }

  function makeAllCompleted(todosToComplete: Todo[]) {
    const isTodoCompleted = todosToComplete.every(
      todo => todo.completed === true,
    );

    let todosPrepare = [...todos];

    todosPrepare = todosPrepare.map(
      todo => (
        { ...todo, completed: !isTodoCompleted }
      ),
    );

    setTodos(todosPrepare);
  }

  function deleteTodo(todoID: number) {
    setDeleteTodosId(prevNumbers => [...prevNumbers, todoID]);
    todosServices.deleteTodo(todoID).then(() => setTodos(todos.filter(
      todo => todo.id !== todoID,
    )))
      .finally(() => setDeleteTodosId([]));
  }

  function deleteCompletedTodos() {
    const filterTodos = todos.filter(({ completed }) => completed);

    filterTodos.map(({ id }) => todosServices.deleteTodo(id)
      .then(() => setTodos(todos.filter(({ completed }) => !completed))));
  }

  const value = useMemo(() => ({
    todos,
    addTodo,
    setCompleted,
    makeAllCompleted,
    query,
    setQuery,
    filteredTodos,
    deleteCompletedTodos,
    deleteTodo,
    saveEditingTitle,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    deleteTodosId,
    setDeleteTodosId,
  }), [todos, filteredTodos, query, errorMessage]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
