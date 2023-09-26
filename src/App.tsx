import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
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
} from './utils/constans';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterTodo, setFilterTodo] = useState(StatusState.All);

  const [processingTodoIds, setIsProcessingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleChangeFilter = (newElement: StatusState) => {
    setFilterTodo(newElement);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(UNLOADED_TODO);
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const handleAddTodo = (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      userId: 0,
      completed: false,
    });

    return todoService.addTodo(todoTitle)
      .then((newTodo) => {
        setTodos((prevTodos:Todo[]) => [...prevTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage(UNABLE_ADD_TODO);
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setIsProcessingTodoIds((prevTodoIds) => [...prevTodoIds, todoId]);
    todoService.deleteTodo(todoId)
      .then((() => {
        setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== todoId));
      }))
      .catch(() => {
        setErrorMessage(UNABLE_DELETE_TODO);
      })
      .finally(() => {
        setIsProcessingTodoIds(
          (prevTodoIds) => prevTodoIds.filter(id => id !== todoId),
        );
      });
  };

  const handleClearComletedTodo = () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        handleDeleteTodo(todo.id);
      });
  };

  const incompleteTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

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
          onTodoAddError={setErrorMessage}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              todo={todo}
              onTodoDelete={() => handleDeleteTodo(todo.id)}
              isProcessing={processingTodoIds.includes(todo.id)}
              // onTodoUpdate={(todoTitle) => handleUpdateTodo(todo, todoTitle)}
              key={todo.id}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              isProcessing
            />
          )}
        </section>

        { !!todos.length && (
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
              onClick={handleClearComletedTodo}
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
