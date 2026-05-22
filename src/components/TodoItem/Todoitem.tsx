/* eslint-disable jsx-a11y/label-has-associated-control */
import '../../styles/todo.scss';
import * as postService from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Filter, Todo as Todos } from '../../types/Todo';
import { useState } from 'react';
import React from 'react';
import classNames from 'classnames';
type Props = {
  posts: Todos[];
  todo: Todos;
  filter: Filter | undefined;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setPosts: React.Dispatch<React.SetStateAction<Todos[]>>;
  loading: boolean;
  updatingIds: number[];
  setUpdatingIds: React.Dispatch<React.SetStateAction<number[]>>;
};
export const TodoItem: React.FC<Props> = ({
  posts,
  filter,
  todo,
  setErrorMessage,
  setUpdatingIds,
  setPosts,
  updatingIds,
}) => {
  const visibleTodos = posts.filter(todos => {
    if (filter === 'active') {
      return !todos.completed;
    }

    if (filter === 'completed') {
      return todos.completed;
    }

    return true;
  });

  async function handleTodoStatus(id: number, checked: boolean) {
    setErrorMessage('');
    setUpdatingIds(prev => [...prev, id]);
    try {
      const current = posts.find(post => post.id === id);

      if (!current) {
        return;
      }

      const serverTodo = await postService.updateTodo(id, {
        completed: checked,
      });

      setPosts(prev => prev.map(post => (post.id === id ? serverTodo : post)));
    } catch (error) {
      setErrorMessage(ErrorMessage.UpdateTodo);
    } finally {
      setUpdatingIds(prev => prev.filter(updatingId => updatingId !== id));
    }
  }

  // Use shared updatingIds array to support multiple concurrent operations
  const onDelete = async (postId: number) => {
    setErrorMessage('');
    // mark this id as updating
    setUpdatingIds(prev => [...prev, postId]);
    try {
      await postService.deletePost(postId);
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
    } catch (error) {
      setErrorMessage(ErrorMessage.DeleteTodo);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      // remove id from updating list
      setUpdatingIds(prev => prev.filter(updatingId => updatingId !== postId));
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);
  const handleEdit = async () => {
    const trimmed = editedTitle.trim();

    if (trimmed === '') {
      // Видалити todo
      await onDelete(todo.id);
      setIsEditing(false);

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsUpdating(true);
    try {
      const updated = await postService.updateTodo(todo.id, {
        title: trimmed,
      });

      setPosts(post =>
        post.map(todos => (todos.id === todos.id ? updated : todos)),
      );
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodo);
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  return (
    <div>
      {visibleTodos.map(post => (
        <div
          key={post.id}
          data-cy="Todo"
          className={classNames('todo', { completed: post.completed })}
        >
          <label className="todo__status-label" htmlFor="todoStatus">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              id="todoStatus"
              className="todo__status"
              onChange={event =>
                handleTodoStatus(post.id, event.target.checked)
              }
              checked={post.completed}
              disabled={updatingIds.includes(post.id)}
            />
          </label>

          {isEditing && isUpdating ? (
            <input
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              onBlur={handleEdit}
              onKeyUp={e => {
                if (e.key === 'Enter') {
                  handleEdit();
                }

                if (e.key === 'Escape') {
                  setIsEditing(false);
                }
              }}
              autoFocus
            />
          ) : (
            <span data-cy="TodoTitle" className="todo__title">
              {post.title}
            </span>
          )}
          <button
            type="button"
            aria-label="Delete todo"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(post.id)}
            disabled={updatingIds.includes(post.id)}
          >
            ×
          </button>

          {/* always render per-todo loader; toggle active class by id presence */}
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': updatingIds.includes(post.id),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </div>
  );
};
