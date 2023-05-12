/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { Errors } from './types/Errors';
import { FilterType } from './types/FilterType';

const USER_ID = 10209;

const todosFromServer = (todos: Todo[], filterType: string) => {
  switch (filterType) {
    case FilterType.ALL:
      return todos;

    case FilterType.ACTIVE:
      return todos.filter((todo) => !todo.completed);

    case FilterType.COMPLETED:
      return todos.filter((todo) => todo.completed);

    default:
      return [];
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors>(Errors.NONE);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Errors.UPLOAD));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todosFromServer(todos, filterType);

  const handleError = (e: Errors) => {
    setError(e);
    setTimeout(() => {
      setError(Errors.NONE);
    }, 3000);
  };

  const handleAddTodo = async (value: string) => {
    if (!value) {
      setError(Errors.EMPTY);
      setTimeout(() => {
        setError(Errors.NONE);
      }, 3000);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    const postedTodo = await postTodo(USER_ID, newTodo);

    setTodos((prev: Todo[]) => {
      return [...prev, postedTodo];
    });
    setTempTodo(null);
    setTitle('');
  };

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(USER_ID, todoId)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => setError(Errors.DELETE));
  };

  const handleClearCompleted = () => {
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(completedTodoIds.map(id => deleteTodo(USER_ID, id)))
      .then(() => setTodos(todos.filter(todo => !todo.completed)))
      .catch(() => setError(Errors.DELETE));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasSomeTodos={!!todos.length}
          onChangeIsError={handleError}
          onSubmitAddTodo={handleAddTodo}
          titleTodo={title}
          onChangeTitle={setTitle}
        />

        <TodoList
          tempTodo={tempTodo}
          todos={visibleTodos}
          onChangeIsError={handleError}
          onDelete={handleDeleteTodo}
          changeTodo={setTodos}
        />

        {!!todos.length && (
          <Footer
            todos={visibleTodos}
            filterType={filterType}
            setFilterType={setFilterType}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {error
        && (
          <div
            className={
              classNames(
                'notification is-danger is-light has-text-weight-normal',
                { hidden: !error },
              )
            }
          >
            <button
              type="button"
              className="delete"
              onClick={() => setError(Errors.NONE)}
            />
            {error}
          </div>
        )}
    </div>
  );
};
