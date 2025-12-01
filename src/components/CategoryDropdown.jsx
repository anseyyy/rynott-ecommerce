import React, { useState, useRef, useEffect } from 'react';
import './CategoryDropdown.css';

const CategoryDropdown = ({
    categories = [],
    value = '',
    onChange,
    placeholder = 'Select Category',
    required = false,
    disabled = false,
    error = null
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    // Build hierarchical category tree
    const buildCategoryTree = (list = []) => {
        const map = {};
        list.forEach(c => {
            map[c._id] = { ...c, children: [], isActive: c.isActive !== false };
        });

        const roots = [];
        list.forEach(c => {
            const parentId = c.parentCategory?._id || c.parentCategory;
            if (parentId && map[parentId]) {
                map[parentId].children.push(map[c._id]);
            } else {
                roots.push(map[c._id]);
            }
        });

        return roots;
    };

    // Flatten with depth and filter by search
    const flattenWithDepth = (nodes = [], depth = 0, out = []) => {
        nodes.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        nodes.forEach(n => {
            if (n.isActive) {
                out.push({ ...n, depth });
            }
            if (n.children && n.children.length) {
                flattenWithDepth(n.children, depth + 1, out);
            }
        });
        return out;
    };

    // Filter categories based on search
    const filteredCategories = flattenWithDepth(buildCategoryTree(categories)).filter(cat =>
        searchTerm === '' ||
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Find selected category
    const selectedCategory = categories.find(cat => cat._id === value);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current.focus(), 100);
        }
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredCategories.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredCategories.length) {
                    const category = filteredCategories[highlightedIndex];
                    handleSelect(category);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
                break;
        }
    };

    const handleSelect = (category) => {
        onChange(category._id);
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
    };

    const handleToggle = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSearchTerm('');
            setHighlightedIndex(-1);
        }
    };

    // Get category icon based on name or use default
    const getCategoryIcon = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('electronics') || name.includes('tech')) return 'fas fa-laptop';
        if (name.includes('clothing') || name.includes('fashion')) return 'fas fa-tshirt';
        if (name.includes('home') || name.includes('furniture')) return 'fas fa-home';
        if (name.includes('books')) return 'fas fa-book';
        if (name.includes('sports')) return 'fas fa-football-ball';
        if (name.includes('beauty') || name.includes('cosmetics')) return 'fas fa-heart';
        if (name.includes('food') || name.includes('grocery')) return 'fas fa-utensils';
        if (name.includes('toys')) return 'fas fa-puzzle-piece';
        if (name.includes('automotive') || name.includes('car')) return 'fas fa-car';
        if (name.includes('health') || name.includes('medical')) return 'fas fa-heartbeat';
        return 'fas fa-folder';
    };

    return (
        <div
            className={`category-dropdown ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
            ref={dropdownRef}
        >
            <label className="dropdown-label">
                Category {required && <span className="required">*</span>}
            </label>

            <div
                className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : 0}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <div className="selected-category">
                    {selectedCategory ? (
                        <>
                            <i className={`${getCategoryIcon(selectedCategory.name)} category-icon`}></i>
                            <span className="category-name">{selectedCategory.name}</span>
                            {selectedCategory.description && (
                                <span className="category-description">
                                    {selectedCategory.description}
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="placeholder">{placeholder}</span>
                    )}
                </div>
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} dropdown-arrow`}></i>
            </div>

            {error && <div className="error-text">{error}</div>}

            {isOpen && (
                <div className="dropdown-menu">
                    <div className="dropdown-search">
                        <i className="fas fa-search search-icon"></i>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="dropdown-options" role="listbox">
                        {filteredCategories.length === 0 ? (
                            <div className="no-results">
                                <i className="fas fa-search"></i>
                                <span>No categories found</span>
                            </div>
                        ) : (
                            filteredCategories.map((category, index) => (
                                <div
                                    key={category._id}
                                    className={`dropdown-option ${index === highlightedIndex ? 'highlighted' : ''
                                        } ${category._id === value ? 'selected' : ''}`}
                                    onClick={() => handleSelect(category)}
                                    role="option"
                                    aria-selected={category._id === value}
                                >
                                    <div className="option-content">
                                        <i className={`${getCategoryIcon(category.name)} option-icon`}></i>
                                        <div className="option-text">
                                            <span className="option-name">
                                                {"\u00A0".repeat(category.depth * 4)}
                                                {category.depth > 0 && <span className="tree-indicator">└ </span>}
                                                {category.name}
                                            </span>
                                            {category.description && (
                                                <span className="option-description">
                                                    {category.description}
                                                </span>
                                            )}
                                        </div>
                                        {category._id === value && (
                                            <i className="fas fa-check selected-check"></i>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;