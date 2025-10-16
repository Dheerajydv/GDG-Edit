import React from "react";
import { Calendar, Clock, Search } from "lucide-react";
import { motion } from "framer-motion";
import styled, { css } from "styled-components";

const FiltersContainer = styled.div`
  margin-bottom: 2rem;
`;

const FiltersHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  border: none;
  background-color: ${({ active, theme }) =>
    active ? theme.googleColors.blue.darker : theme.colors.background.primary};
  color: ${({ active, theme }) =>
    active ? theme.colors.text.primary : theme.colors.text.secondary};

  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.googleColors.blue.dark : theme.googleColors.blue.darker};
  }
`;

const SearchContainer = styled(motion.div)`
  position: relative;
  width: 100%;

  @media (min-width: 640px) {
    width: 16rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  outline: none;
  border: none;

  &:focus {
    box-shadow: ${({ theme }) => theme.colors.shadows.medium};
  }
`;

const StyledSearchIcon = styled(Search)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  width: 1.5rem;
`;

const CategoryContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: 0.5rem;
`;

const CategoryTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  cursor: pointer;

  ${({ active, theme }) =>
    active
      ? css`
          background-color: #2563eb;
          color: ${theme.colors.text.primary};
        `
      : css`
          background-color: #f3f4f6;
          color: #1f2937;

          &:hover {
            background-color: #e5e7eb;
          }

          .dark & {
            background-color: #374151;
            color: #e5e7eb;

            &:hover {
              background-color: #4b5563;
            }
          }
        `}
`;

const EventFilters = ({ activeFilter, onFilterChange, categories, activeCategory, onCategoryChange }) => {
  return (
    <FiltersContainer>
      <FiltersHeader>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", gap: "1rem" }}
        >
          <FilterButton
            active={activeFilter === "upcoming"}
            onClick={() => onFilterChange("upcoming")}
          >
            <Calendar size={16} />
            Upcoming
          </FilterButton>
          <FilterButton
            active={activeFilter === "past"}
            onClick={() => onFilterChange("past")}
          >
            <Clock size={16} />
            Past
          </FilterButton>
        </motion.div>

        <SearchContainer
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SearchInput type="text" placeholder="Search events..." />
          <StyledSearchIcon size={18} />
        </SearchContainer>
      </FiltersHeader>

      <CategoryContainer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <CategoryLabel>Categories:</CategoryLabel>
        {categories.map((category) => (
          <CategoryTag
            key={category}
            active={activeCategory === category}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </CategoryTag>
        ))}
      </CategoryContainer>
    </FiltersContainer>
  );
};

EventFilters.defaultProps = {
  categories: ["All", "Workshop", "Conference", "Hackathon", "Meetup", "Study Jam"],
  activeCategory: "All",
};

export default EventFilters;
