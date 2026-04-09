import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange }) {
  return (
    <div className="searchbar">
      <Search size={16} className="searchbar-icon" />

      <input
        type="text"
        className="searchbar-input"
        placeholder="Search articles, feeds, categories..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      {value ? (
        <button
          type="button"
          className="searchbar-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
          title="Clear search"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  )
}