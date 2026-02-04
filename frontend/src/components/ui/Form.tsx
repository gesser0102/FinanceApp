import { useFormContext } from 'react-hook-form';
import type { ReactNode } from 'react';

interface FormFieldProps {
  name: string;
  label?: string;
  children: ReactNode;
}

export function FormField({ name, label, children }: FormFieldProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-dark-200 mb-1">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-sm text-danger-400">{error}</p>}
    </div>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export function FormInput({ name, className = '', ...props }: FormInputProps) {
  const { register, formState: { errors } } = useFormContext();
  const hasError = !!errors[name];

  return (
    <input
      {...register(name, { valueAsNumber: props.type === 'number' })}
      id={name}
      className={`w-full px-4 py-2 bg-dark-800 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-dark-50 placeholder-dark-500 ${
        hasError ? 'border-danger-500' : 'border-dark-700'
      } ${className}`}
      {...props}
    />
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: { value: string | number; label: string }[];
}

export function FormSelect({ name, options, className = '', ...props }: FormSelectProps) {
  const { register, formState: { errors } } = useFormContext();
  const hasError = !!errors[name];

  return (
    <select
      {...register(name, { valueAsNumber: typeof options[0]?.value === 'number' })}
      id={name}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-dark-800 text-dark-50 ${
        hasError ? 'border-danger-500' : 'border-dark-700'
      } ${className}`}
      {...props}
    >
      <option value="" className="bg-dark-800 text-dark-400">Selecione...</option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-dark-800 text-dark-50">
          {option.label}
        </option>
      ))}
    </select>
  );
}
