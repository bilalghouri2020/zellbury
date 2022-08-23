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

import { Field } from 'Util/Query';

/**
 * StoreConfigurationsQuery Mutations
 * @class StoreConfigurationsQuery
 */
export class StoreConfigurationsQuery {
    getConfigurationsQuery() {
        return new Field('StoreConfigurations')
            .addFieldList(this._getConfigurationsFields());
    }

    _getConfigurationsFields() {
        return [
            'identifier',
            'label'
        ];
    }
}

export default new StoreConfigurationsQuery();
