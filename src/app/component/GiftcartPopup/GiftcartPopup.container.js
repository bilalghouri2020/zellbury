
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { ProductType } from 'Type/ProductList';

import GiftcartPopup from './GiftcartPopup.component';

export class GiftcartPopupContainer extends PureComponent {
    static propTypes = {
        
    };

    containerFunctions = {
      
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <GiftcartPopup
              { ...this.props }
              { ...this.containerFunctions }
            />
        );
    }
}

export default GiftcartPopupContainer;
