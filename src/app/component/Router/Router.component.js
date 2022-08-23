/* eslint-disable max-len */

/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import {
    cloneElement,
    lazy,
    PureComponent,
    Suspense
} from 'react';
import { Router as ReactRouter } from 'react-router';
import { Route, Switch } from 'react-router-dom';


import Breadcrumbs from 'Component/Breadcrumbs';
import CookiePopup from 'Component/CookiePopup';
import DemoNotice from 'Component/DemoNotice';
import Footer from 'Component/Footer';
import Header from 'Component/Header';
import Loader from 'Component/Loader';
import Meta from 'Component/Meta';
import NavigationTabs from 'Component/NavigationTabs';
import NewVersionPopup from 'Component/NewVersionPopup';
import NotificationList from 'Component/NotificationList';
import OfflineNotice from 'Component/OfflineNotice';
import NoMatchHandler from 'Route/NoMatchHandler';
import SomethingWentWrong from 'Route/SomethingWentWrong';
import UrlRewrites from 'Route/UrlRewrites';
import history from 'Util/History';

import {
    AFTER_ITEMS_TYPE,
    BEFORE_ITEMS_TYPE,
    SWITCH_ITEMS_TYPE
} from './Router.config';

export const CartPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "cart" */ 'Route/CartPage'));
export const Checkout = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "checkout" */ 'Route/Checkout'));
export const CmsPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "cms" */ 'Route/CmsPage'));
export const HomePage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "cms" */ 'Route/HomePage'));
export const MyAccount = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "account" */ 'Route/MyAccount'));
// export const ParcelStatus = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "account" */ 'Route/ParcelStatus'));
export const CustomCheckout = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "account" */ 'Route/CustomCheckout'));
export const CancelCheckout = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "account" */ 'Route/CancelCheckout'));
export const PasswordChangePage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/PasswordChangePage'));
export const SearchPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "category" */ 'Route/SearchPage'));
export const ConfirmAccountPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "cms" */ 'Route/ConfirmAccountPage'));
export const MenuPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "cms" */ 'Route/MenuPage'));
export const WishlistShared = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/WishlistSharedPage'));
export const SampleQRCode = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/SampleQRCode'));
// export const OrderComplain = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/OrderComplainPage'));
export const MyComplainOrdersListing = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/OrdersListing'));
export const ExchangeOrdersOptions = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/DeliveredOrders/ExchangeOptions'));
export const FabricLightThickDetails = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/DeliveredOrders/FabricLightThickDetails'));
export const ComplainOrdersStoresList = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/DeliveredOrders/StoreList'));
export const PickupAndCredit = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/DeliveredOrders/PickupAndCredit'));
export const GetConvenienceVoucherContainer = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/DeliveredOrders/GetConvenienceVoucher'));
export const ItemFoundInDBContainer = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/DeliveredOrders/ItemFoundInDB'));
export const OrdersOptions = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/OrderOptionsPage'));
export const OrdersDetailsPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/OrderDetails'));
export const QuestionsNotFoundPage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/QuestionNotFound'));
export const OverchargedOptions = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/OverchargedOptions'));
export const MissingItemMessage = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/DeliveredOrders/MissingItemMessage'));

// export const MyComplainOrdersOptions = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "misc" */ 'Route/MyOrderComplainPage/OrderOptionsPage'));

export const withStoreRegex = (path) => window.storeRegexText.concat(path);

export class Router extends PureComponent {
    static propTypes = {
        isBigOffline: PropTypes.bool
    };

    static defaultProps = {
        isBigOffline: false
    };

    [BEFORE_ITEMS_TYPE] = [
        {
            component: <NotificationList />,
            position: 10
        },
        {
            component: <DemoNotice />,
            position: 15
        },
        {
            component: <Header />,
            position: 20
        },
        {
            component: <NavigationTabs />,
            position: 25
        },
        {
            component: <Breadcrumbs />,
            position: 30
        },
        {
            component: <NewVersionPopup />,
            position: 35
        }
    ];

