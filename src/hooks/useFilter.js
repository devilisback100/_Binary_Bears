import { useMemo, useState } from "react";

export default function useFilter(items = [], filterFn = () => true, initial = {}) {
    const [filters, setFilters] = useState(initial);

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters(initial);
    };

    const filteredItems = useMemo(() => {
        return items.filter((item) => filterFn(item, filters));
    }, [items, filters, filterFn]);

    return {
        filters,
        updateFilter,
        resetFilters,
        filteredItems,
    };
}