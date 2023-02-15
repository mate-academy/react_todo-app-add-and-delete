import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';

import { postTodos, getTodos, deleteTodos } from './api/todos';
import { ErrorType } from './types/ErrorType';
import { Filter } from './types/Filter';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodosList/TodosList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/Error/Error';

import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [filterType, setFilterType] = useState(Filter.all);
  const [isCreating, setIscreating] = useState(false);
  const [title, setTitle] = useState('');
  const [typeOfError, setTypeOfError] = useState(ErrorType.success);
  const [processings, setProcessings] = useState<number[]>([0]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadingTodosApi = () => {
    const handleRequest = (todoList: Todo[]) => {
      setTodos(todoList);
      setTypeOfError(ErrorType.success);
    };

    if (user) {
      getTodos(user.id)
        .then(list => handleRequest(list))
        .catch(() => setTypeOfError(ErrorType.get));
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    loadingTodosApi();
  }, [user]);

  useEffect(() => {
    const timeoutID = setTimeout(() => setTypeOfError(ErrorType.success), 3000);

    return () => {
      clearTimeout(timeoutID);
    };
  });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitle(value);
  };

  const listModified = (type: Filter) => {
    switch (type) {
      case Filter.active:
        return todos.filter(item => !item.completed);
      case Filter.completed:
        return todos.filter(item => item.completed);
      default:
        return todos;
    }
  };

  const uploadTodos = (newTodo: Todo) => {
    setTodos([
      ...todos,
      newTodo,
    ]);

    setTitle('');
    setIsInputDisabled(false);
    setIscreating(false);
  };

  const failResponse = () => {
    setTypeOfError(ErrorType.post);
    setIscreating(false);
    setIsInputDisabled(false);
  };

  const handleSubmit
  = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.length) {
      setTypeOfError(ErrorType.emptyTitle);

      return;
    }

    setIsInputDisabled(true);
    setIscreating(true);

    const data = {
      title,
      userId: user?.id,
      completed: false,
    };

    if (user) {
      postTodos(data)
        .then((response) => uploadTodos(response))
        .catch(failResponse);
    }
  };

  const addProcessing = (id: number) => {
    setProcessings(currentProc => [
      ...currentProc,
      id,
    ]);
  };

  const deleteProcessing = () => {
    setProcessings(currentProcessings => currentProcessings.slice(0, -1));
  };

  const handleDelete = (id: number) => {
    const deleteTodo = () => {
      setTodos(prevTodos => prevTodos.filter(item => item.id !== id));
    };

    addProcessing(id);

    if (user) {
      deleteTodos(id)
        .then(() => deleteTodo())
        .catch(() => setTypeOfError(ErrorType.delete))
        .finally(() => deleteProcessing());
    }
  };

  const errorDisable = () => {
    setTypeOfError(ErrorType.success);
  };

  const deleteCompletedTodos = () => {
    listModified(Filter.completed).forEach(todo => handleDelete(todo.id));
  };

  const activeTodos = listModified(Filter.active).length;
  const completedTodos = listModified(Filter.completed).length;
  const todosFiltered = listModified(filterType);

  if (!user?.id) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onHandleSubmit={handleSubmit}
          onHandleInput={handleInput}
          isDisabled={isInputDisabled}
          newTodoField={newTodoField}
          inputValue={title}
        />
        <TodoList
          onDelete={handleDelete}
          todos={todosFiltered}
          creating={isCreating}
          title={title}
          processings={processings}
        />
        {!!todos.length && (
          <Footer
            onSetFilterType={setFilterType}
            onDeleteCompletedTodos={deleteCompletedTodos}
            completedTodos={completedTodos}
            activeTodos={activeTodos}
            filterType={filterType}
          />
        )}
      </div>

      <Error
        onErrorDisable={errorDisable}
        errorType={typeOfError}
      />
    </div>
  );
};
