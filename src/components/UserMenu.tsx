import { FC } from 'react';
import { Box, Avatar, Chip } from '@mui/material';
import { ArrowDropDown as ArrowDropDownIcon } from '@mui/icons-material';
import useMenu from '../hooks/useMenu';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import AuthAsync from '../store/auth/authAsync';
import { selectCurrentUser } from '../store/users/usersSelectors';
import User from '../models/User';

const UserMenu:FC = () => {
  const dispatch = useAppDispatch();
  const currentUser:User | null = useAppSelector(selectCurrentUser);

  const { Menu, MenuItem, openMenu } = useMenu();

  const handleClick = () => {
    dispatch(AuthAsync.signOut());
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Chip
        sx={{ position: 'absolute', top: '20px', right: '40px' }}
        avatar={<Avatar>{currentUser.name[0].toUpperCase()}</Avatar>}
        label={(
          <Box
            sx={{ display: 'flex', alignItems: 'center', color: '#222' }}
            component="span"
          >
            {currentUser.name}
            <ArrowDropDownIcon />
          </Box>
        )}
        onClick={openMenu}
      />
      <Menu>
        <MenuItem onClick={handleClick}>
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
