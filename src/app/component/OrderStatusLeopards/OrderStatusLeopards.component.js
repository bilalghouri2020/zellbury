


import ContentWrapper from 'Component/ContentWrapper';


import CheckIcon from '@material-ui/icons/CheckCircleOutlined';
import React from 'react';
import { PureComponent } from 'react';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/CheckRounded';
import StepConnector from '@material-ui/core/StepConnector';

import './OrderStatusLeopards.style';

const ColorlibConnector = withStyles({

    active: {
        '& $line': {
            backgroundImage:
                '#4EB052',
        },
    },
    completed: {
        '& $line': {
            backgroundImage:
                '#4EB052',
        },
    },
    line: {
        height: 5,
        border: 0,
        backgroundColor: '#e8e8e8',
        borderRadius: 1,
    },
})(StepConnector);
const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#C8E6C9',
        zIndex: 1,
        color: '#C8E6C9',
        width: 25,
        height: 25,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 0px 0px 1px rgba(0,0,0,.25)'
    },
    active: {
     
    },
    completed: {
       
    },
});
const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        // button: {
        //     marginRight: theme.spacing(1),
        // },
        // instructions: {
        //     marginTop: theme.spacing(1),
        //     marginBottom: theme.spacing(1),
        // },
    }),
);
function ColorlibStepIcon(props) {
    const classes = useColorlibStepIconStyles();
    const { active, completed } = props;

    const icons = {
        1: <Check />,
        2: <Check />,
        3: <Check />,
        4: <Check />,
    };

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed,
            })}
        >
            {icons[String(props.icon)]}
        </div>
    );
}
export class OrderStatusLeopards extends PureComponent {


    RenderLeopardsTraking() {
        const { activeStep, steps } = this.props;
        return (
            <>
                {(steps.length > 0 && activeStep>1) && <div className="stapper-horizontal-container">
                    <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </div>}
            </>
        )
    }
    render() {
        const { title, message, image ,isStepperVisible} = this.props;

        return (
            <>
                <div className="div-greetings">
                    {image && <img class="success-img" src={image} />}
                    {title && <h3>{title}</h3>}
                    {message && <p dangerouslySetInnerHTML={{ __html: message }} />}
                </div>
                {isStepperVisible && <div block="Checkout" elem="Step">
                    {this.RenderLeopardsTraking()}
                </div>}
            </>
        );
    }
}
export default OrderStatusLeopards;