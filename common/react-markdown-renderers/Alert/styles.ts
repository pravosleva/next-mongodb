import { makeStyles } from '@material-ui/core/styles'
import { theme } from '~/common/styled-mui/theme'

export enum EType {
  success = 'success',
  warning = 'warning',
  danger = 'danger',
  info = 'info',
  default = 'default',
  custom = 'custom',
}
const getIconByType = (type: EType, icon?: string) => {
  switch (true) {
    case type === EType.success:
      return '👌'
    case type === EType.warning:
      return '⚡'
    case type === EType.danger:
      return '🔥'
    case type === EType.info:
      return 'ℹ️'
    case type === EType.custom && !!icon:
      return '👌'
    case type === EType.default:
    default:
      return '💡'
  }
}

export const useStyles = makeStyles((_theme) => ({
  likeBlockuote: {
    '& h2': {
      lineHeight: '25px',
    },
    fontSize: '1em',
    maxWidth: '100%',
    borderRadius: '4px',
    margin: '10px auto 20px auto',
    // fontFamily: 'Open Sans',
    fontStyle: 'normal',
    color: '#555',
    /* padding: 1.2em 30px 1.2em 75px; */
    padding: '1.2em 30px 1.2em 50px',
    // borderLeft: '8px solid #78c0a8',
    lineHeight: '1.6',
    position: 'relative',
    background: '#ededed',
    // quotes: '"“" "”" "‘" "’"',
    '&::before': {
      fontFamily: 'Arial',
      // color: '#78c0a8',
      fontStyle: 'normal',
      fontSize: '2em',
      position: 'absolute',
      left: '8px',
      top: '5px',
    },
    boxShadow: '0 8px 6px -6px rgba(0,0,0,0.3)',
    '& a': {
      color: '#FFF',
      textDecoration: 'underline',
    },
  },
  likeBlockuote_success: {
    quotes: `"${getIconByType(EType.success)}" "”" "${getIconByType(EType.success)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.35)',
    background: 'rgba(120,192,168,1)',
    color: '#FFF',
    '&::before': {
      content: 'open-quote',
      // textShadow: '3px 3px rgba(120,192,168,0.4)',
    },
  },
  likeBlockuote_warning: {
    quotes: `"${getIconByType(EType.warning)}" "”" "${getIconByType(EType.warning)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.35)',
    background: 'rgba(255,142,83,1)',
    color: '#FFF',
    '&::before': {
      content: 'open-quote',
      // textShadow: '0px 0px 8px rgba(255,255,255,0.65)',
    },
  },
  likeBlockuote_danger: {
    quotes: `"${getIconByType(EType.danger)}" "”" "${getIconByType(EType.danger)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.35)',
    background: 'rgba(244,67,44,1)',
    color: '#FFF',
    '&::before': {
      content: 'open-quote',
      // textShadow: '3px 3px rgba(250,114,104,0.4)',
    },
  },
  likeBlockuote_info: {
    quotes: `"${getIconByType(EType.info)}" "”" "${getIconByType(EType.info)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.35)',
    background: 'rgba(56,130,196,1)',
    color: '#FFF',
    '&::before': {
      content: 'open-quote',
      // textShadow: '0px 0px 8px rgba(255,255,255,0.65)',
    },
  },
  likeBlockuote_default: {
    quotes: `"${getIconByType(EType.default)}" "”" "${getIconByType(EType.default)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.25)',
    background: 'rgba(222,222,222,1)',
    color: 'inherit',
    '&::before': {
      content: 'open-quote',
      // textShadow: '3px 3px rgba(222,222,222,0.4)',
      textShadow: '0px 0px 7px #FFF',
    },
    '& a': {
      color: theme.palette.primary.main,
    },
  },
}))
