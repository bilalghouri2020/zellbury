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

import './FieldForm.style';

import { PureComponent } from 'react';

import Field from 'Component/Field';
import Form from 'Component/Form';
import BrowserDatabase from 'Util/BrowserDatabase';

export class FieldForm extends PureComponent {
    onFormSuccess() {
        // TODO: implement
    }

    get fieldMap() {
        return {
            // email: {
            //     label: __('Email'),
            //     validation: ['notEmpty']
            // }
        };
    }

    getDefaultValues([key, props]) {
        const {
            type = 'text',

            ...otherProps
        } = props;

        return {
            ...otherProps,
            key,
            name: key,
            id: key,
            type
        };
    }
    componentDidMount() {
        
        setTimeout(() => {
            let localMobile = localStorage.getItem('phone')
            let user =BrowserDatabase.getItem('customer');
            let telephone = document.getElementById('telephone');
            let city = document.getElementById('city');
            let mobile = '';
            if(user.addresses.length>0)
            {
               let address = user.addresses.find(x=>x.default_billing && x.default_shipping)
               city.value=address.city;
            }
            else if(user.city && user.addresses.length==0)
            {
                city.value=user.city;
            }
            if (localMobile && localMobile.length > 3) {
                mobile = localMobile.slice(3);
                
                if (telephone)
                {
                    telephone.value = mobile;
                    telephone.disabled=true;
                } 
            }
        }, 600)
    }
    renderField = (fieldEntry) => (
        <Field {...this.getDefaultValues(fieldEntry)} />
    );

    renderFields() {
        return (
            <div
                block="FieldForm"
                elem="Fields"
            >
                { Object.entries(this.fieldMap).map(this.renderField)}
            </div>
        );
    }

    renderActions() {
        return null;
    }

    render() {
        return (
            <Form
                onSubmitSuccess={this.onFormSuccess}
                mix={{ block: 'FieldForm' }}
            >
                { this.renderFields()}
                { this.renderActions()}
            </Form>
        );
    }
}

export default FieldForm;
