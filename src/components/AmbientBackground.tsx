export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-32 h-[36rem] w-[36rem] rounded-full bg-accent-caramel/25 blur-3xl animate-steam-1" />
      <div className="absolute -top-20 right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-accent-cream/12 blur-3xl animate-steam-2" />
      <div className="absolute bottom-[-12rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-accent-espresso/30 blur-3xl animate-steam-1 [animation-delay:-7s]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_30%,_rgba(20,8,0,0.65))]" />
    </div>
  )
}
