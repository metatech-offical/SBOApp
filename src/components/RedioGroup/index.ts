export {default as RadioGroup} from './RedioGroup';

export interface RadioOption {
  label: string;
  value: string | number;
}

export interface RadioGroupProps {
  options: RadioOption[];
  selectedValue?: string | number;
  onValueChange: (value: string | number) => void;
  containerStyle?: any;
  itemStyle?: any;
  textStyle?: any;
  selectedTextStyle?: any;
  radioButtonStyle?: any;
  selectedRadioButtonStyle?: any;
  direction?: 'row' | 'column';
  disabled?: boolean;
}
