import React, {
  useCallback,
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

const USER_ID = 12017;

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    FilterType.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMsg, setErrorMsg] = useState<ErrorType | null>(null);

  const errorFound = (error: ErrorType) => {
    setErrorMsg(error);
    setTimeout(() => setErrorMsg(null), 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => errorFound(ErrorType.TodosNotLoaded));
  }, []);

  const createNewTodo = (title: string) => {
    if (!title) {
      errorFound(ErrorType.TitleEmpty);

      return;
    }

    const newTodo: NoIdTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    postTodo(newTodo)
      .then(
        (response) => setTodosFromServer(
          currentTodos => [...currentTodos, response],
        ),
      )
      .catch(() => errorFound(ErrorType.NotAddable))
      .finally(() => setTempTodo(null));
  };

  const removeTodo = (todoToDelete: Todo) => {
    deleteTodo(todoToDelete.id)
      .then(() => setTodosFromServer(
        currentTodos => currentTodos.filter(todo => todo !== todoToDelete),
      ))
      .catch(() => errorFound(ErrorType.NotDeletable));
  };

  const clearCompleted = () => {
    const completedTodos = todosFromServer.filter(todo => todo.completed);

    completedTodos.forEach(completedTodo => {
      deleteTodo(completedTodo.id)
        .then(() => setTodosFromServer(
          currentTodos => currentTodos.filter(todo => todo !== completedTodo),
        ))
        .catch(() => errorFound(ErrorType.NotDeletable));
    });
  };

  const filterTodos = useCallback(
    (todos: Todo[]) => {
      switch (selectedFilter) {
        case FilterType.All:
          return todos;

        case FilterType.Active:
          return todos.filter(todo => !todo.completed);

        case FilterType.Completed:
          return todos.filter(todo => todo.completed);

        default:
          return todos;
      }
    },
    [selectedFilter],
  );

  const todosToView = useMemo(
    () => filterTodos(todosFromServer),
    [filterTodos, todosFromServer],
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
