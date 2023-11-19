/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as TodoServices from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrors } from './components/TodoErrors';
import { ErrorType } from './types/ErrorType';

const USER_ID = 11682;

enum FilterValue {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorType | null>(null);
  const [filterValue, setFilterValue] = useState<FilterValue>(FilterValue.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    TodoServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(ErrorType.LoadError);
      });
  }, []);

  const addTodo = () => {
    setTempTodo({
      userId: USER_ID, title: query.trim(), completed: false, id: 0,
    });

    TodoServices.postTodos(
      { userId: USER_ID, title: query.trim(), completed: false },
    )
      .then(newItem => {
        setTodos(currentTodos => [...currentTodos, newItem]);
        setQuery('');
      })
      .catch(() => {
        setError(ErrorType.AddTodoError);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deletePost = (todoId: number) => {
    TodoServices.deleteTodos(todoId);
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const filteredTodos = useMemo(() => {
    switch (filterValue) {
      case FilterValue.Active:
        return todos.filter(todo => !todo.completed);
      case FilterValue.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filterValue]);

  const handleFilterChange = (filter: FilterValue) => {
    setFilterValue(filter);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const clearCompleted = () => {
    const todosCompleted = todos.filter(todo => todo.completed);

    const todosIdCompleted = todosCompleted.map(todo => todo.id);

    todosIdCompleted.forEach(item => {
      TodoServices.deleteTodos(item)
        .catch(() => {
          setError(ErrorType.DeleteTodoError);
        });
    });

    const newTodos = todos.filter(todo => !todo.completed);

    setTodos(newTodos);
  };

  const handleToggleAll = async () => {
    try {
      const updatePromises = todos.map(async (todo) => {
        const updatedTodo = { ...todo, completed: !todo.completed };

        await TodoServices.updateTodos(updatedTodo);

        return updatedTodo;
      });

      const updatedTodos = await Promise.all(updatePromises);

      setTodos(updatedTodos);
    } catch (errorR) {
      setError(ErrorType.UpdateTodoError);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onSubmit={addTodo}
          USER_ID={USER_ID}
          setError={setError}
          tempTodo={tempTodo}
          query={query}
          setQuery={setQuery}
          handleToogleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          deletePost={deletePost}
          setTodos={setTodos}
        />

        {/* Hide the footer if there are no todos */}
        <TodoFooter
          todos={filteredTodos}
          filterValue={filterValue}
          filterChange={handleFilterChange}
          clearCompleted={clearCompleted}
          setTodos={setTodos}
          setError={setError}
        />
      </div>

      <TodoErrors error={error} />
    </div>
  );
};
