import { defineStore } from 'pinia';

export interface ICanvasOffset {
  x: number;
  y: number;
}
export const useCanvasOffsetStore = defineStore('canvasOffset', {
  state: () => {
    return { x: 0, y: 0 };
  },
  persist: {
    enabled: true
  },
  actions: {
    set(offset: ICanvasOffset) {
      this.x = offset.x;
      this.y = offset.y;
    }
  }
});

export const useCanvasZoomStore = defineStore('canvasZoom', {
  state: () => {
    return { zoom: 1 };
  },
  persist: {
    enabled: true
  },
  actions: {
    set(zoom: number) {
      this.zoom = zoom;
    }
  }
});
