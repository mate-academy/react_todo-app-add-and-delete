/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
};

const TodoListComponent: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
}) => {
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const itemVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -20,
    },
    visible: (index: number) => ({
      opacity: 1,
      height: 58,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const tempItemVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      height: 58,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <AnimatePresence>
        {todos.map((todo, index) => {
          const isLoading = loadingIds.includes(todo.id);

          return (
            <motion.div
              key={todo.id}
              className="todo-wrapper"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={index}
              layout
            >
              <TodoItem
                todo={todo}
                selectedTodoId={selectedTodoId}
                isLoading={isLoading}
                onSelect={setSelectedTodoId}
              />
            </motion.div>
          );
        })}

        {tempTodo && (
          <motion.div
            key={tempTodo.id}
            className="todo-wrapper"
            variants={tempItemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <TodoItem todo={tempTodo} isLoading={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export const TodoList = React.memo(TodoListComponent);
