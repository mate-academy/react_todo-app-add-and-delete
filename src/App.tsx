/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  USER_ID,
} from './api/todos';
import { ErrorMessage, FilterStatus, Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Error } from './components/Error';

export const App: React.FC = () => {
  const [selectedTodo, setSelectedTodo] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.DEFAULT);
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [todoStatus, setTodoStatus] = useState(FilterStatus.ALL);
  const [isLoading, setIsLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteId, setDeleteId] = useState<number[]>([]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(ErrorMessage.DEFAULT);

    getTodos()
      .then((todos: Todo[]) => {
        setSelectedTodo(todos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.DEFAULT);
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const visibleTodos = selectedTodo.filter(todo => {
    switch (todoStatus) {
      case FilterStatus.ACTIVE:
        return !todo.completed;
      case FilterStatus.COMPLETED:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleFilterChange = (newTodoStatus: FilterStatus) => {
    setTodoStatus(newTodoStatus);
  };

  useEffect(() => {
    if (errorMessage !== ErrorMessage.DEFAULT) {
      setIsErrorVisible(true);

      const timer = setTimeout(() => {
        setErrorMessage(ErrorMessage.DEFAULT);
        setIsErrorVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleHideError = () => {
    setErrorMessage(ErrorMessage.DEFAULT);
    setIsErrorVisible(false);
  };

  const handleAddTodo = (title: string) => {
    if (!title.trim()) {
      setErrorMessage(ErrorMessage.TITLE);

      return;
    }

    setIsLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    setTempTodo(newTodo);

    return addTodo(newTodo)
      .then(todo => {
        setSelectedTodo(prev => [...prev, todo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.ADD);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeleteId(ids => [...ids, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setSelectedTodo(prevTodos =>
          prevTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETE);

        setTimeout(() => {
          setErrorMessage(ErrorMessage.DEFAULT);
        }, 3000);
      })
      .finally(() => {
        setDeleteId(ids => ids.filter(i => i !== todoId));
      });
  };

  const handleToggleTodo = (id: number) => {
    setDeleteId(prevIds => [...prevIds, id]);

    const toggledTodo = selectedTodo.find(todo => todo.id === id);

    if (!toggledTodo) {
      return;
    }

    return toggleTodo(id, !toggledTodo.completed)
      .then(() => {
        setSelectedTodo(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UPDATE);
      })
      .finally(() => {
        setDeleteId(prevIds => prevIds.filter(todoId => todoId !== id));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          onAddTodo={handleAddTodo}
          isLoading={isLoading}
          selectedTodo={selectedTodo}
          handleToggleTodo={handleToggleTodo}
        />

        {!!selectedTodo.length && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {!errorMessage && !!visibleTodos.length && (
                <TodoList
                  visibleTodos={visibleTodos}
                  onDelete={handleDeleteTodo}
                  deleteId={deleteId}
                  tempTodo={tempTodo}
                  onToggle={handleToggleTodo}
                />
              )}
            </section>
            <Footer
              selectedTodo={selectedTodo}
              todoStatus={todoStatus}
              handleFilterChange={handleFilterChange}
              handleDeleteTodo={handleDeleteTodo}
            />
          </>
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        onHideError={handleHideError}
        isVisible={isErrorVisible}
      />
    </div>
  );
};
