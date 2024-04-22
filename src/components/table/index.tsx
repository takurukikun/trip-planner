'use client'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Spinner,
  Table as TableComponent,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import { useCallback, useMemo, useState } from 'react'
import { FaArrowDown } from 'react-icons/fa'
import { ColumnProps, TableProps } from '@/components/table/types'

const Table = <T extends Record<string, any>>({
  data,
  columns,
  showColumnsFilter = false,
  rowsPagination = [5, 10, 15, 20, 50, 100],
  loading = false,
}: TableProps<T>) => {
  const [visibleColumns, setVisibleColumns] = useState<
    ColumnProps<T>['uid'][] | 'all'
  >('all')

  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortDescriptor, setSortDescriptor] = useState({
    column: String(columns[0].uid),
    direction: 'ascending' as any,
  })

  const [page, setPage] = useState(1)

  const filterColumns = useMemo(() => {
    return columns.filter((column) => column.filterable)
  }, [columns])

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    )
  }, [columns, visibleColumns])

  const filteredItems = useMemo(() => {
    if (!data?.length) return []
    let filteredData = [...data]

    return filteredData.sort((a, b) => {
      const first = a[sortDescriptor.column]
      const second = b[sortDescriptor.column]
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [data, sortDescriptor])

  const pages = Math.ceil(filteredItems.length / rowsPerPage)

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const onRowsPerPageChange = useCallback((value: number) => {
    setRowsPerPage(value)
    setPage(1)
  }, [])

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          {showColumnsFilter && (
            <div className="flex gap-3">
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<FaArrowDown className="text-small" />}
                    variant="flat"
                  >
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Columns"
                  closeOnSelect={false}
                  selectedKeys={
                    visibleColumns === 'all'
                      ? 'all'
                      : [...visibleColumns].map(String)
                  }
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns as any}
                >
                  {columns.map((column) => (
                    <DropdownItem
                      key={String(column.uid)}
                      className="capitalize"
                    >
                      {column.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
    )
  }, [columns, showColumnsFilter, visibleColumns])

  const bottomContent = useMemo(() => {
    return (
      <>
        <div className="flex items-center justify-between px-2 py-2">
          <Pagination
            showControls
            showShadow
            color="primary"
            size="sm"
            initialPage={1}
            page={page}
            total={pages === 0 ? 1 : pages}
            onChange={(page) => {
              setPage(page)
            }}
            variant="light"
            classNames={{ cursor: 'font-bold text-white' }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-small dark:text-default-400">
            {filteredItems.length} records
          </span>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" size="sm">
                {rowsPerPage}
                <span className="mr-2 text-small dark:text-default-400">
                  per page
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="light"
              aria-label="Pagination"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={[rowsPerPage]}
            >
              {rowsPagination.map((value) => (
                <DropdownItem
                  key={value}
                  onClick={() => onRowsPerPageChange(value)}
                >
                  {value}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </>
    )
  }, [
    page,
    pages,
    filteredItems.length,
    rowsPerPage,
    rowsPagination,
    onRowsPerPageChange,
  ])

  return (
    <TableComponent
      id="Table-NextUI"
      aria-label="Tabela"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[482px]',
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor as any}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={String(column.uid)}
            align={'start'}
            allowsSorting={column.sortable}
            className={`text-md ${
              column.uid === 'actions' ? 'w-[10%] text-center' : ''
            }`}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'Sem dados'}
        items={items}
        isLoading={loading}
        loadingContent={<Spinner />}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              return (
                <TableCell className="whitespace-nowrap">
                  {(() => {
                    const column = headerColumns.find(
                      (column) => column.uid === columnKey,
                    )
                    return (
                      <>
                        {column?.renderCell
                          ? column.renderCell(item)
                          : item[columnKey as ColumnProps<T>['uid']]}
                      </>
                    )
                  })()}
                </TableCell>
              )
            }}
          </TableRow>
        )}
      </TableBody>
    </TableComponent>
  )
}

export default Table
