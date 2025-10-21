'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Category } from '@/domain/entities/Category';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import CategoryNav from './CategoryNav';
import MobileMenu from './MobileMenu';
import styles from './Navbar.module.scss';

interface NavbarProps {
  categories: Category[];
}

const Navbar = ({ categories }: NavbarProps) => {
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <Link href={`/${locale}/directories`} className={styles.logo}>
            <span className={styles.logoText}>4Sale</span>
            <span className={styles.logoSubtext}>Directories</span>
          </Link>
        </div>

        {/* Desktop Category Navigation */}
        <div className={styles.desktopNav}>
          <CategoryNav categories={categories} locale={locale} />
        </div>

        {/* Actions Section */}
        <div className={styles.actionsSection}>
          {/* Language Switcher */}
          <div className={styles.languageSwitcher}>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburger}>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
              <span className={styles.hamburgerLine}></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        categories={categories}
        locale={locale}
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />
    </nav>
  );
};

export default Navbar;
