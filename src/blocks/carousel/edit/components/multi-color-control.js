import clsx from 'clsx';
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { reset as resetIcon } from '@wordpress/icons';

import { __experimentalColorGradientControl as ColorGradientControl, __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { Dropdown, Button, ColorIndicator, Flex, FlexItem, __experimentalZStack as ZStack, __experimentalHStack as HStack, __experimentalToolsPanelItem as ToolsPanelItem, __experimentalDropdownContentWrapper as DropdownContentWrapper, TabPanel } from '@wordpress/components';

function ColorPanelTab({
    isGradient,
    inheritedValue,
    colorValue,
    setValue,
    colorGradientControlSettings,
}) {
    return (
        <ColorGradientControl
            { ...colorGradientControlSettings }
            showTitle={ false }
            enableAlpha
            __experimentalIsRenderedInSidebar
            colorValue={ isGradient ? undefined : inheritedValue }
            gradientValue={ isGradient ? inheritedValue : undefined }
            onColorChange={ isGradient ? undefined : setValue }
            onGradientChange={ isGradient ? setValue : undefined }
            clearable={ inheritedValue === colorValue }
            headingLevel={ 3 }
        />
    );
}

const MultiColorControl = ({
    label,
    colors,
    clientId,
    resetAllFilter
}) => {
    const dropdownButtonRef = useRef();
    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    if (!colorGradientSettings.hasColorsOrGradients) {
        return null;
    }

    const tabs = colors.map(color => ({
        key: color.key,
        label: color.label,
        colorValue: color.value?.color ?? '',
        inheritedValue: color.value?.color ?? '',
        setValue: color.setValue,
    }));

    const hasValue = () => colors.some(color => Boolean(color.value?.color));

    const resetValue = () => {
        colors.forEach(color => color.setValue());
    };

    const LabeledColorIndicators = ({ indicators, label }) => (
        <HStack justify="flex-start">
            <ZStack isLayered={ false } offset={ -8 }>
                { indicators.map((indicator, index) => (
                    <Flex key={ index } expanded={ false }>
                        <ColorIndicator colorValue={ indicator } />
                    </Flex>
                ))}
            </ZStack>
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
                                <LabeledColorIndicators
                                    indicators={ tabs.map((tab) => tab.colorValue) }
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
                            <TabPanel
                                className="color-tab-panel"
                                activeClass="is-active"
                                tabs={ tabs.map((tab) => ({
                                    name: tab.key,
                                    title: tab.label,
                                })) }
                            >
                                {(tab) => {
                                    const current = tabs.find((t) => t.key === tab.name);
                                    if (!current) return null;

                                    const { key, ...rest } = current;

                                    return (
                                        <ColorPanelTab
                                            key={ key }
                                            { ...rest }
                                            colorGradientControlSettings={ colorGradientSettings }
                                        />
                                    );
                                }}
                            </TabPanel>
                        </div>
                    </DropdownContentWrapper>
                )}
            />
        </ToolsPanelItem>
    );
};

export default MultiColorControl;