



import Moment from 'react-moment';
import React from 'react';
import { PureComponent } from 'react';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/CheckRounded';
import StepConnector from '@material-ui/core/StepConnector';
import { DateFormatter } from 'Util/Order'
import './OrderStatusStepper.style';


const ColorlibConnector = withStyles({

  active: {
    backgroundColor: '#4EB052',
    color: '#4EB052',
  },
  completed: {
    backgroundColor: '#C8E6C9',
    color: '#C8E6C9',
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#C8E6C9',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#C8E6C9',
    zIndex: 1,
    color: '#C8E6C9',
    width: 15,
    height: 15,
    display: 'flex',
    borderRadius: '50%',
  },
  active: {
    backgroundColor: '#4EB052',
    color: '#4EB052',
  },
  completed: {
    backgroundColor: '#C8E6C9',
    color: '#C8E6C9',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;



  return (
    <div 
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >

    </div>
  );
}


export class OrderStatusStepper extends PureComponent {
  RenderLeopardsTraking(TrackingDetail) {
    {/* <Moment date={new Date(status.Activity_datetime)} format="dddd, D MMM" />&nbsp;
           <Moment date={new Date(status.Activity_datetime)} format="LT" /> */}
    return (
      <>
        <div >
          {<Stepper activeStep={0} orientation="vertical" connector={<ColorlibConnector />}>
            {TrackingDetail.map((status, i) => (
              <Step key={status.Status} style={{margin: '7px 0px'}}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {status.Status}<br />
                  {status.Activity_datetime && <label>
                    {DateFormatter.formatDate((new Date(status.Activity_datetime.replace(/ /g, "T"))), 'DDDD, DD MMM hh:mm A')}
                  </label>}
                </StepLabel>
              </Step>
            ))}
          </Stepper>}
        </div>
      </>
    )
  }

  render() {
    const { TrackingDetail, isStepperVisible, order } = this.props;

    return (
      <div block="Checkout" elem="Step">
        <div className="stapper-vertical-container">

          {/* {(!TrackingDetail && order.base_order_info.status_label != 'Shipped' || TrackingDetail.length==0 && order.base_order_info.status_label != 'Shipped' || order.base_order_info.status_label.toLowerCase()==='packed' || order.base_order_info.status_label.toLowerCase()==='confirmed') &&  <p className="secMsg">Once the order is shipped <br /> we will update your tracking information here.</p>} */}
          {/* {(!TrackingDetail && order.base_order_info.status_label != 'Shipped' || TrackingDetail.length == 0 && order.base_order_info.status_label != 'Shipped' || order.base_order_info.status_label.toLowerCase() === 'packed' || order.base_order_info.status_label.toLowerCase() === 'confirmed') && } */}
          {/* {(!TrackingDetail && order.base_order_info.status_label === 'Shipped' || TrackingDetail.length==0 && order.base_order_info.status_label === 'Shipped' || order.base_order_info.status_label === 'Shipped') &&  <p className="secMsg">Your order is shipped <br /> we will update your tracking information here.</p>} */}
          {/* {(!TrackingDetail && order.base_order_info.status_label === 'Shipped' || TrackingDetail.length == 0 && order.base_order_info.status_label === 'Shipped' || order.base_order_info.status_label === 'Shipped') && } */}
          {/* {(TrackingDetail && TrackingDetail.length > 0 && (order.base_order_info.status_label.toLowerCase() !== 'packed' && order.base_order_info.status_label.toLowerCase() !== 'confirmed')) && this.RenderLeopardsTraking(TrackingDetail.reverse())} */}
          {(TrackingDetail && TrackingDetail.length > 0 ? ((order.base_order_info.status_label.toLowerCase() !== 'packed' && order.base_order_info.status_label.toLowerCase() !== 'confirmed')) && this.RenderLeopardsTraking(TrackingDetail.reverse()) : (!TrackingDetail && order.base_order_info.status_label === 'Shipped' || TrackingDetail.length == 0 && order.base_order_info.status_label === 'Shipped' || order.base_order_info.status_label === 'Shipped') ? <h4 className="orderDeliverySec">Your order is shipped we will update your tracking information here.</h4> : <h4 className="orderDeliverySec">Once the order is shipped we will update your tracking information here.</h4>)}

        </div>
      </div>
    );
  }
}
export default OrderStatusStepper;