export default function Header({ onShowTemplate }) {
  return (
    <header className="border-b border-rule no-print">
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-navy flex items-center justify-center">
            <span className="font-display text-navy text-xl leading-none">C</span>
          </div>
          <div>
            <div className="font-display text-xl leading-none text-navy">CAP 2030</div>
            <div className="text-[10px] uppercase tracking-wider2 text-navy/50 mt-1">
              Analyseur de profil
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <button
            type="button"
            onClick={onShowTemplate}
            className="text-xs uppercase tracking-wider2 text-navy/70 hover:text-gold transition-colors"
          >
            Template RH imprimable
          </button>
        </nav>
      </div>
    </header>
  )
}
