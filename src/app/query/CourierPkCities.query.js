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
 * CourierPkCitiesQuery Mutations
 * @class CourierPkCitiesQuery
 */
export class CourierPkCitiesQuery {
    getCitiesQuery() {
        return new Field('PkCities')
            .addFieldList(this._getCityFields());
    }

    _getCityFields() {
        return [
            'label'
        ];
    }
}

export default new CourierPkCitiesQuery();
