// export const TodoErrors: React.FC = () => {
//   return (
//     /* Notification is shown in case of any error */
//     /* Add the 'hidden' class to hide the message smoothly */
//   );
// };
export enum TodoError {
  none = '',
  load = 'Unable to load todos',
  add = 'Unable to add a todo',
  emptyTitle = 'Title can\'t be empty',
  update = 'Unable to update a todo',
  delete = 'Unable to delete a todo',
}
