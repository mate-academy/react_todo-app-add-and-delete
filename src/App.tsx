/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [haveTodos, setHaveTodos] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [allTodosCompleted, setAllTodosCompleted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const remainingTodos = todos.filter(
    todo => !todo.completed && !loadingTodoIds.includes(todo.id),
  ).length;

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true; // all
  });

  const showError = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const addTodo = ({
    title,
    completed,
  }: {
    title: string;
    completed: boolean;
  }) => {
    const fakeId = Date.now() + Math.random();

    setIsCreating(true); // <== Habilita loading do input

    setTodos(currentTodos => [
      ...currentTodos,
      {
        userId: USER_ID,
        title,
        completed,
        loading: true,
        id: fakeId,
      },
    ]);

    setLoadingTodoIds(prev => [...prev, fakeId]);

    createTodo({ userId: USER_ID, title, completed })
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map((todo, index) => {
            if (index === currentTodos.length - 1) {
              return newTodo;
            }

            return todo;
          }),
        );

        setTodoTitle('');
        setNewTodoTitle('');
      })
      .catch(() => {
        setTodos(currentTodos => {
          const updated = [...currentTodos];

          updated.pop();

          return updated;
        });
        showError('Unable to add a todo');
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== fakeId));
        setIsCreating(false); // <== Finaliza loading do input
      });
  };

  const handleDelete = (itemId: number) => {
    setLoadingTodoIds(prev => [...prev, itemId]);

    deleteTodo(itemId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== itemId));
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== itemId));
      });
  };

  const handleClearCompleted = () => {
    // 1) pega os IDs marcados como completos
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    // 2) marca todos como "loading"
    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    // 3) dispara as deleções e aguarda status de cada uma
    Promise.allSettled(
      completedIds.map(
        id => deleteTodo(id).then(() => id), // sucesso resolve com o próprio id
      ),
    )
      .then(results => {
        // quais deletaram com sucesso?
        const succeededIds = results
          .filter(r => r.status === 'fulfilled')
          .map((r: PromiseFulfilledResult<number>) => r.value);

        // remove da lista apenas os que deram sucesso
        setTodos(prev => prev.filter(todo => !succeededIds.includes(todo.id)));

        // se houve pelo menos um erro, mostra mensagem
        if (results.some(r => r.status === 'rejected')) {
          showError('Unable to delete a todo');
        }
      })
      .finally(() => {
        // limpa o loading de todos os IDs originais
        setLoadingTodoIds(prev =>
          prev.filter(id => !completedIds.includes(id)),
        );
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    // Ativa loader nos respectivos itens
    const idsBeingUpdated = todos
      .filter(todo => todo.completed === allCompleted) // só os que serão alterados
      .map(todo => todo.id);

    setLoadingTodoIds(idsBeingUpdated);

    Promise.all(
      todosToUpdate.map(todo => updateTodo(todo).then(updated => updated)),
    )
      .then(updatedTodos => {
        setTodos(updatedTodos);
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setLoadingTodoIds([]); // Limpa os loaders de todos os itens
      });
  };

  const handleCompleted = (id: number) => {
    const todo = todos.find(myTodo => myTodo.id === id);

    if (!todo) {
      return;
    }

    const updatedTodo = { ...todo, completed: !todo.completed };

    setLoadingTodoIds(prev => [...prev, id]);

    updateTodo(updatedTodo)
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(loadingId => loadingId !== id));
      });
  };

  const handleEdit = (itemId: number) => {
    setLoadingTodoIds(prev => [...prev, itemId]);

    const currentTodo = todos.find(todo => todo.id === itemId);

    if (!currentTodo) {
      return;
    }

    const updatedData = {
      ...currentTodo,
      title: todoTitle.trim(),
    };

    if (updatedData.title === '') {
      handleDelete(itemId);

      return;
    }

    updateTodo(updatedData)
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === itemId ? updatedTodo : todo)),
        );
        setEditTodoId(null);
        setTodoTitle('');
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== itemId));
      });
  };

  useEffect(() => {
    if (editTodoId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editTodoId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editTodoId === null) {
        return;
      }

      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        handleEdit(editTodoId);
      }
    };

    if (editTodoId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTodoId, todoTitle]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const allAreCompleted =
      todos.length > 0 && todos.every(todo => todo.completed);

    if (allAreCompleted) {
      setAllTodosCompleted(true);
    } else {
      setAllTodosCompleted(false);
    }
  }, [todos]);

  useEffect(() => {
    if (todos.length === 0) {
      setHaveTodos(false);
    } else {
      setHaveTodos(true);
    }
  }, [todos]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {haveTodos && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form
            onSubmit={event => {
              event.preventDefault();

              if (!newTodoTitle.trim()) {
                showError('Title should not be empty');

                return;
              }

              addTodo({
                title: newTodoTitle.trim(),
                completed: false,
              });
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              disabled={isCreating}
              onChange={event => setNewTodoTitle(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <div
              data-cy="Todo"
              className={`todo ${todo.completed && 'completed'}`}
              key={todo.id}
              onDoubleClick={() => {
                setEditTodoId(todo.id);
                setTodoTitle(todo.title);
              }}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  onClick={() => handleCompleted(todo.id)}
                  checked={todo.completed}
                />
              </label>

              {editTodoId === todo.id ? (
                <form
                  ref={formRef}
                  onSubmit={event => {
                    event.preventDefault();
                    handleEdit(todo.id);
                  }}
                >
                  <input
                    ref={inputRef}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    placeholder="Empty todo will be deleted"
                    value={todoTitle}
                    onChange={event => setTodoTitle(event.target.value)}
                  />
                </form>
              ) : (
                <>
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setEditTodoId(todo.id);
                      setTodoTitle(todo.title);
                    }}
                  >
                    {todo.title}
                  </span>
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDelete(todo.id)}
                  >
                    ×
                  </button>
                </>
              )}

              <div
                data-cy="TodoLoader"
                className={`modal overlay ${loadingTodoIds.includes(todo.id) ? 'is-active' : 'hidden'}`}
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {haveTodos && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${remainingTodos} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)} // desativa se nenhum estiver completed
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
