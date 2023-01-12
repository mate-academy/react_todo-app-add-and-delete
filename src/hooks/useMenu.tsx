import {
  FC, useState, useMemo, useCallback, MouseEvent,
} from 'react';
import {
  Menu as MuiMenu, MenuProps,
  MenuItem as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
} from '@mui/material';

type MenuItemProps = MuiMenuItemProps & {
  component?: JSX.Element;
  to?: string;
};

const useMenu = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const openMenu = useCallback((event:MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const Menu = useMemo(() => {
    const MenuComponent:FC<Omit<MenuProps, 'open' | 'onClose'>> = ({
      children, ...props
    }) => {
      const open = Boolean(anchorEl);

      if (!open) {
        return null;
      }

      return (
        <MuiMenu
          {...props}
          anchorEl={anchorEl}
          open={open}
          onClose={closeMenu}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {children}
        </MuiMenu>
      );
    };

    return MenuComponent;
  }, [anchorEl]);

  const MenuItem = useMemo(() => {
    const MenuItemComponent:FC<MenuItemProps> = ({ children, ...props }) => {
      return (
        <MuiMenuItem
          {...props}
          onClick={(event:MouseEvent<HTMLLIElement>) => {
            if (props.onClick) {
              props.onClick(event);
            }

            closeMenu();
          }}
        >
          {children}
        </MuiMenuItem>
      );
    };

    return MenuItemComponent;
  }, []);

  return {
    Menu,
    MenuItem,
    openMenu,
    closeMenu,
  };
};

export default useMenu;
