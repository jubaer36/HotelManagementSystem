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
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [originalEmployeeData, setOriginalEmployeeData] = useState(null);

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filters, setFilters] = useState({
        FullName: '',
        Phone: '',
        Email: '',
        Role: '',
        Status: ''
    });

    const applyFilters = () => {
        Axios.post("http://localhost:3001/filter-employees", {
            hotelID,
            ...filters
        })
        .then((res) => {
            const data = res.data.map(emp => ({
                ...emp,
                FullName: `${emp.FirstName} ${emp.LastName}`
            }));
            setEmployees(data);
            setShowFilterModal(false);
        })
        .catch((err) => {
            console.error("Filter failed:", err);
            alert("Error filtering employees.");
        });
    };
    



    const handleCancelEdit = () => {
        if (originalEmployeeData) {
            setEmployees(prev =>
                prev.map(emp =>
                    emp.EmpID === originalEmployeeData.EmpID
                        ? { ...originalEmployeeData }
                        : emp
                )
            );
        }
        setEditingEmployeeId(null);
        setOriginalEmployeeData(null);
    };

    
    const handleEditChange = (empID, field, value) => {
        if (field === "Role" && value.toLowerCase() === "manager") {

            alert("You are not allowed to update the role to Manager."); // Replace with toast if needed
            setEmployees(prev =>
            prev.map(emp =>
                emp.EmpID === empID
                    ? { ...emp, [field]: originalEmployeeData[field] }
                    : emp
            )
        );
        return;
        }

        if(field === "Role")
        {
            value = value.toLowerCase();
        }
    
        setEmployees(prev =>
            prev.map(emp =>
                emp.EmpID === empID ? { ...emp, [field]: value } : emp
            )
        );
    };

    
    
    const handleUpdate = (employee) => {
        const updatedData = {
            empID: employee.EmpID,
            firstName: employee.FullName.split(" ")[0],
            lastName: employee.FullName.split(" ")[1] || "",
            phone: employee.Phone,
            email: employee.Email,
            deptName: employee.DeptName,
            hourlyPay: parseFloat(employee.hourly_pay),
            role: employee.Role,
            workingStatus: employee.working_status,
            hiredDate: new Date(employee.HiredDate).toISOString().split("T")[0],
            hotelID: hotelID,
        };
        // console.log("Updated Data:", updatedData);
    
        Axios.post("http://localhost:3001/update-employee", updatedData)
            .then(() => {
                alert("Employee updated successfully.");
                setEditingEmployeeId(null);
                fetchEmployees();
            })
            .catch((err) => {
                console.error("Update failed:", err);
                alert("Failed to update employee.");
            });
    };
    

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
        {
            header: 'Update',
            cell: ({ row }) => {
                const isEditing = row.original.EmpID === editingEmployeeId;
        
                return (
                    isEditing ? (
                        <div className="action-buttons">
                            <button
                                className="save-button"
                                onClick={() => handleUpdate(row.original)}
                            >
                                Save
                            </button>
                            <button
                                className="cancel-button"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            className="update-button"
                            onClick={() => {
                                setOriginalEmployeeData({ ...row.original });
                                setEditingEmployeeId(row.original.EmpID);
                            }}
                        >
                            Update
                        </button>
                    )
                );
            },
            size: 160,
        },
        
        
    ], [editingEmployeeId]);

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
            HiredDate: new Date().toISOString().split('T')[0],
            Address: { city: '', state: '' }   // ✅ added Address
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
                    <h1>Employee Table</h1>
                <div className="header-section">
                <button className="add-button" onClick={handleAddEmployee}>+ Add New Employee</button>
                <button className="filter-button" onClick={() => setShowFilterModal(true)}>Filter</button>
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
    {table.getRowModel().rows.map(row => {
        const isEditing = row.original.EmpID === editingEmployeeId;

        return (
            <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                    const columnId = cell.column.id;
                    const value = row.original[columnId];

                    return (
                        <td key={cell.id}>
                            {isEditing && [
                                "FullName", "DeptName", "Phone",
                                "Email", "hourly_pay", "Role",
                                "HiredDate", "working_status"
                            ].includes(columnId) ? (
                                columnId === "DeptName" ? (
                                    <select
                                        value={value}
                                        onChange={(e) =>
                                            handleEditChange(row.original.EmpID, columnId, e.target.value)
                                        }
                                    >
                                        {departments.map((d) => (
                                            <option key={d.DeptID} value={d.DeptName}>
                                                {d.DeptName}
                                            </option>
                                        ))}
                                    </select>
                                ) : columnId === "Role" ? (
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) =>
                                            handleEditChange(row.original.EmpID, columnId, e.target.value)
                                        }
                                    />
                                )
                                 : columnId === "working_status" ? (
                                    <select
                                        value={value}
                                        onChange={(e) =>
                                            handleEditChange(row.original.EmpID, columnId, e.target.value)
                                        }
                                    >
                                        <option value="Working">Working</option>
                                        <option value="Not Working">Inactive</option>
                                    </select>
                                ) : (
                                    <input
                                        type={columnId === "hourly_pay" ? "number" : columnId === "HiredDate" ? "date" : "text"}
                                        value={value}
                                        onChange={(e) =>
                                            handleEditChange(row.original.EmpID, columnId, e.target.value)
                                        }
                                    />
                                )
                            ) : (
                                flexRender(cell.column.columnDef.cell, cell.getContext())
                            )}
                        </td>
                    );
                })}
            </tr>
        );
    })}
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

{showFilterModal && (
    <div className="filter-modal">
        <h3>Filter Employees</h3>
        <label>Full Name:</label>
        <input type="text" value={filters.FullName} onChange={(e) => setFilters({ ...filters, FullName: e.target.value })} />

        <label>Phone:</label>
        <input type="text" value={filters.Phone} onChange={(e) => setFilters({ ...filters, Phone: e.target.value })} />

        <label>Email:</label>
        <input type="text" value={filters.Email} onChange={(e) => setFilters({ ...filters, Email: e.target.value })} />

        <label>Role:</label>
        <input type="text" value={filters.Role} onChange={(e) => setFilters({ ...filters, Role: e.target.value })} />

        <label>Status:</label>
        <select value={filters.Status} onChange={(e) => setFilters({ ...filters, Status: e.target.value })}>
            <option value="">All</option>
            <option value="Working">Working</option>
            <option value="Not Working">Inactive</option>
        </select>

        <div className="filter-actions">
            <button onClick={applyFilters}>Apply</button>
            <button onClick={() => setShowFilterModal(false)}>Cancel</button>
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
                            <div className="input-group">
    <label>City</label>
    <input
        type="text"
        placeholder="City"
        value={newEmployee.Address?.city || ''}
        onChange={e => setNewEmployee({
            ...newEmployee,
            Address: { ...newEmployee.Address, city: e.target.value }
        })}
    />
</div>

<div className="input-group">
    <label>State</label>
    <input
        type="text"
        placeholder="State"
        value={newEmployee.Address?.state || ''}
        onChange={e => setNewEmployee({
            ...newEmployee,
            Address: { ...newEmployee.Address, state: e.target.value }
        })}
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