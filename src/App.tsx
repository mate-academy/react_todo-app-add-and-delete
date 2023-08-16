import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { AddTodo } from './сomponents/AddTodo';
import { TodosFilter } from './сomponents/TodosFilter';
import { TodoList } from './сomponents/TodoList';
import { Todo } from './types/Todo';
import { getTodos, addTodo, delTodo } from './api/todos';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.all);
  const [todosIdToDelete, setTodosIdToDelete] = useState<number[]>([]);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load a todos'));
  }, []);

  useEffect(() => {
    todosIdToDelete.forEach(id => {
      delTodo(id)
        .then(() => {
          setTodos(curentTodos => curentTodos.filter(todo => todo.id !== id));
          setTodosIdToDelete(curent => curent.filter(todoId => todoId !== id));
        })
        .catch(() => {
          showError('Unable to delete a todos');
        });
    });
  }, [todosIdToDelete]);

  const createTodo = (newTitle: string) => {
    setTempTodo({
      id: 0,
      userId: 11337,
      title: newTitle,
      completed: false,
    });

    return addTodo(newTitle)
      .then(newTodo => {
        setTodos(curentTodos => [...curentTodos, newTodo]);
      })
      .catch(() => {
        showError('Unable to add a todos');
      })
      .finally(() => setTempTodo(null));
  };

  useMemo(() => {
    switch (filterStatus) {
      case Filter.active:
        setFilteredTodos(todos.filter(todo => todo.completed === false));
        break;

      case Filter.completed:
        setFilteredTodos(todos.filter(todo => todo.completed === true));
        break;

      case Filter.all:
      default:
        setFilteredTodos([...todos]);
    }
  }, [filterStatus, todos]);

  const filteredTodosCount = filteredTodos.length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <AddTodo
          todosLength={filteredTodosCount}
          createTodo={createTodo}
          setError={showError}
        />

        {(!!filteredTodosCount || !!tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            todosIdToDelete={todosIdToDelete}
            setTodosIdToDelete={setTodosIdToDelete}
          />
        )}

        {!!todos.length && (
          <TodosFilter
            onChangeStatus={setFilterStatus}
            status={filterStatus}
            todos={todos}
            setTodosIdToDelete={setTodosIdToDelete}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: !errorMessage },
      )}
      >
        <button
          type="button"
          aria-label="Close error message"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
