import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Input, Select, Space, Card, Alert, Avatar } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { getAllUsers } from '../services/api';

const { Title } = Typography;
const { Option } = Select;

const UsersPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State untuk Filter & Paginasi
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const fetchUsers = async (page, pageSize, search, role) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllUsers(page, pageSize, search, role);
            const result = response.data.data; // Sesuaikan dengan struktur JSON backend Anda

            setData(result.data);
            setPagination({
                current: result.current_page,
                pageSize: pageSize,
                total: result.total_items,
            });
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Gagal memuat data pengguna.');
        } finally {
            setLoading(false);
        }
    };

    // Effect untuk memuat data saat filter berubah
    useEffect(() => {
        // Reset ke halaman 1 setiap kali filter berubah
        fetchUsers(1, pagination.pageSize, searchText, roleFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, roleFilter]);

    // Handler ganti halaman tabel
    const handleTableChange = (newPagination) => {
        fetchUsers(newPagination.current, newPagination.pageSize, searchText, roleFilter);
    };

    const columns = [
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    {text}
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Peran',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                let color = 'default';
                if (role === 'farmer') color = 'green';
                if (role === 'worker') color = 'blue';
                if (role === 'driver') color = 'orange';
                return <Tag color={color}>{role ? role.toUpperCase() : '-'}</Tag>;
            },
        },
        {
            title: 'No. Telepon',
            dataIndex: 'phone_number',
            key: 'phone_number',
            render: (phone) => phone || '-',
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (
                <Tag color={isActive ? 'success' : 'error'}>
                    {isActive ? 'AKTIF' : 'NONAKTIF'}
                </Tag>
            ),
        },
        {
            title: 'Terdaftar',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString('id-ID'),
        },
    ];

    return (
        <Card>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <Title level={3} style={{ margin: 0 }}>Manajemen Pengguna</Title>

                <Space>
                    {/* Filter Peran */}
                    <Select
                        placeholder="Filter Peran"
                        style={{ width: 150 }}
                        allowClear
                        onChange={(value) => setRoleFilter(value || '')}
                    >
                        <Option value="farmer">Petani</Option>
                        <Option value="worker">Pekerja</Option>
                        <Option value="driver">Driver</Option>
                        <Option value="general">Umum</Option>
                    </Select>

                    {/* Pencarian */}
                    <Input
                        placeholder="Cari Nama / Email"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchText(e.target.value)} // Bisa ditambahkan debounce jika perlu
                        style={{ width: 250 }}
                    />
                </Space>
            </div>

            {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: 16 }} />}

            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                bordered
                scroll={{ x: 800 }}
            />
        </Card>
    );
};

export default UsersPage;