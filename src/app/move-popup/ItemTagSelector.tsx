import * as React from 'react';
import { itemTags, TagValue } from '../inventory/dim-item-info';
import { t } from 'i18next';

interface Props {
  tag?: TagValue;
  onTagUpdated(tag?: TagValue);
}

export default class ItemTagSelector extends React.Component<Props> {
  render() {
    const { tag, onTagUpdated } = this.props;

    if (!tag) {
      return null;
    }

    return (
      <select onChange={(e) => onTagUpdated(e.currentTarget.value as TagValue)}>
        {itemTags.map((tagOption) => (
          <option key={tagOption.type} value={tagOption.type} selected={tag === tagOption.type}>
            {t('tagOption.label')}
          </option>
        ))}
      </select>
    );
  }
}