import PropTypes from 'prop-types';
import { PureComponent } from 'react';

export class Input extends PureComponent {
    static propTypes = {
        formRef: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.shape({ current: PropTypes.instanceOf(Element) })
        ])
    };

    static defaultProps = {
        formRef: () => {}
    };

    render() {
        const {
            formRef,
            ...validProps
        } = this.props;

        return (
            <input
              autoFocus="true"
              ref={ formRef }
              { ...validProps }
            />
        );
    }
}

export default Input;
