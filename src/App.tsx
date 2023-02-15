/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { getTodos, postTodo } from './api/todos';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Error } from './components/ShowError/ShowError';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { FilterBy } from './types/Filter';

const USER_ID = 6156;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState('All');
  const [error, setError] = useState('');

  const isAnyTodoCompleted
    = Boolean(todos.filter(todo => todo.completed).length);

  const handlePostTodo = (todoTitle: string) => {
    if (todoTitle.trim() === '') {
      setError('Title can\'t be empty');
    } else {
      postTodo(USER_ID, todoTitle)
        .then(todo => {
          setTodos([...todos, todo]);
        })
        .catch(() => {
          setError('Unable to add todo');
        });
    }
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(response => {
        setTodos(response);
        setVisibleTodos(response);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleFilterClick = (filter: FilterBy) => {
    if (todoFilter !== filter) {
      setTodoFilter(filter);

      switch (filter) {
        case FilterBy.all:
        default:
          setVisibleTodos(todos);
          break;
        case FilterBy.active:
          setVisibleTodos(todos.filter(todo => !todo.completed));
          break;
        case FilterBy.completed:
          setVisibleTodos(todos.filter(todo => todo.completed));
          break;
      }
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header postTodo={handlePostTodo} />

        <TodoList todos={visibleTodos} />

        {todos.length > 0 && (
          <TodoFilter
            filter={todoFilter}
            onFilterClick={handleFilterClick}
            renderClearCompleted={isAnyTodoCompleted}
          />
        )}
      </div>

      <Error error={error} />
    </div>
  );
};
