// @flow
import React from "react";
import styled from "styled-components";

import defaultTheme from "../defaultTheme";
import Button from "../Button";
import ButtonLink from "../ButtonLink";
import FormLabel from "../FormLabel";
import FormFeedback from "../FormFeedback";
import Attachment from "../icons/Attachment";
import CloseCircle from "../icons/CloseCircle";
import { rtlSpacing } from "../utils/rtl";
import getSpacingToken from "../common/getSpacingToken";
import getFieldDataState from "../common/getFieldDataState";
import useErrorTooltip from "../FormFeedback/hooks/useErrorTooltip";
import formElementFocus from "../InputField/helpers/formElementFocus";
import { StyledButtonPrimitive } from "../primitives/ButtonPrimitive";

import type { Props } from "./index";

const Field = styled.label`
  font-family: ${({ theme }) => theme.orbit.fontfamily};
  display: block;
  position: relative;
  width: 100%;
  margin-bottom: ${getSpacingToken};
`;

Field.defaultProps = {
  theme: defaultTheme,
};

const FakeInput = styled(({ children, className }) => <div className={className}>{children}</div>)`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: ${({ theme }) => rtlSpacing(theme.orbit.paddingInputFile)};
  height: ${({ theme }) => theme.orbit.heightInputNormal};
  border-radius: ${({ theme }) => theme.orbit.borderRadiusNormal};
  box-shadow: inset 0 0 0
    ${({ theme, error }) =>
      `${theme.orbit.borderWidthInput} ${
        error ? theme.orbit.borderColorInputError : theme.orbit.borderColorInput
      }`};
  background-color: ${({ theme }) => theme.backgroundInput};
  transition: box-shadow ${({ theme }) => theme.orbit.durationFast} ease-in-out;

  &:hover {
    box-shadow: inset 0 0 0
      ${({ theme, error }) =>
        `${theme.orbit.borderWidthInput} ${
          error ? theme.orbit.paletteRedNormalHover : theme.orbit.borderColorInputHover
        }`};
  }

  ${StyledButtonPrimitive}:active {
    box-shadow: none;
  }
`;

FakeInput.defaultProps = {
  theme: defaultTheme,
};

const Input = styled.input`
  // we need to hide the input, but not with display or visibility so we can trigger the focus
  opacity: 0;
  position: absolute;
  height: 0;

  &:focus ~ ${FakeInput} {
    ${formElementFocus}
  }
`;

Input.defaultProps = {
  theme: defaultTheme,
};

const getFileInputColor = ({ error, fileName }, theme) => {
  if (error) {
    return theme.orbit.paletteRedNormal;
  }
  if (fileName) {
    return theme.orbit.colorTextInput;
  }
  return theme.orbit.paletteInkLight;
};

const StyledFileInput = styled.div`
  font-family: ${({ theme }) => theme.orbit.fontFamily};
  color: ${({ error, fileName, theme }) => getFileInputColor({ error, fileName }, theme)};
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: ${({ theme }) => rtlSpacing(`0 0 0 ${theme.orbit.spaceSmall}`)};
`;

StyledFileInput.defaultProps = {
  theme: defaultTheme,
};

const CloseButton = styled.div`
  & svg {
    color: ${({ theme }) => theme.orbit.paletteInkLight};
  }
`;

CloseButton.defaultProps = {
  theme: defaultTheme,
};

const InputFile = React.forwardRef<Props, HTMLInputElement>((props, ref) => {
  const {
    placeholder = "No file selected",
    buttonLabel = "Select file",
    onRemoveFile,
    dataTest,
    spaceAfter,
    help,
    error,
    onFocus,
    onBlur,
    name,
    label,
    onChange,
    allowedFileTypes,
    tabIndex,
    fileName,
    insideInputGroup,
  } = props;

  const {
    tooltipShown,
    tooltipShownHover,
    setTooltipShownHover,
    labelRef,
    iconRef,
    handleFocus,
    handleBlur,
  } = useErrorTooltip({ onFocus, onBlur });

  return (
    <Field spaceAfter={spaceAfter} ref={label ? null : labelRef}>
      <Input
        data-test={dataTest}
        data-state={insideInputGroup ? undefined : getFieldDataState(!!props.error)}
        type="file"
        name={name}
        error={error}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        accept={allowedFileTypes}
        ref={ref}
        tabIndex={tabIndex}
      />
      {label && (
        <FormLabel
          filled={!!fileName}
          error={!!error}
          help={!!help}
          labelRef={labelRef}
          iconRef={iconRef}
          onMouseEnter={() => setTooltipShownHover(true)}
          onMouseLeave={() => setTooltipShownHover(false)}
        >
          {label}
        </FormLabel>
      )}
      <FakeInput error={error}>
        <Button type="secondary" size="small" iconLeft={<Attachment />} asComponent="div">
          {buttonLabel}
        </Button>
        <StyledFileInput fileName={fileName} error={error}>
          {fileName || placeholder}
        </StyledFileInput>
        {fileName && (
          <CloseButton>
            <ButtonLink
              type="secondary"
              transparent
              iconLeft={<CloseCircle />}
              onClick={ev => {
                ev.preventDefault();
                if (onRemoveFile) {
                  onRemoveFile();
                }
              }}
            />
          </CloseButton>
        )}
      </FakeInput>
      <FormFeedback
        help={help}
        error={error}
        iconRef={iconRef}
        labelRef={labelRef}
        tooltipShown={tooltipShown}
        tooltipShownHover={tooltipShownHover}
      />
    </Field>
  );
});

InputFile.displayName = "InputFile";

export default InputFile;
