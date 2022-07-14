import { ref, reactive } from 'vue';
import { useMessageStore } from '../../stores/message';

// 初始消息列表
export interface IMessage {
  type: string;
  title: string;
}

// 消息显示时长
const timer = ref<number>(3000);

// 处理数据
const handleData = (type: string, title: string) => {
  const messageStore = useMessageStore();
  // 数据添加
  messageStore.set({ type, title });

  // 数据删除
  setTimeout(() => {
    if (messageStore.messageList.length > 0) {
      messageStore.shift();
    }
  }, timer.value);

  // 容器挂载
};

interface MessageImplements {
  info(title: string): void;
  wraning(title: string): void;
  success(title: string): void;
  error(title: string): void;
}

class MessageClass implements MessageImplements {
  // 普通提示
  info(title: string): void {
    handleData('info', title);
  }

  // 警告提示
  wraning(title: string): void {
    handleData('wraning', title);
  }

  // 成功提示
  success(title: string): void {
    handleData('success', title);
  }

  // 错误提示
  error(title: string): void {
    handleData('error', title);
  }
}

const Message = new MessageClass();

export default Message;
