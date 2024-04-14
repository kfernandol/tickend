import React, { useRef, useState } from 'react'
//Components
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
//Hooks
import { useGet } from '../../services/api_services';
import { useTranslation } from 'react-i18next';
//Models
import { MenusResponse } from '../../models/responses/menus.response';

export default function Tickets() {

    //Hooks
    const toast = useRef<Toast>(null);
    const { SendGetRequest, getResponse, loadingGet } = useGet<MenusResponse[]>();
    //Translate
    const { t } = useTranslation();
    const GlobalSearch = t("placeholders.search");
    const TableTitle = t('tickets.tableTitle');
    const TableHeaderNew = t('tickets.labels.new');
    const title = t('tickets.labels.title');
    const project = t('tickets.labels.project');
    const priority = t('tickets.labels.priority');
    const type = t('tickets.labels.type');
    const status = t('tickets.labels.status');
    const dateCreated = t('tickets.labels.dateCreated');
    const dateUpdated = t('tickets.labels.dateUpdated');

    //Table Filters
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    });
    const [representatives] = useState([
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ]);
    const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);
    const getSeverity = (status) => {
        switch (status) {
            case 'unqualified':
                return 'danger';

            case 'qualified':
                return 'success';

            case 'new':
                return 'info';

            case 'negotiation':
                return 'warning';

            case 'renewal':
                return null;
        }
    };

    const representativeBodyTemplate = (rowData) => {
        const representative = rowData.representative;

        return (
            <div className="flex align-items-center gap-2">
                <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
                <span>{representative.name}</span>
            </div>
        );
    };

    const representativesItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
                <span>{option.name}</span>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    const statusItemTemplate = (option) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const representativeRowFilterTemplate = (options) => {
        return (
            <MultiSelect
                value={options.value}
                options={representatives}
                itemTemplate={representativesItemTemplate}
                onChange={(e) => options.filterApplyCallback(e.value)}
                optionLabel="name"
                placeholder="Any"
                className="p-column-filter"
                maxSelectedLabels={1}
                style={{ minWidth: '10rem' }}
            />
        );
    };

    const statusRowFilterTemplate = (options) => {
        console.log(options)
        return (
            <Dropdown value={options.value} options={statuses} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '10rem' }} />
        );
    };

    const dateFilterTemplate = (options) => {
        console.log(options)
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const dateBodyTemplate = (options) => {
        const date = new Date(options.date)
        return date.toLocaleDateString("en-US");
    }

    //Table Search Filter
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        const _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const TableHeader = () => {
        return (
            <div className="flex flex-wrap justify-content-between align-items-center gap-2 p-2" >
                {/* Table Title */}
                <span className='text-2xl text-white'>{TableTitle}</span>
                {/* Filter */}
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={GlobalSearch} />
                </span>
                {/* Add new */}
                <Button icon="pi pi-plus" severity='success'>
                    <span className='pl-2'>{TableHeaderNew}</span>
                </Button>
            </div>
        )
    }

    return (
        <>
            {loadingGet
                ?
                <div className='flex h-full w-full justify-content-center align-items-center'>
                    <ProgressSpinner />
                </div>
                :
                <>
                    <Toast ref={toast} />
                    <div className="card" style={{ backgroundColor: "#17212f5D" }}>
                        <DataTable value={[
                            {
                                id: 1000,
                                name: 'James Butt',
                                country: {
                                    name: 'Algeria',
                                    code: 'dz'
                                },
                                company: 'Benton, John B Jr',
                                date: new Date(),
                                status: 'unqualified',
                                verified: true,
                                activity: 17,
                                representative: {
                                    name: 'Ioni Bowcher',
                                    image: 'ionibowcher.png'
                                },
                                balance: 70663
                            },]}
                            paginator
                            rows={10}
                            dataKey="id"
                            size={'small'}
                            filters={filters}
                            filterDisplay="row"
                            header={TableHeader}
                            loading={loadingGet}
                            globalFilterFields={['name', 'country.name', 'representative.name', 'status']}
                            emptyMessage="No customers found."
                            selectionMode="single"
                            onSelectionChange={(e) => console.log(e.value)}>
                            <Column field="name" header={title} filter filterPlaceholder="Search by name" style={{ minWidth: '18rem' }} />
                            <Column header={project} filterField="representative" showFilterMenu={false} filterMenuStyle={{ width: '11rem' }} style={{ maxWidth: '11rem' }}
                                body={representativeBodyTemplate} filter filterElement={representativeRowFilterTemplate} />
                            <Column field="status" header={type} showFilterMenu={false} filterMenuStyle={{ width: '5rem' }} style={{ maxWidth: '11rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                            <Column field="status" header={priority} showFilterMenu={false} filterMenuStyle={{ width: '5rem' }} style={{ maxWidth: '11rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                            <Column field="status" header={status} showFilterMenu={false} filterMenuStyle={{ width: '5rem' }} style={{ maxWidth: '11rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                            <Column field="date" dataType="date" header={dateCreated} showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ maxWidth: '11rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                            <Column field="date" dataType="date" header={dateUpdated} showFilterMenu={false} filterMenuStyle={{ width: '14rem' }} style={{ maxWidth: '11rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
                        </DataTable>
                    </div>
                </>
            }

        </>
    )
}
