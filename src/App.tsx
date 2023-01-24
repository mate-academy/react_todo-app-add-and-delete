/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useState, useMemo,
} from 'react';
import { getTodos, removeTodo } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterOption, setFilterOption] = useState(Filter.All);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deletedTodoIds, setDeletedTodoIds] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setIsError(true);
        });
    }
  }, []);

  const handleFilter = (value: Filter) => {
    setFilterOption(value);
  };

  const addTodo = (value: Todo) => {
    setTodos(currentTodos => {
      return [
        ...currentTodos,
        value,
      ];
    });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);
    setDeletedTodoIds(currentId => [...currentId, todoId]);

    removeTodo(todoId)
      .then(() => {
        setTodos((currentTodos) => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setIsError(true);
        setErrorText('Unable to delete a todo');
        setTimeout(() => setErrorText(''), 3000);
      })
      .finally(() => {
        setIsLoading(false);
        setDeletedTodoIds([]);
      });
  };

  const getFilteredTodos = () => {
    let filteredTodos = todos;

    switch (filterOption) {
      case Filter.Active:
        filteredTodos = todos.filter(todo => !todo.completed);
        break;

      case Filter.Completed:
        filteredTodos = todos.filter(todo => todo.completed);
        break;

      case Filter.All:
      default:
        break;
    }

    return filteredTodos;
  };

  const filteredTodos = useMemo(
    getFilteredTodos,
    [filterOption, todos],
  );

  const numberOfActiveTodos = todos.filter(todo => !todo.completed).length;
  const numberOfCompletedTodos = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          setIsAdding={setIsAdding}
          isAdding={isAdding}
          setIsError={setIsError}
          setErrorText={setErrorText}
          setNewTodo={setNewTodo}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              isAdding={isAdding}
              newTodo={newTodo}
              deleteTodo={deleteTodo}
              isLoading={isLoading}
              deletedTodoIds={deletedTodoIds}
            />
            <Footer
              onSelect={handleFilter}
              filterOption={filterOption}
              numberOfActiveTodos={numberOfActiveTodos}
              numberOfCompletedTodos={numberOfCompletedTodos}
              deleteTodo={deleteTodo}
              todos={todos}
            />
          </>
        )}
      </div>

      {isError && (
        <ErrorNotification
          errorText={errorText}
          setErrorText={setErrorText}
        />
      )}
    </div>
  );
};