    [SWITCH_ITEMS_TYPE] = [
        {
            component: <Route path={ withStoreRegex('/') } exact component={ HomePage } />,
            position: 10
        },
        {
            component: <Route path={ withStoreRegex('/search/:query/') } component={ SearchPage } />,
            position: 25
        },
        {
            component: <Route path={ withStoreRegex('/page') } component={ CmsPage } />,
            position: 40
        },
        {
            component: <Route path={ withStoreRegex('/cart') } exact component={ CartPage } />,
            position: 50
        },
        {
            component: <Route path={ withStoreRegex('/checkout/:step?') } component={ Checkout } />,
            position: 55
        },
        {
            component: <Route path={ withStoreRegex('/order/:route/:orderid/') } component={ Checkout } />,
            position: 56
        },
        {
            component: <Route path={ withStoreRegex('/:account*/createPassword/') } component={ PasswordChangePage } />,
            position: 60
        },
        {
            component: <Route path={ withStoreRegex('/:account*/confirm') } component={ ConfirmAccountPage } />,
            position: 65
        },
        {
            component: <Route path={ withStoreRegex('/my-account/:tab?') } component={ MyAccount } />,
            position: 70
        },
        // {
        //     component: <Route path={ withStoreRegex('/parcel-status') } exact component={ ParcelStatus } />,
        //     position: 72
        // },
        {
            component: <Route path={ withStoreRegex('/forgot-password') } component={ MyAccount } />,
            position: 71
        },
        {
            component: <Route path={ withStoreRegex('/menu') } component={ MenuPage } />,
            position: 80
        },
        {
            component: <Route path={ withStoreRegex('/wishlist/shared/:code') } component={ WishlistShared } />,
            position: 81
        },
        {
            component: <Route path={ withStoreRegex('/customcheckoutsuccess') } component={ CustomCheckout } />,
            position: 82
        },
        {
            component: <Route path={ withStoreRegex('/cancelcheckout') } component={ CancelCheckout } />,
            position: 82
        },
        {
            component: <Route component={ UrlRewrites } />,
            position: 1000
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/qrcode') } component={ SampleQRCode } />,
            position: 83
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/orderslist') } component={ MyComplainOrdersListing } />,
            position: 84
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/delivered-orders/exchange-order') } component={ ExchangeOrdersOptions } />,
            position: 85
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/delivered-orders/store-list') } component={ ComplainOrdersStoresList } />,
            position: 86
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/delivered-orders/pickup-credit') } component={ PickupAndCredit } />,
            position: 87
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/delivered-orders/convenience-voucher') } component={ GetConvenienceVoucherContainer } />,
            position: 88
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/delivered-orders/order-change-options') } component={ ItemFoundInDBContainer } />,
            position: 89
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/order-options') } component={ OrdersOptions } />,
            position: 90
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/active-orders/order-detail') } component={ OrdersDetailsPage } />,
            position: 91
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/questions-not-found') } component={ QuestionsNotFoundPage } />,
            position: 92
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/delivered-orders/overcharged-issue') } component={ OverchargedOptions } />,
            position: 93
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/delivered-orders/fabric-light-thick') } component={ FabricLightThickDetails } />,
            position: 94
        },
        {
            component: <Route path={ withStoreRegex('/ordercomplain/delivered-orders/missingitem') } component={ MissingItemMessage } />,
            position: 95
        },
        // {
        //     component: <Route path={ withStoreRegex('/ordercomplain/ordersoptions') } component={ MyComplainOrdersOptions } />,
        //     position: 85
        // }
    ];

    [AFTER_ITEMS_TYPE] = [
        {
            component: <Footer />,
            position: 10
        },
        {
            component: <CookiePopup />,
            position: 20
        }
    ];

    state = {
        hasError: false,
        errorDetails: {}
    };

    componentDidCatch(err, info) {
        console.log("error from routing.........", err, info);
        this.setState({
            hasError: true,
            errorDetails: { err, info }
        });
    }

    getSortedItems(type) {
        return this[type].sort(
            (a, b) => a.position - b.position
        ).filter(
            (entry) => {
                if (!entry.component) {
                    // eslint-disable-next-line no-console
                    console.warn('There is an item without a component property declared in main router.');
                    return false;
                }

                return true;
            }
        );
    }

    handleErrorReset = () => {
        this.setState({ hasError: false });
    };

    renderItemsOfType(type) {
        return this.getSortedItems(type)
            .map(({ position, component }) => cloneElement(component, { key: position }));
    }

    renderMainItems() {
        const { isBigOffline } = this.props;

        if (!navigator.onLine && isBigOffline) {
            return <OfflineNotice isPage />;
        }

        return (
            <Suspense fallback={ this.renderFallbackPage() }>
                <NoMatchHandler>
                    <Switch>
                        { this.renderItemsOfType(SWITCH_ITEMS_TYPE) }
                    </Switch>
                </NoMatchHandler>
            </Suspense>
        );
    }

    renderErrorRouterContent() {
        const { errorDetails } = this.state;
        console.log("errors...", errorDetails);
        return (
            <SomethingWentWrong
              onClick={ this.handleErrorReset }
              errorDetails={ errorDetails }
            />
        );
    }

    renderFallbackPage() {
        return (
            <main style={ { height: '100vh' } }>
                <Loader isLoading />
            </main>
        );
    }

    renderDefaultRouterContent() {
        return (
            <>
                { this.renderItemsOfType(BEFORE_ITEMS_TYPE) }
                { this.renderMainItems() }
                { this.renderItemsOfType(AFTER_ITEMS_TYPE) }
            </>
        );
    }

    renderRouterContent() {
        const { hasError } = this.state;

        if (hasError) {
            return this.renderErrorRouterContent();
        }

        return this.renderDefaultRouterContent();
    }

    render() {
        return (
            <>
                <Meta />
                <ReactRouter history={ history }>
                    { this.renderRouterContent() }
                </ReactRouter>
            </>
        );
    }
}

export default Router;
