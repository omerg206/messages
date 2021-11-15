


export interface MessageForm {
  type: 'input' | 'checkbox' | 'select' | 'datepicker';
  required?: boolean;
  selectionValues?: string[];
  isEditable?: boolean;

}


export type TypeToMessageForm = Record<SupportedMessagePropTypes, MessageForm>

export type SupportedMessagePropTypes = 'String' | 'Boolean' | 'Date' | 'Enum';
