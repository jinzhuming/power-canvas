import keymaster from 'keymaster';
import { onMounted, onUnmounted, toRefs } from 'vue';
import { usePanelsStore, useSelectedPanelsStore } from '../../stores/panels';
import Message from '../../components/message';

export const useDeletePanels = () => {
  const selectedPanelsStore = useSelectedPanelsStore();
  const panelsStore = usePanelsStore();
  const { panels: selectedPanels } = toRefs(selectedPanelsStore);
  onMounted(() => {
    keymaster('delete, backspace', (e) => {
      e.preventDefault();
      panelsStore.clear(selectedPanels.value.map((panel) => panel.id));

      Message.success('删除成功');
    });

    onUnmounted(() => {
      keymaster.unbind('backspace');
      keymaster.unbind('delete');
    });
  });
};
