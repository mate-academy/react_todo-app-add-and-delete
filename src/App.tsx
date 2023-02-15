/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Error } from './components/Error/Error';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { FilterBy } from './types/Filter';
import { ErrorOf } from './types/Error';

const USER_ID = 6156;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState(FilterBy.all);
  const [error, setError] = useState(ErrorOf.none);
  const [completedTodoIds, setCompletedTodoIds] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');

  const isAnyTodoCompleted
    = todos.some(todo => todo.completed);

  const changeTodosFilter = (filter: FilterBy) => {
    setTodoFilter(filter);
    setVisibleTodos(todos.filter(todo => {
      switch (filter) {
        case FilterBy.all:
        default:
          return true;
        case FilterBy.active:
          return !todo.completed;
        case FilterBy.completed:
          return todo.completed;
      }
    }));
  };

  const createTodo = (title: string) => {
    if (title.trim() === '') {
      setError(ErrorOf.emptyTitle);
    } else {
      postTodo(USER_ID, title)
        .then(todo => {
          setTodos(current => [...current, todo]);
          setTodoTitle('');
        })
        .catch(() => {
          setError(ErrorOf.add);
        });
    }
  };

  const removeTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        // page also needs to reload to show correct todos after delete
        setError(ErrorOf.delete);
      });
  };

  const removeCompletedTodos = () => {
    completedTodoIds.forEach(id => removeTodo(id));
  };

  useEffect(() => {
    changeTodosFilter(todoFilter);
    setCompletedTodoIds(todos.filter(todo => todo.completed).map(todo => todo.id));
  }, [todos]);

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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          createTodo={createTodo}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
        />

        <TodoList
          removeTodo={removeTodo}
          todos={visibleTodos}
        />

        {todos.length > 0 && (
          <TodoFilter
            filter={todoFilter}
            filterTodos={changeTodosFilter}
            removeCompletedTodos={removeCompletedTodos}
            renderClearCompleted={isAnyTodoCompleted}
          />
        )}
      </div>

      <Error error={error} />
    </div>
  );
};
