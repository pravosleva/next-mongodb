import React, { useCallback } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import MuiStepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
// import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    stepper: {
      // border: '1px solid red',
      // borderRadius: '4px',
      // padding: theme.spacing(1, 0, 1, 0),
      padding: theme.spacing(0),
      marginBottom: theme.spacing(3),
      backgroundColor: 'transparent',
    },
    descriptionContent: {
      marginBottom: theme.spacing(1),
    },
    jsxContent: {
      marginBottom: theme.spacing(1),
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      // marginBottom: theme.spacing(1),
    },
    resetContainer: {
      // padding: theme.spacing(1),
      backgroundColor: 'transparent',
    },
  })
)

type TProps = {
  onSave: () => void
  steps: {
    title: string
    description?: string
    content: React.FC<any>
  }[]
  onClose?: () => void
  onCancel: () => void
  onRemoveId: (namespase: string, id: string) => void

  // REST:
  [key: string]: any
  // data: any
  // formData: any
  // onInputChange: any
  // getNormalizedForm: (form: any) => any
  formErrors: {
    [key: string]: any
    blockedSteps?: number[]
  }
}

export const Stepper = ({ onClose, onSave, onCancel, steps, ...rest }: TProps) => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  // const steps = getSteps()

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleResetStep = () => {
    setActiveStep(0)
  }
  const finalHandler = () => {
    onSave()
    if (!!onClose) onClose()
  }
  const handleCancel = useCallback(() => {
    onCancel()
    handleResetStep()
  }, [onCancel, handleResetStep])

  return (
    <div className={classes.root}>
      <MuiStepper
        activeStep={activeStep}
        orientation="vertical"
        // style={{ border: '1px solid red' }}
        className={classes.stepper}
      >
        {steps.map(({ title, description, content }, index) => (
          <Step key={index}>
            <StepLabel>{title}</StepLabel>
            <StepContent>
              {!!description && <div className={classes.descriptionContent}>{description}</div>}
              <div className={classes.jsxContent}>{content({ ...rest })}</div>
              <div className={classes.actionsContainer}>
                <div>
                  <Button size="small" disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                    Back
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                    disabled={rest.formErrors?.blockedSteps?.includes(activeStep)}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </MuiStepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <div>All steps completed - you&apos;re finished</div>
          <Button
            color="secondary"
            size="small"
            variant="outlined"
            onClick={handleResetStep}
            className={classes.button}
          >
            Go Start
          </Button>
          <Button color="secondary" size="small" variant="contained" onClick={handleCancel} className={classes.button}>
            Cancel
          </Button>
          <Button color="primary" size="small" variant="contained" onClick={finalHandler} className={classes.button}>
            Save
          </Button>
        </Paper>
      )}
      {!!onClose && activeStep !== steps.length && (
        <Button color="secondary" size="small" variant="outlined" onClick={onClose} className={classes.button}>
          Close
        </Button>
      )}
    </div>
  )
}
