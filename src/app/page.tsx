import { Text } from '@/components/atoms/Text';
import { cx } from '../../panda/css';
import { container } from '../../panda/patterns';

export default function Home() {
  return (
    <div className={cx(container())}>
      <Text as="h1" fontSize={'bodyLarge'}>
        Starter Next js 16
      </Text>
    </div>
  );
}
