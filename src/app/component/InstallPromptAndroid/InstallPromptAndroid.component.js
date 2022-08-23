import './InstallPromptAndroid.style';

import PropTypes from 'prop-types';
import { PureComponent } from 'react';

export class InstallPromptAndroid extends PureComponent {
    static propTypes = {
        handleBannerClose: PropTypes.func.isRequired,
        handleAppInstall: PropTypes.func.isRequired
    };

    renderCloseButton() {
        const { handleBannerClose } = this.props;

        return (
            <button
              block="InstallPromptAndroid"
              elem="Close"
              onClick={ handleBannerClose }
              aria-label={ __('Close') }
            />
        );
    }

    renderContent() {
        return (
            <p block="InstallPromptAndroid" elem="Content">
                { __('Add Zellbury lite-app to your home screen for a faster app-like experience!') }
            </p>
        );
    }

    renderInstallButton() {
        const { handleAppInstall } = this.props;

        return (
            <button
              block="InstallPromptAndroid"
              elem="Button"
              mix={ { block: 'Button' } }
              onClick={ handleAppInstall }
            >
                { __('Add to home screen') }
            </button>
        );
    }

    render() {
        return (
            <div block="InstallPromptAndroid">
                { this.renderCloseButton() }
                { this.renderContent() }
                { this.renderInstallButton() }
            </div>
        );
    }
}

export default InstallPromptAndroid;
