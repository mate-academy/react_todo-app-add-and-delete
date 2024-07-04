/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deleteTodo, getTodos, makeTodo } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Errors } from './components/Errors/Errors';
import { TodoStatus } from './types/TodoStatus';
import { Error } from './types/Error';
import { getVisibleTodos } from './utils/getVisibleTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.all);
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(Error.UnableLoadTodo));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeout = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timeout);
  }, [error]);

  const titleField = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (titleField.current) {
      titleField.current?.focus();
    }
  }, [todos]);

  const handleAddTodo = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimTitle = title.trim();

    if (!trimTitle) {
      setError(Error.EmptyTodoTitle);

      return;
    }

    if (titleField.current) {
      titleField.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: trimTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodos(current => [...current, 0]);

    makeTodo(newTodo)
      .then(newTodoFromServer => {
        setTodos(currentTodos => [...currentTodos, newTodoFromServer]);
        setTitle('');
      })
      .catch(() => setError(Error.UnableAddTodo))
      .finally(() => {
        if (titleField.current) {
          titleField.current.disabled = false;
          titleField.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setError(Error.UnableDeleteTodo))
      .finally(() => {
        setLoadingTodos(current =>
          current.filter(removedTodoId => todoId !== removedTodoId),
        );
      });
  };

  const completedTodos = getVisibleTodos(todos, status);

  const deleteAllCompleted = () => {
    const completedTodoIds = completedTodos.map(todo => todo.id);

    const requests: Promise<unknown>[] = [];

    completedTodoIds.forEach(todoId => requests.push(deleteTodo(todoId)));

    setLoadingTodos(current => [...current, ...completedTodoIds]);
    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleAddTodo={handleAddTodo}
          titleField={titleField}
          title={title}
          setTitle={setTitle}
        />

        <TodoList
          visibleTodos={todos}
          tempTodo={tempTodo}
          status={status}
          onDelete={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            status={status}
            setStatus={setStatus}
            onRemoveTodo={deleteAllCompleted}
          />
        )}
      </div>

      <Errors error={error} setError={setError} />
    </div>
  );
};
