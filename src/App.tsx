/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { FilterType } from './types/FilterType';
import { ErrorMessages } from './types/ErrorMessages';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import * as todoSetvices from './api/todos';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.default,
  );
  const [currentFilter, setCurrentFilter] = useState(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const [inputValue, setInputValue] = useState('');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const getTodoFromServer = () => {
    setIsLoading(true);

    todoSetvices
      .getTodos()
      .then(setTodoList)
      .catch(() => {
        setErrorMessage(ErrorMessages.getError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const filteredTodos = todoList.filter(todo => {
    switch (currentFilter) {
      case FilterType.All:
        return true;

      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;
    }
  });

  const deleteTodo = (todoId: number) => {
    setLoadingIds(ids => [...ids, todoId]);
    todoSetvices
      .deletePost(todoId)
      .then(() => {
        setTodoList(currentTodo =>
          currentTodo.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.deleteError);
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const addPost = (title: string) => {
    const newTitle = title.trim();

    if (!newTitle.trim()) {
      return setErrorMessage(ErrorMessages.emptyTitleError);
    }

    const tempNewTodo: Todo = {
      id: 0,
      userId: todoSetvices.USER_ID,
      title: newTitle,
      completed: false,
    };

    setTempTodo(tempNewTodo);
    setIsLoading(true);
    setLoadingIds(currentIds => [...currentIds, 0]);

    return todoSetvices
      .addPost(newTitle)
      .then(newTodo => {
        setTodoList(currentTodos => [...currentTodos, newTodo]);
        setInputValue('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.addError);
        setInputValue(newTitle);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        setLoadingIds([]);
      });
  };

  useEffect(() => {
    getTodoFromServer();
  }, []);

  const areAllCompleted =
    todoList.length > 0 && todoList.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areAllCompleted={areAllCompleted}
          addPost={addPost}
          isLoading={isLoading}
          inputValue={inputValue}
          setInputValue={setInputValue}
          inputRef={inputRef}
        />

        <TodoList
          isLoading={isLoading}
          todoList={todoList}
          filteredTodos={filteredTodos}
          deleteTodos={deleteTodo}
          loadingIds={loadingIds}
          tempTodo={tempTodo}
        />

        {todoList.length > 0 && (
          <Footer
            todoList={todoList}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            deleteTodos={deleteTodo}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        removeError={() => setErrorMessage(ErrorMessages.default)}
      />
    </div>
  );
};
