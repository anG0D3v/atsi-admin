'use client';
import React from 'react';
import { Table } from 'antd';
import { type ColumnType, type ColumnGroupType } from 'antd/es/table';
import clsx from 'clsx';

interface ITableProps {
  loading?: boolean;
  classes?: any;
  datasource?: any[];
  name?: any;
  rowSelection?: any;
  columns: Array<ColumnType<any>> | Array<ColumnGroupType<any>>;
}
function CustomTable(props: ITableProps) {

  return (
    <Table
      columns={props.columns}
      className={clsx(props.classes)}
      loading={props.loading}
      dataSource={props.datasource}
      rowSelection={props.rowSelection}
      scroll={{
        x: '00vw',
      }}
      pagination={{
        defaultPageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: ['5', '20', '30'],
      }}
    />
  );
}

export default React.memo(CustomTable);
