import React, { useEffect, useState } from 'react'
//components
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
//hooks
import { useGet } from "../../services/api_services";
import { User } from '../../models/responses/users.response';
import { Link } from 'react-router-dom';
import { Avatar } from 'primereact/avatar';
import { useTranslation } from 'react-i18next';

export default function Users() {
    const { SendGetRequest, getResponse } = useGet<User[]>();
    const [users, setUsers] = useState<User[]>([]);
    const { t } = useTranslation();

    //Send Request
    useEffect(() => {
        SendGetRequest("v1/users");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //Get Response
    useEffect(() => {
        if (getResponse) {
            setUsers(getResponse);
        }
    }, [getResponse]);

    const header = (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2" >
            <span className='text-2xl text-white'>{t("UserTableTitle")}</span>
            <Link to={"/Users/New"}>
                <Button icon="pi pi-plus" severity='success'>
                    <span className='pl-2'>{t("UserTableHeaderNewUser")}</span>
                </Button>
            </Link>
        </div>
    );

    const imageBodyTemplate = (rowData) => {
        if (rowData.photo) {
            return <Avatar image="/images/avatar/amyelsner.png" size="normal" shape="circle" />;
        } else {
            return <Avatar icon="pi pi-user" size="large" shape="circle" />;
        }

    };

    const actionsBodyTemplate = (rowData) => {
        return <>
            <div className='flex gap-2'>
                <Link to={"/EditUser?id=" + rowData.id}>
                    <Button icon="pi pi-pencil" severity='warning' aria-label="Bookmark"></Button>
                </Link>
                <Link to={"/DeleteUsser?id=" + rowData.id}>
                    <Button icon="pi pi-trash" severity='danger' aria-label="Bookmark"></Button>
                </Link>
            </div>
        </>
    }

    return (
        <div className="card" style={{ backgroundColor: "#17212f5D" }}>
            <DataTable value={users} header={header}
                style={{ backgroundColor: "#17212f5D" }}
                dataKey="id">
                <Column style={{ width: '5rem' }} />
                <Column field="id" header={t("UserTableHeaderId")} sortable />
                <Column body={imageBodyTemplate} header={t("UserTableHeaderPhoto")} />
                <Column field="username" header={t("UserTableHeaderUsername")} sortable />
                <Column field="firstName" header={t("UserTableHeaderFirstName")} sortable />
                <Column field="lastName" header={t("UserTableHeaderLastName")} sortable />
                <Column field="email" header={t("UserTableHeaderEmail")} sortable />
                <Column field="rolId" header={t("UserTableHeaderRol")} sortable />
                <Column header={t("UserTableHeaderActions")} body={actionsBodyTemplate} sortable />
            </DataTable>
        </div>
    )
}
