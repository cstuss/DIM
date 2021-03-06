import { IComponentOptions, IController } from 'angular';
import * as _ from 'lodash';
import template from './vendor-item.html';
import dialogTemplate from './vendor-item-dialog.html';
import { D1StoresService } from '../inventory/d1-stores.service';

export const VendorItem: IComponentOptions = {
  bindings: {
    saleItem: '<',
    totalCoins: '<'
  },
  template,
  controller: VendorItemCtrl
};

let otherDialog: any = null;

function VendorItemCtrl(this: IController, $scope, $element, ngDialog) {
  'ngInject';

  const vm = this;

  let dialogResult: any = null;

  vm.clicked = (e) => {
    e.stopPropagation();

    if (otherDialog) {
      if (ngDialog.isOpen(otherDialog.id)) {
        otherDialog.close();
      }
      otherDialog = null;
    }

    if (dialogResult) {
      if (ngDialog.isOpen(dialogResult.id)) {
        dialogResult.close();
        dialogResult = null;
      }
    } else {
      const item = vm.saleItem.item;

      const compareItems = _.flatMap(D1StoresService.getStores(), (store) => {
        return store.items.filter((i) => i.hash === item.hash);
      });

      const compareItemCount = _.sumBy(compareItems, (i) => i.amount);

      const itemElement = $element[0].getElementsByClassName('item')[0];

      dialogResult = ngDialog.open({
        template: dialogTemplate,
        overlay: false,
        className: `move-popup-dialog vendor-move-popup ${vm.extraMovePopupClass || ''}`,
        showClose: false,
        scope: $scope.$new(true),
        data: itemElement, // Dialog anchor
        controllerAs: 'vm',
        controller() {
          Object.assign(this, {
            settings: this.settings,
            item,
            saleItem: vm.saleItem,
            unlockStores: vm.saleItem.unlockedByCharacter.map((id) =>
              _.find(D1StoresService.getStores(), { id })
            ),
            compareItems,
            compareItem: _.take(compareItems),
            compareItemCount,
            setCompareItem(item) {
              this.compareItem = item;
            }
          });
        },
        // Setting these focus options prevents the page from
        // jumping as dialogs are shown/hidden
        trapFocus: false,
        preserveFocus: false
      });

      otherDialog = dialogResult;

      dialogResult.closePromise.then(() => {
        dialogResult = null;
      });
    }
  };

  vm.$onDestroy = () => {
    if (dialogResult) {
      dialogResult.close();
    }
  };
}
