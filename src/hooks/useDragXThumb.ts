import { onUnmounted, ref, Ref, toRefs } from 'vue';
import { throttle } from 'lodash';
import { useCanvasOffsetStore } from '../stores/dashboard';

export const useDragXThumb = (
  dom: HTMLDivElement,
  ratio: Ref<number>,
  thumbTransformX: Ref<number>,
  active: Ref<boolean>
) => {
  const canvasOffsetStore = useCanvasOffsetStore();
  const { y } = toRefs(canvasOffsetStore);
  let offsetX = 0;

  /*
   * 监听全局移动（因为鼠标经常移动到滑块外边去）
   * */
  const onMouseMove = throttle((e: MouseEvent) => {
    e.preventDefault();
    const newOffsetX = e.clientX + offsetX;
    canvasOffsetStore.set({ y: y.value, x: -newOffsetX * ratio.value });
    thumbTransformX.value = newOffsetX;
  }, 15);

  /*
   * 监听全局抬起鼠标
   * */
  const onMouseUp = throttle(() => {
    // 解除监听
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
    active.value = false;
  }, 15);

  /*
   * 监听滑块按下
   * */
  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    // 通过和当前滑块的位置和按下的位置计算得到一个差值，后面鼠标移动的时候减去这个差值就可以得到滑块所处的位置
    offsetX = thumbTransformX.value - e.clientX;

    // 开启移动监听
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    active.value = true;
  };
  dom.addEventListener('mousedown', onMouseDown);

  onUnmounted(() => {
    dom.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onMouseMove);
  });
};
