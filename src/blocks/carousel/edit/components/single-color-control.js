import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { reset as resetIcon } from '@wordpress/icons';

import { __experimentalColorGradientControl as ColorGradientControl, __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';

import { Dropdown, Button, ColorIndicator, Flex, FlexItem, __experimentalHStack as HStack, __experimentalToolsPanelItem as ToolsPanelItem, __experimentalDropdownContentWrapper as DropdownContentWrapper } from '@wordpress/components';

const SingleColorControl = ({ label, colorValue, setValue, clientId, resetAllFilter }) => {
    const dropdownButtonRef = useRef();
    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    if (!colorGradientSettings.hasColorsOrGradients) {
        return null;
    }

    const inheritedValue = colorValue?.color ?? '';
    const hasValue = () => Boolean(colorValue?.color);
    const resetValue = () => setValue();

    const LabeledColorIndicator = ({ colorValue, label }) => (
        <HStack justify="flex-start">
            <Flex expanded={ false }>
                <ColorIndicator colorValue={ colorValue } />
            </Flex>
            <FlexItem className="block-editor-panel-color-gradient-settings__color-name">
                { label }
            </FlexItem>
        </HStack>
    );
    
    return (
        <ToolsPanelItem
            className="block-editor-tools-panel-color-gradient-settings__item"
            hasValue={ hasValue }
            label={ label }
            onDeselect={ resetValue }
            resetAllFilter={ resetAllFilter || resetValue }
            isShownByDefault
            panelId={ clientId }
        >
            <Dropdown
                className='block-editor-tools-panel-color-gradient-settings__dropdown'
                popoverProps={{ placement: 'left-start', offset: 36, shift: true }}
                renderToggle={({ onToggle, isOpen }) => {
                    const toggleProps = {
                        onClick: onToggle,
                        className: clsx(
                            'block-editor-panel-color-gradient-settings__dropdown',
                            { 'is-open': isOpen }
                        ),
                        'aria-expanded': isOpen,
                        ref: dropdownButtonRef,
                    };
                    return (
                        <>
                            <Button { ...toggleProps } __next40pxDefaultSize>
                                <LabeledColorIndicator
                                    colorValue={ inheritedValue }
                                    label={ label }
                                />
                            </Button>
                            {hasValue() && (
                                <Button
                                    __next40pxDefaultSize
                                    icon={ resetIcon }
                                    className="block-editor-panel-color-gradient-settings__reset"
                                    size="small"
                                    label={ __('Reset', 'groundworx-carousel') }
                                    onClick={() => {
                                        resetValue();
                                        if (isOpen) onToggle();
                                        dropdownButtonRef.current?.focus();
                                    }}
                                />
                            )}
                        </>
                    );
                }}
                renderContent={() => (
                    <DropdownContentWrapper paddingSize="none">
                        <div className="block-editor-panel-color-gradient-settings__dropdown-content">
                            <ColorGradientControl
                                { ...colorGradientSettings }
                                showTitle={ false }
                                enableAlpha
                                __experimentalIsRenderedInSidebar
                                colorValue={ inheritedValue }
                                onColorChange={ setValue }
                                clearable={ inheritedValue === inheritedValue }
                                headingLevel={ 3 }
                            />
                        </div>
                    </DropdownContentWrapper>
                )}
            />
        </ToolsPanelItem>
    );
};

export default SingleColorControl;