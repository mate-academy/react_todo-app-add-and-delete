/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorsEnum } from './utils/ErrorsEnum';
import { Error } from './components/Error/Error';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';

export const App: React.FC = () => {
  const [todoList, setTodosList] = useState<Todo[]>([]);
  const [filteredTodoList, setFilteredTodoList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<ErrorsEnum | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isClearDisabled, setIsClearDisabled] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const updateClearDisabled = useCallback(() => {
    setIsClearDisabled(!todoList.some(todo => todo.completed));
  }, [todoList]);

  useEffect(() => {
    todosService
      .getTodos()
      .then(todos => {
        setTodosList(todos);
        setFilteredTodoList(todos);
        updateClearDisabled();
      })
      .catch(() => {
        setError(ErrorsEnum.UNABLE_LOAD_TODOS);
        setTimeout(() => setError(null), 3000);
      });
  });

  const handleDeleteTodo = (todoId: number) => {
    setIsEnabled(false);
    todosService
      .deleteTodos(todoId)
      .then(() => {
        setTodosList(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setFilteredTodoList(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorsEnum.UANBLE_DELETE_TODO);
        setTimeout(() => setError(null), 3000);
      })
      .finally(() => {
        setIsEnabled(true);
      });
  };

  const handleClearCompleted = useCallback(() => {
    todoList.map(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  }, [todoList]);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  const addTodo = () => {
    if (inputValue.trim() === '') {
      setError(ErrorsEnum.TITLE_IS_EMPTY);
      setTimeout(() => setError(null), 3000);
      setIsEnabled(true);

      return;
    }

    setTempTodo({
      id: 0,
      userId: 0,
      title: inputValue.trim(),
      completed: false,
    });

    todosService
      .createTodos(inputValue.trim())
      .then(newTodo => {
        setTodosList(currentTodos => [...currentTodos, newTodo]);
        setFilteredTodoList(currentTodos => [...currentTodos, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setError(ErrorsEnum.UNABLE_ADD_TODO);
        setTimeout(() => setError(null), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsEnabled(true);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          inputValue={inputValue}
          isEnabled={isEnabled}
          createTodo={addTodo}
          setInputValue={setInputValue}
          toggleEnabled={setIsEnabled}
        />

        <TodoList
          todoList={filteredTodoList}
          tempTodo={tempTodo}
          deleteTodo={handleDeleteTodo}
        />

        {todoList.length > 0 && (
          <Footer
            todoList={todoList}
            isClearDisabled={isClearDisabled}
            filterTodoList={setFilteredTodoList}
            clearCompleted={handleClearCompleted}
            updateClearDisabled={updateClearDisabled}
          />
        )}
      </div>

      <Error error={error} clearError={setError} />
    </div>
  );
};
