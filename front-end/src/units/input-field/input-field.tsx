
import { Icon } from "../icons/icons";
import * as icon from "react-feather";

interface inputFieldPropTypes
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  iconname?: icon.Icon;
  inputType: string;
  inputName?: string;
  inputValue: string | number;
  error?: string;
  touched?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const InputField = ({
  iconname,
  inputType,
  inputValue,
  inputName,
  error,
  touched,
  onBlur,
  ...props
}: inputFieldPropTypes) => {
  const hasError = touched && error;
  
  return (
    <div className="flex flex-col">
      <div className={`flex rounded-lg p-4 bg-input-bg justify-between ${hasError ? 'border border-red-500' : ''}`}>
        <input
          type={inputType}
          className="bg-input-bg w-[85%] outline-none placeholder:text-grey-100"
          name={inputName}
          value={inputValue}
          onBlur={onBlur}
          {...props}
        />
        <Icon name={iconname ?? icon.X} textColor="#ADADAD" />
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-love">{error}</p>
      )}
    </div>
  );
};