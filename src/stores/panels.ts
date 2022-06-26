import { defineStore } from 'pinia';

export interface IPanel {
  id: string;
  width: number;
  height: number;
  rotate: number;
  x: number;
  y: number;
}
export const usePanelsStore = defineStore('panels', {
  state: () => {
    return {
      panels: [] as IPanel[]
    };
  },
  persist: {
    enabled: true
  },
  actions: {
    set(panels: IPanel[]) {
      this.panels = panels;
    }
  }
});

// 这个有个特殊的地方，他不能单独保存 panel 数据，不然会导致一个无法同步的问题，所以他保存一个 id，再实时拉取 usePanelsStore 的数据返回
export const useSelectedPanelsStore = defineStore('selectedPanels', {
  state: () => {
    return {
      panelsID: [] as string[]
    };
  },
  getters: {
    panels(state) {
      // 每次取 usePanelsStore 的数据，筛选出选中的，这样可以避免数据不同步的问题
      const panelsStore = usePanelsStore();
      return panelsStore.panels.filter((panel) =>
        state.panelsID.includes(panel.id)
      );
    }
  },
  persist: {
    enabled: true
  },
  actions: {
    set(panels: IPanel[]) {
      // 保存也存 id
      this.panelsID = panels.map((panel) => panel.id);
    }
  }
});
