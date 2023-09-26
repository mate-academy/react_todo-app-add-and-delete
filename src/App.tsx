import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { StatusState } from './types/StatusState';
import * as todoService from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { TodoHeader } from './components/TodoHeader';
import { TodosFilter } from './components/TodosFilter';
import {
  UNABLE_ADD_TODO,
  UNABLE_DELETE_TODO,
  UNLOADED_TODO,
  USER_ID,
} from './utils/constans';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterTodo, setFilterTodo] = useState(StatusState.All);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await todoService.getTodos();

        setTodos(fetchedTodos);
      } catch (error) {
        setErrorMessage(UNLOADED_TODO);
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChangeFilter = (newElement: StatusState) => {
    setFilterTodo(newElement);
  };

  const handleAddTodo = async (todoTitle: string) => {
    if (todoTitle.trim() === '') {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);

    try {
      await todoService.addTodo(todoTitle);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(UNABLE_ADD_TODO);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    const todoToDelete = todos.find(todo => todo.id === todoId);

    if (!todoToDelete) {
      return;
    }

    setIsLoading(true);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(UNABLE_DELETE_TODO);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      await Promise.all(
        completedTodos.map(todo => todoService.deleteTodo(todo.id)),
      );
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch (error) {
      setErrorMessage(UNABLE_DELETE_TODO);
    } finally {
      setIsLoading(false);
    }
  };

  const incompleteTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filterTodo) {
      case StatusState.Active:
        return !todo.completed;
      case StatusState.Completed:
        return todo.completed;
      case StatusState.All:
      default:
        return todo;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          onTodoAdd={handleAddTodo}
          inputRef={inputRef}
          isLoading={isLoading}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              isLoading={isLoading}
              onTodoDelete={() => handleDeleteTodo(todo.id)}
              key={todo.id}
            />
          ))}
        </section>

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${incompleteTodosCount} items left`}
            </span>
            <TodosFilter
              filterTodo={filterTodo}
              onChangeFilter={handleChangeFilter}
            />
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={incompleteTodosCount === todos.length}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseMessage={setErrorMessage}
      />
    </div>
  );
};
