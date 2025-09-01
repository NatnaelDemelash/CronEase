import { ModeToggle } from '@/components/ModeToggle';
import { ThemeProvider } from '@/components/theme-provider';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <div>Welcom to CronEase!</div>
      <p>
        Stop guessing. Describe your schedule in plain English and let our AI
        generate the perfect cron expression for you.
      </p>
      <ModeToggle />
    </>
  );
}
