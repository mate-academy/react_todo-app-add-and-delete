import React,
{
  useState, useEffect, useMemo, useCallback, useContext,
} from 'react';
import { Todo } from './types/Todo';
import { filterTodos } from './helpers/filterTodos';
import { FilterType } from './enums/FilterType';
import { ErrorType } from './enums/ErrorType';
import { getTodos, deleteTodo } from './api/todos';
import Footer from './components/Footer';
import Header from './components/Header';
import ErrorNotification from './components/ErrorNotification';
import TodoList from './components/TodoList';
import { UserIdContext } from './context/UserIdConext';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFiter, setSelectedFiter] = useState(FilterType.all);
  const [errorType, setErrorType] = useState(ErrorType.none);
  const [isErrorShow, setIsErrorShow] = useState(false);
  const [tempTodoTitle, setTempTodoTitle] = useState('');
  const [isClearCompleted, setIsClearCompleted] = useState(false);

  const userId = useContext(UserIdContext);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch {
        setErrorType(ErrorType.download);
        setIsErrorShow(true);
      }
    };

    getTodosFromServer();
  }, []);

  const filteredTodos = useMemo(
    () => filterTodos(todos, selectedFiter),
    [selectedFiter, todos],
  );

  const activeTodosNum = useMemo(
    () => todos.reduce((num, todo) => {
      return todo.completed ? num : num + 1;
    }, 0),
    [todos],
  );

  const completedTodosNum = todos.length - activeTodosNum;

  const showError = useCallback((error: ErrorType) => {
    setErrorType(error);
    setIsErrorShow(true);
  }, []);

  const hideError = useCallback(() => {
    setIsErrorShow(false);
  }, []);

  const onAddTodo = useCallback(
    (newTodo: Todo): void => setTodos((oldTodos) => [...oldTodos, newTodo]),
    [],
  );

  const onDeleteTodo = useCallback(
    (todoId: number): void => (
      setTodos((oldTodos) => oldTodos.filter((todo) => todo.id !== todoId))
    ),
    [],
  );

  const onClearCompleted = useCallback(() => {
    const completedTodos = filterTodos(todos, FilterType.completed);

    setIsClearCompleted(true);
    hideError();

    Promise.all(
      completedTodos.map((todo) => deleteTodo(todo.id).then(() => todo.id)),
    )
      .then((idx) => {
        setTodos((oldTodos) => {
          return oldTodos.filter((todo) => !idx.includes(todo.id));
        });
      })
      .catch(() => {
        showError(ErrorType.delete);
      })
      .finally(() => {
        setIsClearCompleted(false);
      });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodosNum={activeTodosNum}
          showError={showError}
          hideError={hideError}
          showTempTodo={setTempTodoTitle}
          addNewTodo={onAddTodo}
        />

        <TodoList
          todos={filteredTodos}
          tempTodoTitle={tempTodoTitle}
          showError={showError}
          hideError={hideError}
          onDeleteTodo={onDeleteTodo}
          isClearCompleted={isClearCompleted}
        />

        {todos && (
          <Footer
            activeTodosNum={activeTodosNum}
            completedTodosNum={completedTodosNum}
            selectedFiter={selectedFiter}
            onSelectedFilter={setSelectedFiter}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorType={errorType}
        isErrorShown={isErrorShow}
        onCloseErrorNotification={hideError}
      />
    </div>
  );
};
