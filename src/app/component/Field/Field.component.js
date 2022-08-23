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

/* eslint jsx-a11y/label-has-associated-control: 0 */
// Disabled due bug in `renderCheckboxInput` function

import './Field.style';

import PropTypes from 'prop-types';
import { PureComponent, Fragment } from 'react';

import FieldInput from 'Component/FieldInput';
import FieldSelect from 'Component/FieldSelect';
import FieldTextarea from 'Component/FieldTextarea';
import { MixType } from 'Type/Common';

import Input from 'Component/Input';
import { citiesType } from 'Type/Config';
import BrowserDatabase from 'Util/BrowserDatabase';

import {
    CHECKBOX_TYPE,
    NUMBER_TYPE,
    PASSWORD_TYPE,
    RADIO_TYPE,
    SELECT_TYPE,
    TEXTAREA_TYPE,
    EMAIL_TYPE,
    TEL_TYPE,
    AUTOSUGGEST_TYPE,
    UP_KEY_CODE,
    DOWN_KEY_CODE,
    ENTER_KEY_CODE,
    TEL_PHONE_TYPE,
    OTP_MASK_TYPE,
    TEL_MASK_TYPE
} from './Field.config';

/**
 * Input fields component
 * @class Field
 */
export class Field extends PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        isControlled: PropTypes.bool,
        type: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onChangeCheckbox: PropTypes.func.isRequired,
        onFocus: PropTypes.func.isRequired,
        onKeyPress: PropTypes.func.isRequired,
        onKeyEnterDown: PropTypes.func.isRequired,
        onClick: PropTypes.func.isRequired,
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        message: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool
        ]),
        validation: PropTypes.arrayOf(PropTypes.string),
        checked: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string
        ]),
        mix: MixType,
        min: PropTypes.number,
        max: PropTypes.number,
        onHandleChange: PropTypes.func.isRequired,
        onChangeTxt: PropTypes.func,
        onChangeAuto: PropTypes.func,
        onClickAuto: PropTypes.func,
        // onClickMethod: PropTypes.func,
        onKeyDownAuto: PropTypes.func,
        autofocus: PropTypes.bool,
        autocomplete: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool
        ]),
        activeSuggestion: PropTypes.number,
        filteredSuggestions: PropTypes.arrayOf(PropTypes.string),
        showSuggestions: PropTypes.bool
    };

    static defaultProps = {
        min: 1,
        max: 99,
        isControlled: false,
        checked: false,
        mix: {},
        label: '',
        value: null,
        message: '',
        validation: [],
        onClickAuto: () => { },
        onKeyDownAuto: () => { },
        onChangeTxt: () => { },
        onChangeAuto: () => { },
        // onClickMethod:  () => { },
        activeSuggestion: 0,
        filteredSuggestions: [],
        showSuggestions: false,
        autocomplete: 'on',
        autofocus: false
    };

    onHandleChange = this.onHandleChange.bind(this);

    onChangeMobile = this.onChangeMobile.bind(this);

    onChangeTxt = this.onChangeTxt.bind(this);

    onChangeAuto = this.onChangeAuto.bind(this);

    onClickAuto = this.onClickAuto.bind(this);

    // onClickMethod = this.onClickMethod.bind(this);

    onKeyDownAuto = this.onKeyDownAuto.bind(this);

    constructor(props) {
        super(props);

        const activeSuggestion = 0;
        const filteredSuggestions = [];
        const showSuggestions = false;

        this.state = {
            activeSuggestion,
            filteredSuggestions,
            showSuggestions
        };
    }

    onChangeTxt(event) {
        if (event.target && event.target.type && event.target.id && event.target.type == "tel" && (event.target.id == "phone" || event.target.id == "telephone") && event.target.value) {
            event.target.value = event.target.value.replace('+92', '');
            if (event.target.value.indexOf('0') == 0)
                event.target.value = event.target.value.slice(event.target.value.indexOf('0') + 1, event.target.value.length)
            if (event.target.value.length > 10) {
                event.target.value = event.target.value.slice(0, 10);
            }
            if (event.target.value.length > 0 && event.target.value.indexOf('3') > -1) {
                event.target.value = event.target.value.slice(event.target.value.indexOf('3'), event.target.value.length);
            }

        }
        if (typeof event === 'string' || typeof event === 'number') {
            return this.onHandleChange(event);
        }

        return this.onHandleChange(event.target.value);
    }

    onChangeAuto(event) {
        let userInput = event.target.value;
        const { PkCities } = BrowserDatabase.getItem('config') || {
            PkCities: []
        };
        let suggestions = PkCities.map(city => (city.label));

        // Filter our suggestions that don't contain the user's input
        const filteredSuggestions = suggestions.filter(
            suggestion =>
                suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        );

        this.setState({
            activeSuggestion: 0,
            filteredSuggestions,
            showSuggestions: true
        });

        if (typeof event === 'string' || typeof event === 'number') {
            return this.onHandleChange(event);
        }

        return this.onHandleChange(event.target.value);
    }

    // onClickMethod (event){
    //     const {value} = this.state;
    //     if(!value){
    //         this.setState({value : "+92"})
    //     }

    // }

    onClickAuto(event) {
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            value: event.target.innerText
        });
        this.onChangeTxt(event.target.innerText);
    }

    onKeyDownAuto(event) {
        const { activeSuggestion, filteredSuggestions } = this.state;

        // User pressed the enter key, update the input and close the
        // suggestions
        if (event.keyCode === ENTER_KEY_CODE) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                value: filteredSuggestions[activeSuggestion]
            });
            this.onChangeTxt(filteredSuggestions[activeSuggestion]);
        }
        // User pressed the up arrow, decrement the index
        else if (event.keyCode === UP_KEY_CODE) {
            if (activeSuggestion === 0) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        // User pressed the down arrow, increment the index
        else if (event.keyCode === DOWN_KEY_CODE) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    }

    onHandleChange(value, shouldUpdate = true) {
        const {
            isControlled,
            onChange,
            type,
            min,
            max
        } = this.props;
        switch (type) {
            case NUMBER_TYPE:
                const isValueNaN = Number.isNaN(parseInt(value, 10));
                if (min > value || value > max || isValueNaN) {
                    break;
                }
                if (onChange && shouldUpdate) {
                    onChange(value);
                }
                if (!isControlled) {
                    this.setState({ value });
                }
                break;
            default:
                if (onChange) {
                    onChange(value);
                }
                if (!isControlled) {
                    this.setState({ value });
                }
        }
    }

    onChangeMobile(event) {
        if (typeof event === 'string' || typeof event === 'number') {
            return this.onHandleChange(event);
        }

        if (event && event.target.value) {
            return this.onHandleChange(event.target.value);
        }
    }

    renderTextarea() {
        return (
            <FieldTextarea
                {...this.props}
            />
        );
    }

    /**
     * Render Type Text, default value is passed from parent
     * handleToUpdate used to pass child data to parent
     */
    renderTypeText() {
        return (
            <FieldInput
                {...this.props}
                type="text"
            />
        );
    }

    renderTypePassword() {
        return (
            <FieldInput
                {...this.props}
                type="password"
            />
        );
    }

    renderTypeOtp() {
        const { value } = this.state;
        return (
            <Input
                {...this.props}
                type="tel"
                onChange={this.onChangeTxt}
                onFocus={this.onFocus}
                onClick={this.onClick}
                value={value}

            />
        );
    }

    renderTypeNumber() {
        const {
            min,
            max,
            value,
            onKeyEnterDown,
            IsInMeter,
            onHandleChange
        } = this.props;
        return (
            <>
                <div style={{
                    /* background-color: red; */
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    /* width: 100%; */
                    justifyContent: "center",
                }}>

                    <button
                        disabled={+value === min}

                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={() => this.onHandleChange(+value - (IsInMeter ? 0.5 : 1))}
                        style={this.props.customeMinusStyle}
                    >
                        <span>–</span>
                    </button>
                    <FieldInput
                        {...this.props}
                        type="number"
                        readOnly
                        // eslint-disable-next-line react/jsx-no-bind
                        onChange={(e) => this.onHandleChange(e.target.value, false)}
                        onKeyDown={onKeyEnterDown}
                    />
                    <button
                        style={this.props?.customePlusStyle}
                        disabled={+value === max}
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={() => this.onHandleChange(+value + (IsInMeter ? 0.5 : 1))}
                    >
                        <span style={{}}>+</span>
                    </button>
                </div>


            </>
        );
    }

    renderCheckbox() {
        const {
            id,
            onChangeCheckbox
        } = this.props;

        return (
            <>
                <FieldInput
                    {...this.props}
                    type="checkbox"
                    onChange={onChangeCheckbox}
                />
                <label htmlFor={id} />
            </>
        );
    }

    renderRadioButton() {
        const {
            id,
            label,
            onClick
        } = this.props;

        return (
            <label htmlFor={id}>
                <FieldInput
                    {...this.props}
                    type="radio"
                    onChange={onClick}
                />
                <label htmlFor={id} />
                {label}
            </label>
        );
    }

    renderSelectWithOptions() {
        return (
            <FieldSelect
                {...this.props}
            />
        );
    }

    renderTypeEmail() {
        return (
            <FieldInput
                {...this.props}
                type="email"
                autofocus="true"
                autocomplete="email"
            />
        );
    }

    renderTypeTel() {
        return (
            <FieldInput
                {...this.props}
                type="tel"
            />
        );
    }

    renderTypeAuto() {
        const {
            value,
            activeSuggestion,
            filteredSuggestions,
            showSuggestions,
        } = this.state;

        let suggestionsListComponent;
        if (showSuggestions && value) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul class="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }

                            return (
                                <li className={className} key={suggestion} onClick={this.onClickAuto}>
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            }
        }

        return (
            <Fragment>
                <FieldInput
                    {...this.props}
                    type="text"
                    onChange={this.onChangeAuto}
                    onKeyDown={this.onKeyDownAuto}
                />
                {this.renderLabel()}
                {suggestionsListComponent}
            </Fragment>
        );
    }

    renderInputOfType(type) {
        switch (type) {
            case CHECKBOX_TYPE:
                return this.renderCheckbox();
            case RADIO_TYPE:
                return this.renderRadioButton();
            case NUMBER_TYPE:
                return this.renderTypeNumber();
            case TEXTAREA_TYPE:
                return this.renderTextarea();
            case PASSWORD_TYPE:
                return this.renderTypePassword();
            case TEL_TYPE:
                return this.renderTypeTel();
            case TEL_PHONE_TYPE:
                return this.renderTypePhone();
            case TEL_MASK_TYPE:
                return this.renderTypeTelMask();
            case SELECT_TYPE:
                return this.renderSelectWithOptions();
            case TEL_TYPE:
                return this.renderTypeTel();
            case EMAIL_TYPE:
                return this.renderTypeEmail();
            case OTP_MASK_TYPE:
                return this.renderTypeOtp();
            case AUTOSUGGEST_TYPE:
                return this.renderTypeAuto();
            default:
                return this.renderTypeText();
        }
    }

    renderLabel() {
        const { id, label, validation } = this.props;
        const isRequired = validation.includes('notEmpty');

        if (!label) {
            return null;
        }

        return (
            <label
                block="Field"
                elem="Label"
                mods={{ isRequired }}
                htmlFor={id}
            >
                {label}
            </label>
        );
    }

    renderTypePhone() {
        const { value } = this.state;
        return (
            <Input
                {...this.props}
                type="tel"
                onChange={this.onChangeTxt}
                // onFocus={this.onFocus}
                // onClick={this.onClickMethod}
                value={value}
            />
        );
    }

    renderMessage() {
        const { message } = this.props;

        if (!message) {
            return null;
        }

        return (
            <p block="Field" elem="Message">
                {message}
            </p>
        );
    }

    render() {
        const {
            mix,
            type,
            message
        } = this.props;

        if (type != AUTOSUGGEST_TYPE) {
            return (
                <div
                    block="Field"
                    mods={{ type, hasError: !!message }}
                    mix={mix}
                >
                    {this.renderInputOfType(type)}
                    {this.renderLabel()}
                    {this.renderMessage()}
                </div>
            );
        } else {
            return (
                <div
                    block="Field"
                    mods={{ type, hasError: !!message }}
                    mix={mix}
                >
                    {this.renderInputOfType(type)}
                    {this.renderMessage()}
                </div>
            );
        }
    }
}

export default Field;