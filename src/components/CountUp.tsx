import React from 'react';
import ReactCountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  start?: number;
  delay?: number;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 2, suffix = '', start = 0, delay = 0 }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3
  });

  return (
    <span ref={ref}>
      {inView && (
        <ReactCountUp
          start={start}
          end={end}
          duration={duration}
          suffix={suffix}
          delay={delay}
          separator=","
          useEasing={true}
          useGrouping={true}
          decimals={0}
        />
      )}
    </span>
  );
};

export default CountUp;