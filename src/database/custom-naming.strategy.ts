import {
  DefaultNamingStrategy,
  NamingStrategyInterface,
} from 'typeorm';
import { snakeCase, sentenceCase } from 'change-case';
import { plural } from 'pluralize';

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {

  public tableName(targetName: string, userSpecifiedName: string): string {
    if (userSpecifiedName) {
      return userSpecifiedName;
    }
    const words = sentenceCase(targetName).split(' ');
    const lastWord = plural(words.pop());
    return words.concat(lastWord).join('_').toLowerCase();
  }

  public columnName(propertyName: string, customName: string, embeddedPrefixed: string[]): string {
    return customName || snakeCase(propertyName);
  }

  public columnNameCustomized(customName: string): string {
    return customName;
  }

  public relationName(propertyName: string): string {
    return snakeCase(propertyName);
  }
}
