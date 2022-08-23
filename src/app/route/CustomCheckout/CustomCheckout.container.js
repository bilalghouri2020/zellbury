import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import CustomCheckout from './CustomCheckout.component';
export const mapStateToProps = (state) => ({
    isSignedIn: state.MyAccountReducer.isSignedIn
});
export const BreadcrumbsDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);
export const mapDispatchToProps = (dispatch) => ({
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
});
export class CustomCheckoutContainer extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
       
    };
    _updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            { url: '/customcheckoutsuccess', name: __('Customer Checkout Success') },
            { url: '/', name: __('Home') }
        ];

        updateBreadcrumbs(breadcrumbs);
    }
    componentDidMount() {
        this._updateBreadcrumbs();
    }
    render() {
        return (
            <CustomCheckout />
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomCheckoutContainer);