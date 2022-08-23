
import './GiftCart.style';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
export class GiftCart extends PureComponent {
    static propTypes = {
        onSeeOptionsClick: PropTypes.func.isRequired
    };
    renderIcon() {
        return (
            <>
                <div block="Giftcart" mix={{ block: 'Giftcart', elem: 'Icon' }} >

                </div>
            </>);
    }
    renderContent() {
        return (
            <>
                <div block="Giftcart" mix={{ block: 'Giftcart', elem: 'Content' }} >
                    <h1>Send as a Gift</h1>
                    <p>Select from one of our packaging options <br />Send it directly to your loved ones</p>
                    
                    <label>Confused what to buy? Send a </label><label>Gift Card instead</label>
                </div>
            </>);
    }
    renderButton() {
        const {
            onSeeOptionsClick
        } = this.props;
        return (
            <>
                <div block="Giftcart" mix={{ block: 'Giftcart', elem: 'Button' }} >
                    <button 
                    block="Button"
                    onClick={ onSeeOptionsClick }
                    >
                        SEE OPTIONS
                    </button>
                </div>
            </>
        );
    }
    render() {
        return (<>
            <div block="ProductActions" elem="Giftcart">
                {this.renderIcon()}
                {this.renderContent()}
                {this.renderButton()}
            </div>
        </>);
    }
}

export default GiftCart;
