import React, {
  useEffect, useState, useMemo, useRef,
} from 'react';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todos } from './components/Todos';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

import { getTodos, postTodos, deleteTodos } from './api/todos';

import { Todo } from './types/Todo';
import { FilteredBy } from './types/FilteredBy';

const USER_ID = 9964;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [filteredBy, setFilteredBy] = useState<FilteredBy>(FilteredBy.All);
  const [isCompletedPresent, setCompletedPresent] = useState(false);
  const [isErrorPresent, setErrorPresent] = useState(false);
  const [isLoadingError, setLoadingError] = useState(false);
  const [isAddTodoError, setAddTodoError] = useState(false);
  const [isTodoDeleteError, setTodoDeleteError] = useState(false);
  const [isTitleEmpty, setTitleEmpty] = useState(false);
  const [isTodoAdded, setTodoAdded] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deleteTodosId, setDeleteTodosId] = useState<number[]>([]);
  const timerId = useRef(0);
  const newTodo = {
    title: newTodoTitle,
    userId: USER_ID,
    completed: false,
  };

  function showError(
    targetSetFunction: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    targetSetFunction(true);
    setErrorPresent(true);
    timerId.current = window.setTimeout(() => {
      setErrorPresent(false);
      targetSetFunction(false);
    }, 3000);
  }

  async function getTodoList() {
    setDataLoaded(false);
    setLoadingError(false);

    try {
      const todoList = await getTodos(USER_ID);

      setTodos(todoList);
      setCompletedPresent(todoList.some(todo => todo.completed));
    } catch (error) {
      showError(setLoadingError);
    } finally {
      setDataLoaded(true);
    }
  }

  const postNewTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddTodoError(false);

    if (newTodoTitle !== '') {
      setTodoAdded(true);
      try {
        const todo = await postTodos(USER_ID, newTodo);

        setTodos((currTodo) => {
          if (currTodo) {
            return currTodo.concat(todo);
          }

          return todo;
        });
      } catch (error) {
        showError(setAddTodoError);
      } finally {
        setTodoAdded(false);
      }
    } else {
      showError(setTitleEmpty);
    }
  };

  const removeTodo = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const targetId = event.currentTarget.parentElement?.id || 0;
    const deletedTodo = todos?.find(todo => todo.id === +targetId);

    setTodoDeleteError(false);

    try {
      setDeleteTodosId(currIds => {
        return [...currIds, deletedTodo?.id || 0];
      });
      await deleteTodos(deletedTodo?.id || 0);
      setTodos(todos?.filter(todo => todo.id !== +targetId) || null);
    } catch (error) {
      showError(setTodoDeleteError);
    } finally {
      setDeleteTodosId((currIds: number[]) => {
        return currIds.filter((id: number) => id !== targetId);
      });
    }
  };

  const clearCompleted = async () => {
    const todosForDeleting: Promise<unknown>[] = [];
    const completedTodoIds: number[] = [];

    todos?.forEach(todo => {
      if (todo.completed) {
        todosForDeleting.push(deleteTodos(todo.id));
        completedTodoIds.push(todo.id);
      }
    });

    setTodoDeleteError(false);

    try {
      setDeleteTodosId(currIds => currIds.concat(completedTodoIds));
      await Promise.all(todosForDeleting);

      setTodos(todos?.filter(todo => !todo.completed) || null);
    } catch (error) {
      showError(setTodoDeleteError);
    } finally {
      setDeleteTodosId([]);
    }

    setCompletedPresent(false);
  };

  const visibleTodos = useMemo(() => {
    if (!todos) {
      return null;
    }

    switch (filteredBy) {
      case FilteredBy.All:
        return todos;

      case FilteredBy.Completed:
        return todos.filter(todo => todo.completed);

      case FilteredBy.Active:
        return todos.filter(todo => !todo.completed);

      default:
        return null;
    }
  }, [filteredBy, todos]);

  useEffect(() => {
    getTodoList();
  }, []);

  const setFilter = (value: FilteredBy) => {
    setFilteredBy(value);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.currentTarget.value);
  };

  const removeNotification = () => {
    setErrorPresent(false);
    setLoadingError(false);
    setAddTodoError(false);
    setTodoDeleteError(false);
    setTitleEmpty(false);
    window.clearTimeout(timerId.current);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          handleInput={handleInput}
          postNewTodo={postNewTodo}
        />

        {!!todos?.length && isDataLoaded && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <Todos
                todos={visibleTodos}
                newTodoTitle={newTodoTitle}
                isTodoAdded={isTodoAdded}
                removeTodo={removeTodo}
                deleteTodosId={deleteTodosId}
              />
            </section>

            <Footer
              setFilter={setFilter}
              filteredBy={filteredBy}
              todoAmount={todos?.length}
              isCompletedPresent={isCompletedPresent}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <Notification
        isErrorPresent={isErrorPresent}
        isLoadingError={isLoadingError}
        isAddTodoError={isAddTodoError}
        isTodoDeleteError={isTodoDeleteError}
        isTitleEmpty={isTitleEmpty}
        removeNotification={removeNotification}
      />
    </div>
  );
};
