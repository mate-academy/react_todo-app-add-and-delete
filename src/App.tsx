/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorBox } from './components/ErrorBox';
import { UpdateTodo } from './types/Updates';
import { getFilteredTodos } from './helpers/helpers';
import { FilterType } from './enum/filterTypes';
import { ErrorMessages } from './enum/ErrorMassages';
import { TodoItem } from './components/TodoItem';
export const App: React.FC = () => {
  const { Load, Add, Delete, Update, None } = ErrorMessages;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMassage] = useState(ErrorMessages.None);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(FilterType.All);
  const [todoLoadingStates, setTodoLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayedTodos = getFilteredTodos(todos, filter);

  const errorTimerId = useRef(0);
  const showError = (message: ErrorMessages) => {
    setErrorMassage(message);
    window.clearTimeout(errorTimerId.current);
    errorTimerId.current = window.setTimeout(() => {
      setErrorMassage(None);
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(Load));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTodoLoading = (id: number, loading: boolean) => {
    setTodoLoadingStates(prevState => ({ ...prevState, [id]: loading }));
  };

  const onAdd = async ({ userId, title, completed }: Todo) => {
    const newTempTodo: Todo = {
      id: 0,
      userId,
      title,
      completed,
    };

    setTempTodo(newTempTodo);

    try {
      setIsLoading(true);
      setTodoLoading(0, true);
      const newTodo = await todoService.createTodo({
        userId,
        title,
        completed,
      });

      setTodos(prev => [...prev, newTodo]);
      setTempTodo(null);
    } catch (error) {
      showError(Add);
      setTempTodo(null);
      throw error;
    } finally {
      setTodoLoading(0, false);
      setIsLoading(false);
    }
  };

  const onDelete = async (todoId: number) => {
    try {
      setTodoLoading(todoId, true);
      await todoService.deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      showError(Delete);
      throw error;
    } finally {
      setTodoLoading(todoId, false);
      inputRef.current?.focus();
    }
  };

  const updateTodo = async ({ id, newData, keyValue }: UpdateTodo) => {
    try {
      setTodoLoading(id, true);
      await todoService.updateTodo(id, {
        [keyValue]: newData,
      });

      setTodos(prev =>
        prev.map(currentTodo =>
          id === currentTodo.id
            ? { ...currentTodo, [keyValue]: newData }
            : currentTodo,
        ),
      );
    } catch (error) {
      showError(Update);
      throw error;
    } finally {
      setTodoLoading(id, false);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          showError={showError}
          onAdd={onAdd}
          isLoading={isLoading}
          todos={todos}
          inputRef={inputRef}
        />

        <TodoList
          todos={displayedTodos}
          onDelete={onDelete}
          updateTodo={updateTodo}
          todoLoadingStates={todoLoadingStates}
        />

        {tempTodo && (
          <div className="temp-todo">
            <TodoItem
              todo={tempTodo}
              onDelete={onDelete}
              updateTodo={updateTodo}
              todoLoadingStates={{ 0: true }}
            />
          </div>
        )}

        {!!todos.length && (
          <Footer
            setFilter={setFilter}
            filter={filter}
            todos={todos}
            onDelete={onDelete}
          />
        )}
      </div>

      <ErrorBox
        errorMessage={errorMessage}
        onClearError={() => {
          setErrorMassage(None);
        }}
      />
    </div>
  );
};
