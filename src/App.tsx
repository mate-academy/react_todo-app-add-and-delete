/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { TodoType } from './types/Todo.type';
import { ErrorsEnum } from './utils/ErrorsEnum';
import { Error } from './components/Error/Error';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { FiltersEnum } from './utils/FiltersEnum';

export const App: React.FC = () => {
  const [todoList, setTodosList] = useState<TodoType[]>([]);
  const [tempTodo, setTempTodo] = useState<TodoType | null>(null);
  const [error, setError] = useState<ErrorsEnum | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isClearDisabled, setIsClearDisabled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FiltersEnum>(
    FiltersEnum.All,
  );

  const filteredTodoList = useMemo<TodoType[]>(() => {
    return todoList.filter(todo => {
      switch (selectedFilter) {
        case FiltersEnum.Active:
          return !todo.completed;
        case FiltersEnum.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todoList, selectedFilter]);

  const itemsLeft = useMemo(() => {
    return todoList.filter(todo => !todo.completed).length;
  }, [todoList]);

  const updateClearDisabled = useCallback(() => {
    setIsClearDisabled(!todoList.some(todo => todo.completed));
  }, [todoList]);

  useEffect(() => {
    setTimeout(() => setError(null), 3000);
  }, [error]);

  useEffect(() => {
    todosService
      .getTodos()
      .then(todos => {
        setTodosList(todos);
        updateClearDisabled();
      })
      .catch(() => {
        setError(ErrorsEnum.UNABLE_LOAD_TODOS);
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
      })
      .catch(() => {
        setError(ErrorsEnum.UANBLE_DELETE_TODO);
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

  const addTodo = () => {
    const title = inputValue.trim();

    if (title === '') {
      setError(ErrorsEnum.TITLE_IS_EMPTY);
      setIsEnabled(true);

      return;
    }

    setTempTodo({
      id: 0,
      userId: 0,
      title: title,
      completed: false,
    });

    todosService
      .createTodos(title)
      .then(newTodo => {
        setTodosList(currentTodos => [...currentTodos, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setError(ErrorsEnum.UNABLE_ADD_TODO);
      })
      .finally(() => {
        setTempTodo(null);
        setIsEnabled(true);
      });
  };

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

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
            isClearDisabled={isClearDisabled}
            itemsLeft={itemsLeft}
            clearCompleted={handleClearCompleted}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
          />
        )}
      </div>

      <Error error={error} clearError={setError} />
    </div>
  );
};
