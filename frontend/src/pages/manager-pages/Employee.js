import React, { useState, useEffect, useMemo } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import Navbar from "../../components/Navbar";
import "./Employee.css";

const Employee = () => {
    const navigate = useNavigate();
    const hotelID = localStorage.getItem("hotelID");
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newEmployee, setNewEmployee] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const columns = useMemo(() => [
        {
            accessorKey: 'FullName',
            header: 'Full Name',
            size: 200,
        },
        {
            accessorKey: 'DeptName',
            header: 'Department',
            size: 150,
        },
        {
            accessorKey: 'Phone',
            header: 'Phone',
            size: 150,
        },
        {
            accessorKey: 'Email',
            header: 'Email',
            size: 200,
        },
        {
            accessorKey: 'hourly_pay',
            header: 'Hourly Pay',
            cell: ({ getValue }) => `$${getValue()}`,
            size: 120,
        },
        {
            accessorKey: 'Role',
            header: 'Role',
            size: 150,
        },
        {
            accessorKey: 'HiredDate',
            header: 'Hired Date',
            cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
            size: 120,
        },
        {
            accessorKey: 'working_status',
            header: 'Status',
            cell: ({ row }) => (
                <span className={`status-badge ${row.original.working_status.toLowerCase()}`}>
                    {row.original.working_status}
                </span>
            ),
            size: 120,
        },
        {
            header: 'Remove',
            cell: ({ row }) => (
                <button
                    className="remove-button"
                    onClick={() => confirmRemoveEmployee(row.original)}
                >
                    Remove  
                </button>
            ),
            size: 120,
        },
    ], []);

    const table = useReactTable({
        data: employees,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    const [showPopupAdd, setShowPopupAdd] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [employeeToRemove, setEmployeeToRemove] = useState(null);
        
    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const confirmRemoveEmployee = (employee) => {
        setEmployeeToRemove(employee);
        setShowConfirmation(true);
    };

    const removeEmployee = () => {
        if (employeeToRemove) {
            Axios.post("http://localhost:3001/remove-employee", { empID: employeeToRemove.EmpID })
                .then(() => {
                    alert("Employee removed successfully.");
                    fetchEmployees(); // Refresh the list
                })
                .catch((error) => {
                    console.error("Error removing employee:", error);
                    alert("Failed to remove employee.");
                })
                .finally(() => {
                    setShowConfirmation(false);
                    setEmployeeToRemove(null);
                });
        }
    };  

    const fetchEmployees = () => {
        Axios.post("http://localhost:3001/employees", { hotelID })
            .then((response) => {
                const enhancedData = response.data.map(emp => ({
                    ...emp,
                    FullName: `${emp.FirstName} ${emp.LastName}`
                }));
                setEmployees(enhancedData);
            })
            .catch(console.error);
    };

    const fetchDepartments = () => {
        Axios.post("http://localhost:3001/departments", { hotelID })
            .then(response => setDepartments(response.data))
            .catch(console.error);
    };

    const handleAddEmployee = () => {
        setNewEmployee({
            EmpID: 'new',
            FirstName: '',
            LastName: '',
            Phone: '',
            Email: '',
            DeptID: '',
            hourly_pay: '',
            Role: '',
            working_status: 'Working',
            HiredDate: new Date().toISOString().split('T')[0]
        });
        setFormErrors({});
    };

    const validateForm = () => {
        const errors = {};
        if (!newEmployee.FirstName) errors.FirstName = "First name is required";
        if (!newEmployee.LastName) errors.LastName = "Last name is required";
        if (!newEmployee.Phone) errors.Phone = "Phone is required";
        if (!newEmployee.DeptID) errors.DeptID = "Department is required";
        if (!newEmployee.hourly_pay) errors.hourly_pay = "Hourly pay is required";
        if (!newEmployee.Role) errors.Role = "Role is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        Axios.post("http://localhost:3001/add-employee", {
            deptID: newEmployee.DeptID,
            firstName: newEmployee.FirstName,
            lastName: newEmployee.LastName,
            phone: newEmployee.Phone,
            email: newEmployee.Email,
            hourlyPay: parseFloat(newEmployee.hourly_pay),
            workingStatus: newEmployee.working_status,
            role: newEmployee.Role,
            hiredDate: newEmployee.HiredDate,
            address: newEmployee.Address ? JSON.stringify(newEmployee.Address) : null
        }).then(() => {
            fetchEmployees();
            setNewEmployee(null);
            setFormErrors({});
        }).catch(err => {
            console.error("Error adding employee:", err);
            alert("Failed to add employee. Please check the form values.");
        });
    };

    return (
        <div className="employee-container">
            <Navbar />
            <div className="content-wrapper">
                <div className="header-section">
                    <h1>Employee Table</h1>
                    <button className="add-button" onClick={handleAddEmployee}>
                        + Add New Employee
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} style={{ width: header.column.columnDef.size }}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="pagination-controls">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </button>
                        <span>
                            Page {table.getState().pagination.pageIndex + 1} of{' '}
                            {table.getPageCount()}
                        </span>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {showConfirmation && employeeToRemove && (
                    <div className="confirmation-popup">
                        <div className="confirmation-content">
                            <p>Are you sure you want to remove {employeeToRemove.FullName}?</p>
                            <div className="confirmation-buttons">
                                <button className="confirm-button" onClick={removeEmployee}>Yes</button>
                                <button className="cancel-button" onClick={() => setShowConfirmation(false)}>No</button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Add Employee Form */}
                {newEmployee && (
                    <div className="add-employee-form">
                        <div className="form-header">
                            <h3>Add New Employee</h3>
                            <button
                                className="close-button"
                                onClick={() => setNewEmployee(null)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="form-grid">
                            <div className="input-group">
                                <label>First Name *</label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    value={newEmployee.FirstName}
                                    onChange={e => setNewEmployee({...newEmployee, FirstName: e.target.value})}
                                    className={formErrors.FirstName ? 'error' : ''}
                                />
                                {formErrors.FirstName && <span className="error-message">{formErrors.FirstName}</span>}
                            </div>

                            <div className="input-group">
                                <label>Last Name *</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    value={newEmployee.LastName}
                                    onChange={e => setNewEmployee({...newEmployee, LastName: e.target.value})}
                                    className={formErrors.LastName ? 'error' : ''}
                                />
                                {formErrors.LastName && <span className="error-message">{formErrors.LastName}</span>}
                            </div>

                            <div className="input-group">
                                <label>Phone *</label>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={newEmployee.Phone}
                                    onChange={e => setNewEmployee({...newEmployee, Phone: e.target.value})}
                                    className={formErrors.Phone ? 'error' : ''}
                                />
                                {formErrors.Phone && <span className="error-message">{formErrors.Phone}</span>}
                            </div>

                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    value={newEmployee.Email}
                                    onChange={e => setNewEmployee({...newEmployee, Email: e.target.value})}
                                />
                            </div>

                            <div className="input-group">
                                <label>Department *</label>
                                <select
                                    value={newEmployee.DeptID}
                                    onChange={e => setNewEmployee({...newEmployee, DeptID: e.target.value})}
                                    className={formErrors.DeptID ? 'error' : ''}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.DeptID} value={dept.DeptID}>{dept.DeptName}</option>
                                    ))}
                                </select>
                                {formErrors.DeptID && <span className="error-message">{formErrors.DeptID}</span>}
                            </div>

                            <div className="input-group">
                                <label>Hourly Pay ($) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={newEmployee.hourly_pay}
                                    onChange={e => setNewEmployee({...newEmployee, hourly_pay: e.target.value})}
                                    className={formErrors.hourly_pay ? 'error' : ''}
                                />
                                {formErrors.hourly_pay && <span className="error-message">{formErrors.hourly_pay}</span>}
                            </div>

                            <div className="input-group">
                                <label>Role *</label>
                                <select
                                    value={newEmployee.Role}
                                    onChange={e => setNewEmployee({...newEmployee, Role: e.target.value})}
                                    className={formErrors.Role ? 'error' : ''}
                                >
                                    <option value="">Select Role</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Contractor">Contractor</option>
                                </select>
                                {formErrors.Role && <span className="error-message">{formErrors.Role}</span>}
                            </div>

                            <div className="input-group">
                                <label>Hire Date</label>
                                <input
                                    type="date"
                                    value={newEmployee.HiredDate}
                                    onChange={e => setNewEmployee({...newEmployee, HiredDate: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button className="cancel-button" onClick={() => setNewEmployee(null)}>
                                Cancel
                            </button>
                            <button className="save-button" onClick={handleSave}>
                                Save Employee
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employee;