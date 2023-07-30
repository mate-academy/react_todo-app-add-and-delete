import React, { useCallback, useEffect, useState } from 'react';
import cn from 'classnames';

import './TodoApp.scss';
import { Filter } from '../Filter';
import { Todo } from '../Todo';
import { TodoType } from '../../types/TodoType';
import * as TodoService from '../../api/todos';
import { FilterValue } from '../../types/FilterValue';
import { TodoItem } from '../TodoItem';

type Props = {
  userId: number;
};

function filterTodos(todo: TodoType, filterValue: FilterValue) {
  switch (filterValue) {
    case FilterValue.All:
      return true;

    case FilterValue.Active:
      return !todo.completed;

    case FilterValue.Completed:
      return todo.completed;

    default:
      throw new Error('Undefined error');
  }
}

export const TodoApp: React.FC<Props> = ({ userId }) => {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterValue, setFilterValue] = useState(FilterValue.All);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage('');

    TodoService.getTodos(userId)
      .then(setTodos)
      .catch(() => handleError('Unable to load todos'));
  }, []);

  const makeSetErrorMessage
    = (message: string) => () => setErrorMessage(message);

  const filteredTodos = todos.filter(todo => (
    filterTodos(todo, filterValue)
  ));

  const addTodo = (title: string) => (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (title.length === 0) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    setErrorMessage('');

    const newTodo = { userId, title, completed: false };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    TodoService.addTodo(userId, newTodo)
      .then(createdTodo => {
        setTodos(currentTodos => (
          [...currentTodos, createdTodo]
        ));
        setNewTitle('');
      })
      .catch((error) => {
        handleError('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteFunctionCall = (id: number) => {
    return TodoService.deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        handleError('Unable to delete a todo');
        setTodos(todos);
        throw error;
      });
  };

  const deleteTodo = (id: number) => {
    return deleteFunctionCall(id);
  };

  const deleteCompletedTodos = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        setDeletedTodoIds((currentIds) => [...currentIds, todo.id]);

        deleteFunctionCall(todo.id)
          .finally(() => {
            setDeletedTodoIds([]);
          });
      });
  };

  const makeSetNewTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setNewTitle(event.target.value);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* eslint-disable-next-line */}
          <button type="button" className="todoapp__toggle-all active" />

          <form
            onSubmit={addTodo(newTitle)}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={makeSetNewTitle}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {filteredTodos.map(todo => (
            <Todo
              todo={todo}
              onDelete={deleteTodo}
              ids={deletedTodoIds}
              key={todo.id}
            />
          ))}

          {tempTodo && (
            <TodoItem
              todo={tempTodo}
            />
          )}
        </section>

        {(todos.length > 0) && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              3 items left
            </span>

            <Filter filterValue={filterValue} handleFilter={setFilterValue} />

            <button
              type="button"
              className={cn(
                'todoapp__clear-completed',
                { 'is-invisible': todos.every(todo => !todo.completed) },
              )}
              onClick={deleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
      >
        {/* eslint-disable-next-line */}
        <button
          type="button"
          className="delete"
          onClick={makeSetErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
