/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { useEffect, useRef, useState } from 'react';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Todo } from './types/Todo';
import { TodoStatusFilter } from './types/TodoStatusFilter';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Notification } from './components/Notifications/Notifications';
import {
  todoErrorMessageText,
  TodoErrorMessage,
  USER_ID,
  todoServices,
} from './api/todos';
import { CreateTodoForm } from './components/CreateTodoForm/CreateTodoForm';
import { TodoCreate } from './types/TodoCreate';

const getfilteredTodos = (
  todos: Todo[],
  { status }: { status: TodoStatusFilter },
) => {
  let filteredTodos = [...todos];

  if (status !== TodoStatusFilter.all) {
    filteredTodos = filteredTodos.filter(todo => {
      if (status === TodoStatusFilter.completed) {
        return todo.completed;
      }

      return !todo.completed;
    });
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<Todo['id'][]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>(
    TodoStatusFilter.all,
  );

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const todoInputTitleRef = useRef<HTMLInputElement>(null);

  const handleAddTodoIdToloading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);
  };

  const handleRemoveTodoIdFromloading = (todoId: Todo['id']) => {
    setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
  };

  const getIsTodoLoading = (todoId: Todo['id']) =>
    loadingTodoIds.includes(todoId);

  const handleHideError = () => setErrorMessage('');

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(handleHideError, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    handleHideError();
    async function loadTodos() {
      try {
        const loadedTodos = await todoServices.getTodos();

        setTodos(loadedTodos);
      } catch {
        setErrorMessage(
          todoErrorMessageText[TodoErrorMessage.UNABLE_TO_LOAD_TODOS],
        );
      }
    }

    loadTodos();
  }, []);

  const handleAddTodo = async (
    createdNewTitle: string,
    clearTitle: () => void,
  ) => {
    if (!todoInputTitleRef.current) {
      return;
    }

    handleHideError();

    // if (createdNewTitle === '') {
    //   setErrorMessage(
    //     todoErrorMessageText[TodoErrorMessage.TITLE_SHOULD_NOT_BE_EMPTY],
    //   );
    // }

    const todoCreate: TodoCreate = {
      userId: USER_ID,
      title: createdNewTitle,
      completed: false,
    };

    const createTepmDodo = {
      id: 0,
      ...todoCreate,
    };

    todoInputTitleRef.current.disabled = true;

    setTempTodo(createTepmDodo);
    try {
      const newTodo: Todo = await todoServices.addTodo(todoCreate);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      clearTitle();
    } catch {
      setErrorMessage(
        todoErrorMessageText[TodoErrorMessage.UNABLE_TO_ADD_A_TODO],
      );
    } finally {
      setTempTodo(null);
      if (!todoInputTitleRef.current) {
        return;
      }

      todoInputTitleRef.current.disabled = false;
      todoInputTitleRef.current.focus();
    }
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    handleHideError();
    handleAddTodoIdToloading(todoId);
    try {
      await todoServices.deleteTodos(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(
        todoErrorMessageText[TodoErrorMessage.UNABLE_TO_DELETE_A_TODO],
      );
    } finally {
      handleRemoveTodoIdFromloading(todoId);
      if (!todoInputTitleRef.current) {
        return;
      }

      todoInputTitleRef.current.focus();
    }
  };

  const handleDeleteComplitedTodos = (todosComplited: Todo[]) => {
    todosComplited.forEach(todoComplited => handleDeleteTodo(todoComplited.id));
  };

  const onCompletedChange = (id: number) =>
    setTodos(currentTodos => {
      if (!currentTodos) {
        return [];
      }

      return currentTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      );
    });

  const visibleTodos = getfilteredTodos(todos, { status: statusFilter });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />
          <CreateTodoForm
            onSubmit={handleAddTodo}
            onError={setErrorMessage}
            ref={todoInputTitleRef}
          />
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onCompletedChange={onCompletedChange}
              onDelete={handleDeleteTodo}
              isLoading={getIsTodoLoading(todo.id)}
            />
          ))}
          {tempTodo && (
            <TodoItem
              todo={tempTodo}
              onCompletedChange={() => {}}
              onDelete={() => {}}
              isLoading
            />
          )}
        </section>
        {todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>
            <TodoFilter
              status={statusFilter}
              onStatusChange={setStatusFilter}
            />
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!completedTodos.length}
              onClick={() => handleDeleteComplitedTodos(completedTodos)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <Notification error={errorMessage} onHideError={handleHideError} />
    </div>
  );
};
