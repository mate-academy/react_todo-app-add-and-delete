import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  getTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempTodos, setTempTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.all);
  const [inProcess, setInProcess] = useState<number[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todosFromServer.length, isLoading]);

  useEffect(() => {
    setError('');
    getTodos()
      .then(setTodosFromServer)
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  const displayedTodos = useMemo(() => {
    const { active, completed } = Filter;
    const allTodos = [...todosFromServer, ...tempTodos];

    switch (filter) {
      case active:
        return allTodos.filter(todo => !todo.completed);

      case completed:
        return allTodos.filter(todo => todo.completed);

      default:
        return allTodos;
    }
  }, [todosFromServer, tempTodos, filter]);

  const activeTodosLeft = useMemo(
    () => todosFromServer.filter(todo => !todo.completed).length,
    [todosFromServer],
  );

  const completedTask = todosFromServer.length > 0 && activeTodosLeft === 0;
  const completedTodos = todosFromServer.filter(todo => todo.completed);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const tempTodo: Todo = {
        id: 0,
        title: newTodo,
        userId: USER_ID,
        completed: false,
      };

      setInProcess(prev => [...prev, tempTodo.id]);
      setTempTodos([...tempTodos, tempTodo]);
      setIsLoading(true);

      addTodo({
        title: newTodo.trim(),
        userId: USER_ID,
        completed: false,
      })
        .then((addedTodo: Todo) => {
          setTodosFromServer(prevTodos => [...prevTodos, addedTodo]);
          setTempTodos(prevTempTodos =>
            prevTempTodos.filter(todo => todo.id !== tempTodo.id),
          );
          setNewTodo('');
        })
        .catch(() => {
          setError('Unable to add a todo');
          setTimeout(() => setError(''), 3000);
          setTempTodos(prevTempTodos =>
            prevTempTodos.filter(todo => todo.id !== tempTodo.id),
          );
        })
        .finally(() => {
          setIsLoading(false);
          setTodosFromServer(prevTodos =>
            prevTodos.filter(todo => todo.id !== tempTodo.id),
          );
        });
    } else {
      setError('Title should not be empty');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleOnDelete = (todoId: number) => {
    setInProcess(prevInProcess => [...prevInProcess, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodosFromServer(toDoState =>
          toDoState.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setInProcess(prevInProcess =>
          prevInProcess.filter(id => id !== todoId),
        );
      });
  };

  const handleUpdate = (todoId: number, data: Partial<Todo>) => {
    setInProcess(prevInProcess => [...prevInProcess, todoId]);
    updateTodo(todoId, data)
      .then(() =>
        setTodosFromServer(current =>
          current.map(todo =>
            todo.id === todoId ? { ...todo, ...data } : todo,
          ),
        ),
      )
      .catch(() => {
        setError('Unable to update a Todo');
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setInProcess(prevInProcess =>
          prevInProcess.filter(id => id !== todoId),
        );
      });
  };

  const deleteAllCompleted = () => {
    completedTodos.forEach(todo => handleOnDelete(todo.id));
  };

  const handleHideError = useCallback(() => {
    setError('');
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          completedTask={completedTask}
          handleChange={handleChange}
          handleAddTodo={handleAddTodo}
          todoTitle={newTodo}
          isLoading={isLoading}
          todos={todosFromServer}
          inputRef={inputRef}
        />
        <TodoList
          todos={displayedTodos}
          deleteTodo={handleOnDelete}
          processings={inProcess}
          updateTodo={handleUpdate}
        />

        {!!todosFromServer.length && (
          <TodoFilter
            filter={filter}
            setFilter={setFilter}
            activeTodosCount={activeTodosLeft}
            areThereCompletedTodos={completedTodos.length > 0}
            clearCompletedTodos={deleteAllCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleHideError}
        />
        {error}
      </div>
    </div>
  );
};
