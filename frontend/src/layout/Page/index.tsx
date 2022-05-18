import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import MenuIcon from '@mui/icons-material/Menu'
import { Box, CssBaseline, IconButton, Toolbar, useTheme, useMediaQuery } from '@mui/material'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import Link from '@mui/material/Link'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import ConnectDialog from '../../components/ConnectDialog'
import { OWNER } from '../../constants'
import useWeb3 from '../../context/Web3Context'
import { GetPageTitle, MainListItems, SecondaryListItems } from './menu'

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href={OWNER.homepageUrl}>
        {OWNER.name}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const drawerWidth = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}))

export function PageLayout(props: any) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(!isMobile)
  const [connectDialogOpen, setConnectDialogOpen] = React.useState(false)

  const { account, setAccount } = useWeb3()

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const openConnectDialog = () => {
    setConnectDialogOpen(!account ? true : false)
  }
  const handleConnectDialogOpen = () => {
    setConnectDialogOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ConnectDialog onClose={handleConnectDialogOpen} open={!account && connectDialogOpen} />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px' // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' })
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {GetPageTitle()}
          </Typography>
          <IconButton color="inherit">
            {/* <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge> */}
          </IconButton>
          <IconButton color="inherit" onClick={() => (!account ? openConnectDialog() : setAccount(undefined))}>
            {!account ? <AccountCircleIcon /> : <small>{`${account.substring(0, 8)}..`}</small>}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1]
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {MainListItems()}
          <Divider sx={{ my: 1 }} />
          {SecondaryListItems()}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {props.children}
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  )
}