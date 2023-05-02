import React, { useEffect, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Todos } from './components/Todos';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

import { getTodos, postTodos, deleteTodo } from './api/todos';

import { Todo } from './types/Todo';
import { FilteredBy } from './types/FilteredBy';

const USER_ID = 9964;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [filteredBy, setFilteredBy] = useState<FilteredBy>(FilteredBy.All);
  const [isLoadingError, setLoadingError] = useState(false);
  const [isAddTodoError, setAddTodoError] = useState(false);
  const [isTodoDeleteError, setTodoDeleteError] = useState(false);
  const [isTitleEmpty, setTitleEmpty] = useState(false);
  const [isTodoAdded, setTodoAdded] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [deleteTodosId, setDeleteTodosId] = useState<number[]>([]);
  const newTodo = {
    id: 0,
    title: newTodoTitle,
    userId: USER_ID,
    completed: false,
  };

  async function getTodoList() {
    try {
      const todoList = await getTodos(USER_ID);

      setTodos(todoList);
    } catch (error) {
      setLoadingError(true);
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

        setNewTodoTitle('');
      } catch (error) {
        setAddTodoError(true);
      } finally {
        setTodoAdded(false);
      }
    } else {
      setTitleEmpty(true);
    }
  };

  const removeTodo = async (targetId: number) => {
    const deletedTodo = todos?.find(todo => todo.id === targetId);

    setTodoDeleteError(false);

    try {
      setDeleteTodosId(currIds => {
        return [...currIds, deletedTodo?.id || 0];
      });
      await deleteTodo(deletedTodo?.id || 0);
      setTodos(todos?.filter(todo => todo.id !== +targetId) || null);
    } catch (error) {
      setTodoDeleteError(true);
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
        todosForDeleting.push(deleteTodo(todo.id));
        completedTodoIds.push(todo.id);
      }
    });

    setTodoDeleteError(false);

    try {
      setDeleteTodosId(currIds => currIds.concat(completedTodoIds));
      await Promise.all(todosForDeleting);

      setTodos(todos?.filter(todo => !todo.completed) || null);
    } catch (error) {
      setTodoDeleteError(true);
    } finally {
      setDeleteTodosId([]);
    }
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

  const setFilter = (value: FilteredBy) => {
    setFilteredBy(value);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.currentTarget.value);
  };

  const removeNotification = () => {
    setLoadingError(false);
    setAddTodoError(false);
    setTodoDeleteError(false);
    setTitleEmpty(false);
  };

  useEffect(() => {
    getTodoList();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoadingError(false);
      setTitleEmpty(false);
      setAddTodoError(false);
      setTodoDeleteError(false);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isLoadingError, isTitleEmpty, isAddTodoError, isTodoDeleteError]);

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
          isTodoAdded={isTodoAdded}
        />

        {!!todos?.length && (
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
              isCompletedPresent={todos.some(todo => todo.completed)}
              clearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <Notification
        isLoadingError={isLoadingError}
        isAddTodoError={isAddTodoError}
        isTodoDeleteError={isTodoDeleteError}
        isTitleEmpty={isTitleEmpty}
        removeNotification={removeNotification}
      />
    </div>
  );
};
