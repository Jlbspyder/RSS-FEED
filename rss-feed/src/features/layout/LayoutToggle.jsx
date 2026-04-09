export function LayoutToggle({ layout, onChange }) {
  return (
    <div className="flex text-[12px] gap-2 w-full">
      {['cards', 'list'].map((option) => (
        <button
          key={option}
          className={`border px-1 rounded-sm hover:text-blue-400 ${layout === option ? 'primary' : 'ghost'}`}
          onClick={() => onChange(option)}
          type="button"
        >
          {option === 'cards' ? 'Cards' : 'List'}
        </button>
      ))}
    </div>
  )
}
