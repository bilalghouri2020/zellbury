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
 * StaticBlocksQuery Mutations
 * @class StaticBlocksQuery
 */
export class StaticBlocksQuery {
    getBlocksQuery() {
        return new Field('StaticBlocks')
            .addFieldList(this._getCityFields());
    }

    _getCityFields() {
        return [
            'identifier',
            'content'
        ];
    }
}

export default new StaticBlocksQuery();
