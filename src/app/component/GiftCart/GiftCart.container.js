
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import GiftCart from './GiftCart.component';

export class GiftCartContainer extends PureComponent {
    static propTypes = {
        
    };

    containerFunctions = {
        onSeeOptionsClick: this.onSeeOptionsClick.bind(this)
    };

    constructor(props) {
        super(props);
    }
    onSeeOptionsClick()
    {
        alert('Gift Card section is in progress.')
    }
    render() {
        return (
            <GiftCart
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default GiftCartContainer;
