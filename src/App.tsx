/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { Filter, Todo } from './types/Todo';
import { createTodo, getTodos, removeTodo } from './api/todos';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoMain } from './components/TodoMain/TodoMain';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoError } from './components/TodoError/TodoError';
import { filterTodosByStatus } from './utils/filterTodo';
import { USER_ID } from './components/constants/constants';

export const App: React.FC = () => {
  const [baseTodo, setBaseTodo] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(Filter.ALL);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [listOfTodosIds, setListOfTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const todos = useMemo(
    () => filterTodosByStatus(baseTodo, filterStatus), [baseTodo, filterStatus],
  );

  useEffect(() => {
    getTodos(USER_ID)
      .then(todo => {
        setBaseTodo(todo);
      })
      .catch(() => setError('Invalid url link'));
  }, []);

  const countTodoActive = useMemo(() => baseTodo
    .filter(todo => !todo.completed).length, [baseTodo]);

  const countTodoCompleted = useMemo(() => baseTodo
    .filter(todo => todo.completed).length, [baseTodo]);

  const addTodo = (newTodo: Todo) => {
    setLoading(true);
    setTempTodo(newTodo);

    return createTodo(newTodo)
      .then(todo => {
        setBaseTodo(currentTodos => [...currentTodos, todo]);
      })
      .catch(() => {
        setError('Unable to add a post');
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    removeTodo(todoId)
      .then(() => {
        setBaseTodo((currentTodos: Todo[]) => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
        setListOfTodosIds([]);
      });
  };

  const deleteCompletedTodos = () => {
    setLoading(true);

    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setListOfTodosIds(completedTodoIds);

    if (!completedTodos || completedTodos.length === 0) {
      setError('There are no completed todos');
      setLoading(false);

      return;
    }

    completedTodos.map(todo => deleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          countTodoActive={countTodoActive}
          addTodo={(newTodo: Todo) => addTodo(newTodo)}
          setError={setError}
        />

        <TodoMain
          todos={todos}
          deleteTodo={deleteTodo}
          isLoading={isLoading}
          listOfTodosIds={listOfTodosIds}
          tempTodo={tempTodo}
        />

        <TodoFooter
          countTodoActive={countTodoActive}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          deleteCompletedTodos={deleteCompletedTodos}
          countTodoCompleted={countTodoCompleted}
        />
      </div>

      {error && <TodoError error={error} />}
    </div>
  );
};
