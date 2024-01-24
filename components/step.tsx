'use client';
import React from 'react';
import {Table} from 'antd';
import {ColumnsType} from "antd/es/table";
import IUserStep from '@/lib/model/IUserStep';


const columns: ColumnsType<IUserStep> = [
    {
        title: 'Index',
        dataIndex: 'index',
        key: 'index',
        render: (value, record, index) => (<div>{index + 1}</div>),
    },
    {
        title: 'Coordinate',
        dataIndex: 'coordinate',
        key: 'coordinate',
        render: (value, record) => (<div>row: {Math.floor(record.cell / 9) + 1}, col: {(record.cell % 9) + 1}</div>),
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        render: (value, record) => (<div>{record.value}</div>),
    },
    {
        title: 'Operate Time',
        dataIndex: 'operate_time',
        key: 'operate_time',
        render: (value, record) => (<div>{record.create_time.toLocaleTimeString()}</div>),
    },

];


export function Step({userSteps, onMouseEnterRecord, onMouseLeaveRecord}: {
    userSteps: IUserStep[] | undefined,
    onMouseEnterRecord?: (record: IUserStep, index: number) => void,
    onMouseLeaveRecord?: (record: IUserStep, index: number) => void,
}) {
    return (
        <div className="flex flex-col items-center rounded-xl ">
            <h1 className="text-lg font-semibold ">User&apos;s Operation </h1>
            <div className="overflow-auto w-full">
                <Table style={{width: '100%'}} columns={columns} dataSource={userSteps}
                       pagination={{
                           hideOnSinglePage: true,
                           pageSize: 5,
                           defaultCurrent: userSteps ? Math.floor(userSteps.length / 5) : 1,
                           position: ['topLeft'],
                       }}/>
            </div>
        </div>
    );
}
