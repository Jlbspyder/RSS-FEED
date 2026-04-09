export function LayoutToggle({ layout, onChange }) {
  return (
    <div className="flex gap-2 w-full">
      {['cards', 'list'].map((option) => (
        <button
          key={option}
          className={`button w-15 ${layout === option ? 'primary' : 'ghost'}`}
          onClick={() => onChange(option)}
          type="button"
        >
          {option === 'cards' ? 'Cards' : 'List'}
        </button>
      ))}
    </div>
  )
}
