import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import CancelCheckout from './CancelCheckout.component';
export const mapStateToProps = (state) => ({
    isSignedIn: state.MyAccountReducer.isSignedIn
});
export const BreadcrumbsDispatcher = import(
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);
export const mapDispatchToProps = (dispatch) => ({
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
});
export class CancelCheckoutContainer extends PureComponent {
    static propTypes = {
        updateBreadcrumbs: PropTypes.func.isRequired,
       
    };
    _updateBreadcrumbs() {
        const { updateBreadcrumbs } = this.props;
        const breadcrumbs = [
            { url: '/customcheckout/Order/Cancel', name: __('Order Cancelled') },
            { url: '/', name: __('Home') }
        ];

        updateBreadcrumbs(breadcrumbs);
    }
    componentDidMount() {
        this._updateBreadcrumbs();
    }
    render() {
        return (
            <CancelCheckout />
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(CancelCheckoutContainer);