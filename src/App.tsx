import classNames from 'classnames';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import { deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTodos, setCurrentTodos] = useState<Todo[]>([]);
  const [isErrorShow, setIsErrorShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState<number[]>([]);

  const onError = () => {
    setIsErrorShow(true);

    setTimeout(() => {
      setIsErrorShow(false);
    }, 3000);
  };

  const updateErrorMessage = (message: string) => {
    onError();
    setErrorMessage(message);
  };

  const loadingTodos = async () => {
    if (user) {
      try {
        setIsErrorShow(false);

        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch (error) {
        onError();
        setTodos([]);
      }
    }
  };

  const showFilteredTodos = (array: Todo[]) => {
    setCurrentTodos(array);
  };

  const addTodo = (todo: Todo) => {
    const newArray = [...todos, todo];

    setTodos(newArray);
  };

  const showTempTodo = (todo: Todo | null) => {
    setTempTodo(todo);
  };

  const removeTodo = (todoIds: number[]) => {
    const newArray = todos.filter(todo => !todoIds.includes(todo.id));

    setTodos(newArray);
  };

  const onTodoDelete = async (todoIds: number[]) => {
    try {
      setIsRemoving(true);
      setCurrentTodoId(todoIds);

      await Promise.all(
        todoIds.map(todoId => deleteTodo(todoId)),
      );

      removeTodo(todoIds);
      setIsRemoving(false);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      onError();
      setIsRemoving(false);
    }
  };

  useEffect(() => {
    loadingTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={updateErrorMessage}
          addTodo={addTodo}
          showTempTodo={showTempTodo}
          onError={onError}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={currentTodos}
              tempTodo={tempTodo}
              onTodoDelete={onTodoDelete}
              isRemoving={isRemoving}
              currentTodoId={currentTodoId}
            />

            <Footer
              todos={todos}
              showFilteredTodos={showFilteredTodos}
              onTodoDelete={onTodoDelete}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification', 'is-danger', 'is-light', 'has-text-weight-normal',
          { hidden: !isErrorShow },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="HideErrorButton"
          onClick={() => {
            setIsErrorShow(false);
          }}
        />

        {errorMessage}
      </div>
    </div>
  );
};
