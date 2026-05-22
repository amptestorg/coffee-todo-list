import clsx from 'clsx'
import type { ResolvedTheme } from '../hooks/useTheme'

interface AmbientBackgroundProps {
  resolvedTheme: ResolvedTheme
}

export function AmbientBackground({ resolvedTheme }: AmbientBackgroundProps) {
  const isLight = resolvedTheme === 'light'

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className={clsx(
          'absolute -top-32 -left-32 h-[36rem] w-[36rem] rounded-full blur-3xl animate-steam-1',
          isLight ? 'bg-accent-caramel/14' : 'bg-accent-caramel/25',
        )}
      />
      <div
        className={clsx(
          'absolute -top-20 right-[-10rem] h-[32rem] w-[32rem] rounded-full blur-3xl animate-steam-2',
          isLight ? 'bg-accent-cream/20' : 'bg-accent-cream/12',
        )}
      />
      <div
        className={clsx(
          'absolute bottom-[-12rem] left-1/3 h-[34rem] w-[34rem] rounded-full blur-3xl animate-steam-1 [animation-delay:-7s]',
          isLight ? 'bg-accent-espresso/12' : 'bg-accent-espresso/30',
        )}
      />
      <div
        className={clsx(
          'absolute inset-0',
          isLight
            ? 'bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.2)_18%,_rgba(255,250,242,0.82))]'
            : 'bg-[radial-gradient(ellipse_at_top,_transparent_30%,_rgba(20,8,0,0.65))]',
        )}
      />
    </div>
  )
}
