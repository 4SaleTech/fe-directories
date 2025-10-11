'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import styles from './FilterDropdown.module.scss';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  paramName: string;
  currentValue?: string;
}

const FilterDropdown = ({ label, options, paramName, currentValue }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === '' || value === 'all') {
      // Remove the parameter if "all" is selected
      params.delete(paramName);

      // For filter param, also remove verified and featured
      if (paramName === 'filter') {
        params.delete('verified');
        params.delete('featured');
      }
    } else {
      // Handle special "filter" parameter for verified/featured
      if (paramName === 'filter') {
        params.delete('filter'); // Don't actually set "filter" param

        if (value === 'verified') {
          params.set('verified', 'true');
          params.delete('featured');
        } else if (value === 'featured') {
          params.set('featured', 'true');
          params.delete('verified');
        } else if (value === 'both') {
          params.set('verified', 'true');
          params.set('featured', 'true');
        }
      } else {
        params.set(paramName, value);
      }
    }

    // Navigate to new URL
    const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.push(newUrl);
    setIsOpen(false);
  };

  // Find current option label
  const currentOption = options.find(opt => opt.value === currentValue);
  const displayLabel = currentOption?.label || label;

  return (
    <div className={styles.filterDropdown} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{displayLabel}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={isOpen ? styles.rotated : ''}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <button
              key={option.value}
              className={`${styles.option} ${
                currentValue === option.value ? styles.active : ''
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
