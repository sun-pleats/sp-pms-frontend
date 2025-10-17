import { useState } from 'react';

export default function useDatatable() {
  const [filters, setFilters] = useState<DatatableFilter>({});
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [tableLoading, setTableLoading] = useState(true);

  const clearFilter = () => {
    setFilters({});
  };

  return {
    clearFilter,
    setRows,
    setFirst,
    setTableLoading,
    setTotalRecords,
    setFilters,
    tableLoading,
    totalRecords,
    first,
    rows,
    filters
  };
}
