/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { TodoAppHeader } from './components/TodoAppHeader';
import { TodoAppFooter } from './components/TodoAppFooter';
import { ErrorNotification } from './components/ErrorNotification';

import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { FilterLink, preparedTodos } from './utils/TodoFilter';
import { ErrorMessage } from './utils/errorMessages';
import { TodoAppRow } from './components/TodoAppRow/TodoAppRow';
import { TempTodo } from './components/TodoAppRow';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterLink.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.Default);
  const [isRequesting, setIsRequesting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    todoService.getTodos(todoService.USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.Default);
    }, 3000);
  }, [errorMessage]);

  const handleAddTodo = (todoTitle: string): Promise<void> => {
    setTempTodo({
      id: 0,
      userId: todoService.USER_ID,
      title: todoTitle,
      completed: false,
    });

    setIsRequesting(true);

    return todoService
      .addTodo(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
      })
      .finally(() => {
        setIsRequesting(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoading(true);

    todoService
      .deleteTodo(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
        setLoading(false);
      }))
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
        setLoading(false);
      });
  };

  const handleUpdateTodo = (todo: Todo, newTodoTitle: string) => {
    todoService
      .updateTodo({
        id: todo.id,
        title: newTodoTitle,
        userId: todo.userId,
        completed: todo.completed,
      })
      .then(updatedTodo => {
        setTodos(prevState => prevState.map(currentTodo => (
          currentTodo.id !== updatedTodo.id
            ? currentTodo
            : updatedTodo
        )));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
        throw new Error();
      });
  };

  const handleCompletedChange = (todoId: number) => {
    setTodos((prevTodos) => prevTodos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    }));
  };

  const handleDeleteAllCompletedTodos = async () => {
    const completedTodosId = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    completedTodosId.forEach((id) => handleDeleteTodo(id));
  };

  const visibleTodos = preparedTodos(todos, selectedFilter);
  const todosCounter = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const todosCounterCompleted = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          todos={visibleTodos}
          onTodoAdd={handleAddTodo}
          setErrorMessage={setErrorMessage}
          isRequesting={isRequesting}
        />

        {Boolean(todos.length) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map((todo: Todo) => (
                <TodoAppRow
                  todo={todo}
                  key={todo.id}
                  isLoading={loading}
                  selectedTodo={selectedTodo}
                  setSelectedTodo={setSelectedTodo}
                  onChangeBox={handleCompletedChange}
                  onTodoDelete={handleDeleteTodo}
                  onTodoUpdate={(todoTitle) => (
                    handleUpdateTodo(todo, todoTitle)
                  )}
                />
              ))}

              {tempTodo && (
                <TempTodo todo={tempTodo} />
              )}
            </section>

            <TodoAppFooter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              todosCounter={todosCounter}
              completedSum={todosCounterCompleted}
              deleteAllComleted={handleDeleteAllCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};
