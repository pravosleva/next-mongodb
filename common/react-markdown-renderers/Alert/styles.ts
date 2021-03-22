import { makeStyles } from '@material-ui/core/styles'

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
    // case type === EType.warning:
    //   return '⚡'
    case type === EType.danger:
      return '😱'
    case type === EType.info:
      return 'ℹ️'
    case type === EType.custom && !!icon:
      return '👌'
    case type === EType.default:
    default:
      return '🔥'
  }
}

export const useStyles = makeStyles((_theme) => ({
  likeBlockuote: {
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
  },
  likeBlockuote_success: {
    quotes: `"${getIconByType(EType.success)}" "”" "${getIconByType(EType.success)}" "’"`,
    borderLeft: '8px solid #78c0a8',
    background: 'rgba(120,192,168,0.1)',
    '&::before': {
      content: 'open-quote',
      textShadow: '3px 3px rgba(120,192,168,0.4)',
    },
  },
  likeBlockuote_warning: {
    quotes: `"${getIconByType(EType.warning)}" "”" "${getIconByType(EType.warning)}" "’"`,
    borderLeft: '8px solid #ff8e53',
    background: 'rgba(255,142,83,0.1)',
    '&::before': {
      content: 'open-quote',
      textShadow: '3px 3px rgba(255,142,83,0.4)',
    },
  },
  likeBlockuote_danger: {
    quotes: `"${getIconByType(EType.danger)}" "”" "${getIconByType(EType.danger)}" "’"`,
    borderLeft: '8px solid #fe7f2d',
    background: 'rgba(254,127,45,0.1)',
    '&::before': {
      content: 'open-quote',
      textShadow: '3px 3px rgba(254,127,45,0.4)',
    },
  },
  likeBlockuote_info: {
    quotes: `"${getIconByType(EType.info)}" "”" "${getIconByType(EType.info)}" "’"`,
    borderLeft: '8px solid #3882C4',
    background: 'rgba(56,130,196,0.1)',
    '&::before': {
      content: 'open-quote',
      textShadow: '3px 3px rgba(56,130,196,0.4)',
    },
  },
  likeBlockuote_default: {
    quotes: `"${getIconByType(EType.default)}" "”" "${getIconByType(EType.default)}" "’"`,
    borderLeft: '8px solid #dedede',
    background: 'rgba(222,222,222,0.2)',
    '&::before': {
      content: 'open-quote',
      textShadow: '3px 3px rgba(222,222,222,0.4)',
    },
  },
}))
