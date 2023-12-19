import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, postTodo } from './api/todos';
import { ErrorInfo } from './components/Errorinfo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';
import { NoIdTodo, Todo } from './types/Todo';
import { filterTodos } from './helper';

const USER_ID = 12017;

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    FilterType.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMsg, setErrorMsg] = useState<ErrorType | null>(null);

  const showError = (error: ErrorType) => {
    setErrorMsg(error);
    setTimeout(() => setErrorMsg(null), 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => showError(ErrorType.TodosNotLoaded));
  }, []);

  const createNewTodo = (title: string): Promise<void> => {
    const newTodo: NoIdTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    return postTodo(newTodo)
      .then(
        (response) => setTodosFromServer(
          currentTodos => [...currentTodos, response],
        ),
      )
      .catch(() => {
        showError(ErrorType.NotAddable);

        throw new Error(ErrorType.NotAddable);
      })
      .finally(() => setTempTodo(null));
  };

  const removeTodo = (todoToDelete: Todo) => {
    return deleteTodo(todoToDelete.id)
      .then(() => setTodosFromServer(
        currentTodos => currentTodos.filter(todo => todo !== todoToDelete),
      ))
      .catch(() => showError(ErrorType.NotDeletable));
  };

  const clearCompleted = () => {
    const completedTodos = todosFromServer.filter(todo => todo.completed);

    completedTodos.forEach(completedTodo => {
      deleteTodo(completedTodo.id)
        .then(() => setTodosFromServer(
          currentTodos => currentTodos.filter(todo => todo !== completedTodo),
        ))
        .catch(() => showError(ErrorType.NotDeletable));
    });
  };

  const todosToView = useMemo(
    () => filterTodos(todosFromServer, selectedFilter),
    [todosFromServer, selectedFilter],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosFromServer={todosFromServer}
          createNewTodo={createNewTodo}
          errorFound={showError}
        />

        <TodoList
          todosToView={todosToView}
          deleteTodo={removeTodo}
          tempTodo={tempTodo}
        />

        {todosFromServer.length > 0 && (
          <Footer
            todosFromServer={todosFromServer}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorInfo errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
    </div>
  );
};
