import React, { useEffect, setState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ListSubheader from '@material-ui/core/ListSubheader';
import Collapse from '@material-ui/core/Collapse';
import BrowserDatabase from 'Util/BrowserDatabase';
import DateFormat from 'Util/Date'
import history from 'Util/History';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import checkoutSuccess from "../../../../media/double-tick.png";
import arrow from "../../../../media/botomsnipetArrow.png";
import calander from "../../../../media/calendar-bottom.png";
import "./BottomSheet.style"
import { isSignedIn } from 'Util/Auth';
import { getMessageFromStatus, getExpectedDate, DateFormatter } from 'Util/Order';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});
const handleClick = (id) => {
    // setOpen(!open);
    if (id)
        history.push(`/order/status/${id}`);
};

export default function SwipeableTemporaryDrawer({ orders, userData }) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: true,
        right: false,
    });
    const [open, setOpen] = React.useState(true);
    const formatDate = (d, next) => {
        let date = new Date(d.split('.').reverse().join('-'))
        return ` ${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date.setDate(date.getDate() + next))} ${new Intl.DateTimeFormat('en', { month: 'short' }).format(date.setDate(date.getDate() + next))} `;
    }
    useEffect(() => {

    });
    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    const item = (order, name) => {
        
        const { estimated_delivery } = order.base_order_info;
        let estimatedDeliveryTimeline = ""
        if (estimated_delivery === "No ETA") {
            estimatedDeliveryTimeline = "No ETA"
        } else if (DateFormat(new Date) === estimated_delivery) {
            estimatedDeliveryTimeline = "12 - 36 hours"
        }else{
            estimatedDeliveryTimeline = getExpectedDate(order.base_order_info.estimated_delivery)
        }
        return (
            <>
                <div class="bottom-prd-detail">
                    <button data-value={order.base_order_info.id} id={order.base_order_info.id} onClick={(e) => {
                        handleClick(e.target.getAttribute('data-value'));
                    }} >
                        <ListItem button className={classes.nested} data-value={order.base_order_info.id}>
                            <div className="bottom-prd-img">
                                <ListItemIcon data-value={order.base_order_info.id}>
                                    <img class="success-img" src={(getMessageFromStatus(order.base_order_info.status_label, name)).image} data-value={order.base_order_info.id} />
                                </ListItemIcon>
                            </div>
                            <div className="bottom-prd-msg" data-value={order.base_order_info.id}>
                                <h4 dangerouslySetInnerHTML={{ __html: (getMessageFromStatus(order.base_order_info.status_label, name)).title }} data-value={order.base_order_info.id}></h4>
                                <p className="font12" dangerouslySetInnerHTML={{ __html: (getMessageFromStatus(order.base_order_info.status_label, name)).message }} data-value={order.base_order_info.id}></p>
                                {(order.base_order_info && order.base_order_info.status_label.toLowerCase() !== 'complete') && <p className="font12" class="bottom-dates">
                                    <img class="success-img" src={calander} data-value={order.base_order_info.id} />
                                    <span data-value={order.base_order_info.id}>{`Expected Delivery ` + estimatedDeliveryTimeline}</span>
                                </p>}
                                {(order.base_order_info && order.base_order_info.delivery_date && order.base_order_info.status_label.toLowerCase() == 'complete') && <p className="font12" class="bottom-dates">
                                    <img class="success-img" src={calander} data-value={order.base_order_info.id} />
                                    <span data-value={order.base_order_info.id}>{`Delivery Date ` + DateFormatter.formatDate((new Date(order.base_order_info.delivery_date.replace(/\s/, 'T'))), "D MMM YYYY hh:mm A")}</span>
                                </p>}
                            </div>
                            <div className="bottom-prd-date" data-value={order.base_order_info.id}>
                                <ListItemIcon data-value={order.base_order_info.id}>
                                    <div className="bottom-prd-date-wrapper" data-value={order.base_order_info.id}>
                                        <img class="success-img" src={arrow} data-value={order.base_order_info.id} />
                                    </div>
                                </ListItemIcon>
                            </div>

                        </ListItem>
                        <Divider />
                    </button>

                </div>
            </>
        )
    };
    const list = (anchor, orders = [], name) => (
        <div className="order-stepper">

            <div
                className={clsx(classes.list, {
                    [classes.fullList]: anchor === 'top' || anchor === 'bottom',
                })}
                role="presentation"

            >

                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader
                            // onClick={handleClick} 
                            component="div" id="nested-list-subheader">
                            {/* {open ?<ExpandMore />  :<ExpandLess /> } */}
                        </ListSubheader>
                    }
                    className={classes.root}
                >

                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* <ListItem button >
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="Inbox" />
                        </ListItem> */}

                            {orders.map(x => {
                                return item(x, name);
                            })}

                        </List>
                    </Collapse>
                </List>
            </div>

        </div>
    );

    return (
        <div >
            {isSignedIn() && ['bottom'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <ArrowDropUpIcon onClick={toggleDrawer(anchor, true)}></ArrowDropUpIcon>
                    {/* <Button id="btntoggleList" onClick={toggleDrawer(anchor, true)}>
                    <span class="material-icons">
                        arrow_drop_up
                    </span>
                    </Button> */}
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer('bottom', false)}
                        onOpen={toggleDrawer('bottom', true)}
                        BackdropProps={{ invisible: true }}
                    >
                        <div className="bottomSheet_arrow">
                            <ArrowDropDownIcon onClick={toggleDrawer('bottom', false)}></ArrowDropDownIcon>
                        </div>
                        {list(anchor, orders, userData.firstname ? (userData.firstname.split(' ')[0]).toUpperCase() : '')}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}
