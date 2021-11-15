import { Injectable } from '@angular/core';
import { reduce } from 'lodash';
import { MessageForm, SupportedMessagePropTypes, TypeToMessageForm } from 'src/app/messages-table/model/message-forms';
import { GetMessagePropDefinitionResponse } from '../../../../../shared/messages.model';


const DEFAULT_FORM_FIELDS_OPTIONS: TypeToMessageForm = {
  String: { type: 'input', isEditable: true},
  Date: { type: 'datepicker', isEditable: true },
  Enum: { type: 'select', isEditable: true },
  Boolean: { type: 'checkbox', isEditable: true },
};


@Injectable()
export class MessageFormDefinitionService {

  constructor() { }

   createFormDefinitionsForMessageProps(definition: GetMessagePropDefinitionResponse): Record<string, MessageForm> {
    return reduce(definition.messageDefinition, (acc: Record<string, MessageForm>, val: any, key: string) => {
      acc[key] = this.getDefaultPropDefinitions(val.type);
      acc[key].required = val.required || false;

      if (acc[key].type === 'select') {
        for (const subKey in val) {
          if (Array.isArray(val[subKey])) {
            acc[key].selectionValues = val[subKey];
          }
        }
      }


      return acc;
    }, {})
  }


  private getDefaultPropDefinitions(prop: SupportedMessagePropTypes): MessageForm {
    return DEFAULT_FORM_FIELDS_OPTIONS[prop]
  }
}
