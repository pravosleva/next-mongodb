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
    case type === EType.warning:
      return '⚡'
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
    fontFamily: 'Open Sans',
    fontStyle: 'italic',
    color: '#555',
    /* padding: 1.2em 30px 1.2em 75px; */
    padding: '1.2em 30px 1.2em 45px',
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
    '&::before': {
      content: 'open-quote',
    },
  },
  likeBlockuote_warning: {
    quotes: `"${getIconByType(EType.warning)}" "”" "${getIconByType(EType.warning)}" "’"`,
    borderLeft: '8px solid #ff8e53',
    '&::before': {
      content: 'open-quote',
    },
  },
  likeBlockuote_danger: {
    quotes: `"${getIconByType(EType.danger)}" "”" "${getIconByType(EType.danger)}" "’"`,
    borderLeft: '8px solid #fe7f2d',
    '&::before': {
      content: 'open-quote',
    },
  },
  likeBlockuote_info: {
    quotes: `"${getIconByType(EType.info)}" "”" "${getIconByType(EType.info)}" "’"`,
    borderLeft: '8px solid #3882C4',
    '&::before': {
      content: 'open-quote',
    },
  },
  likeBlockuote_default: {
    quotes: `"${getIconByType(EType.default)}" "”" "${getIconByType(EType.default)}" "’"`,
    borderLeft: '8px solid #dedede',
    '&::before': {
      content: 'open-quote',
    },
  },
}))
