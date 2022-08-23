
import { Field } from 'Util/Query';

/**
 * SlickSlider Query
 * @class SlickSlider
 */
export class SlickSlider {
    getQuery(options) {
        const { sliderId } = options;

        return new Field('SlickSlider')
            .addArgument('id', 'ID!', sliderId)
            .addFieldList(this._getSliderFields())
            .setAlias('slider');
    }

    _getSliderFields() {
        return [
            this._getSlidesField(),
            'entity_id',
            'name'
        ];
    }

    _getSlideFields() {
        return [
            'entity_id',
            'name',
            'slide_image',
            'cat_link',
            'description'
        ];
    }

    _getSlidesField() {
        return new Field('slides')
            .addFieldList(this._getSlideFields());
    }
}

export default new SlickSlider();
