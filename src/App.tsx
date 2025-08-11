/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './Header';
import { TodoElem } from './TodoElem';
import { Footer } from './Footer';
import { ErrorComponent } from './Error';
import { TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>(todos);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [selectedLink, setSelectedLink] = useState<string>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [titleForEditing, setTitleForEditing] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [savingIs, setSavingIds] = useState<number[]>([]);

  const titleField = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  function hideError() {
    setTimeout(() => setError(''), 3000);
  }

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(result => {
        setTodos(result);
      })
      .catch(() => {
        setError('Unable to load todos');
        hideError();
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoading && titleField.current) {
      titleField.current.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (editingId !== null) {
      const editingTodo = todos.find(todo => todo.id === editingId);

      if (editingTodo) {
        setTitleForEditing(editingTodo.title);
      }

      editInputRef.current?.focus();
    }
  }, [editingId, todos, isLoading]);

  function applyFilter(filter: string, source: Todo[]) {
    if (filter === 'completed') {
      setVisibleTodos(source.filter(x => x.completed));
    } else if (filter === 'active') {
      setVisibleTodos(source.filter(x => !x.completed));
    } else {
      setVisibleTodos(source);
    }
  }

  useEffect(() => {
    applyFilter(selectedLink, todos);
  }, [selectedLink, todos]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const maxId = Math.max(...todos.map(todo => todo.id)) + 1;
    const trimmed = value.trim();

    setSavingIds([maxId]);

    if (!trimmed) {
      setError('Title should not be empty');
      hideError();
      setIsLoading(false);
      setSavingIds([]);

      return;
    }

    setTempTodo({
      title: trimmed,
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    const data = {
      title: trimmed,
      userId: USER_ID,
      completed: false,
      id: maxId,
    };

    postTodo(data)
      .then((newTodo: Todo) => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setSavingIds([newTodo.id]);
        setValue('');
      })
      .catch(() => {
        setError('Unable to add a todo');
        hideError();
        setValue(value);
      })
      .finally(() => {
        setIsLoading(false);
        setSavingIds([]);
        setTempTodo(null);
      });
  }

  function handleDelete(todoId: number) {
    setIsLoading(true);
    setError('');
    setSavingIds([todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
        setEditingId(null);
      })
      .catch(() => {
        setError('Unable to delete a todo');
        hideError();
      })
      .finally(() => {
        setSavingIds([]);
        setIsLoading(false);
      });
  }

  function deleteAllCompleted() {
    setIsLoading(true);
    setError('');

    const completed = todos.filter(todo => todo.completed);

    setSavingIds(completed.map(elem => elem.id));

    const deletePromises = completed.map(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setError('Unable to delete a todo');
          hideError();
        });
    });

    Promise.allSettled(deletePromises).finally(() => {
      setIsLoading(false);
      setSavingIds([]);
    });
  }

  function handleUpdateTodo(updatedTodo: Todo) {
    setIsLoading(true);
    setEditingId(updatedTodo.id);
    setError('');
    const trimmedTitle = titleForEditing.trim();

    setSavingIds([updatedTodo.id]);

    updateTodo({ ...updatedTodo, title: trimmedTitle })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id
              ? { ...updatedTodo, title: trimmedTitle }
              : todo,
          ),
        );
        setEditingId(null);
        setTitleForEditing('');
        setIsLoading(false);
      })
      .catch(() => {
        setError('Unable to update a todo');
        hideError();
      })
      .finally(() => {
        setSavingIds([]);
      });
  }

  const onChecked = (todo: Todo) => {
    setIsLoading(true);
    setError('');
    setSavingIds([todo.id]);

    updateTodo({ ...todo, completed: !todo.completed })
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(t =>
            t.id === todo.id ? { ...t, completed: !todo.completed } : t,
          ),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
        hideError();
      })
      .finally(() => {
        setIsLoading(false);
        setSavingIds([]);
      });
  };

  function handleInputDoubleClick(elem: Todo) {
    setEditingId(elem.id);
    setTitleForEditing(elem.title);
  }

  function toggleAll() {
    setIsLoading(true);
    setError('');

    const notCompleted = todos.filter(x => x.completed === false);

    if (notCompleted.length > 0) {
      setSavingIds(notCompleted.map(elem => elem.id));

      const updatePromises = notCompleted.map(todo => {
        return updateTodo({ ...todo, completed: true })
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.map(t =>
                t.id === todo.id ? { ...t, completed: true } : t,
              ),
            );
          })
          .catch(() => {
            setError('Unable to update a todo');
            hideError();
          });
      });

      Promise.allSettled(updatePromises).finally(() => {
        setIsLoading(false);
        setSavingIds([]);
      });
    } else {
      setSavingIds(todos.map(elem => elem.id));

      const updatePromises = todos.map(todo => {
        return updateTodo({ ...todo, completed: !todo.completed })
          .then(() => {
            setTodos(currentTodos =>
              currentTodos.map(t =>
                t.id === todo.id ? { ...t, completed: !todo.completed } : t,
              ),
            );
          })
          .catch(() => {
            setError('Unable to update a todo');
            hideError();
          });
      });

      Promise.allSettled(updatePromises).finally(() => {
        setIsLoading(false);
        setSavingIds([]);
      });
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          value={value}
          todos={todos}
          handleSubmit={handleSubmit}
          setValue={setValue}
          titleField={titleField}
          isLoading={isLoading}
          toggleAll={toggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            <TransitionGroup>
              <TodoElem
                visibleTodos={visibleTodos}
                tempTodo={tempTodo}
                handleInputDoubleClick={handleInputDoubleClick}
                onChecked={onChecked}
                titleForEditing={titleForEditing}
                editingId={editingId}
                handleUpdateTodo={handleUpdateTodo}
                setTitleForEditing={setTitleForEditing}
                editInputRef={editInputRef}
                handleDelete={handleDelete}
                setEditingId={setEditingId}
                savingIds={savingIs}
                error={error}
              />
            </TransitionGroup>
          </section>
        )}

        {todos.length > 0 && (
          <Footer
            setSelectedLink={setSelectedLink}
            selectedLink={selectedLink}
            todos={todos}
            deleteAllCompleted={deleteAllCompleted}
          />
        )}
      </div>

      <ErrorComponent error={error} />
    </div>
  );
};
