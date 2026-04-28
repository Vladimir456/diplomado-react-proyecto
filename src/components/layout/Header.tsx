import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
} from '@mui/material';
import type { MenuType } from './types';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

interface Props {
  username?: string;
  menuOptions: MenuType[];
  logout: () => void;
}

export const Header = ({ username, menuOptions, logout }: Props) => {
  const location = useLocation();

  const getPageTitle = () => {
    const currentOption = menuOptions.find(
      (option) => location.pathname === option.path,
    );
    return currentOption?.text || 'TaskDone';
  };

  return (
    <AppBar position="fixed" elevation={2}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">{getPageTitle()}</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
            {username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {username || 'Usuario'}
          </Typography>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
