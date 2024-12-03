import React, { useEffect, useState } from 'react';

const Todo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiurl = "https://todo-backend-mern-q3fc.onrender.com";

    const handelSubmit = () => {
        if (title.trim() !== ' ' && description.trim() !== ' ') {
            fetch(apiurl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((response) => {
                if (response.ok) {
                    setTodos([...todos, { title, description }]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added Successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 2000);
                } else {
                    setError("Unable to create Todo Items");
                }
            });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiurl + "/todos")
            .then((response) => response.json())
            .then((response) => {
                setTodos(response);
            });
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== ' ' && editDescription.trim() !== ' ') {
            fetch(apiurl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((response) => {
                if (response.ok) {
                    const updatedTodos = todos.map((item) => {
                        if (item._id === editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    });
                    setTodos(updatedTodos);
                    setEditTitle("");
                    setEditDescription("");
                    setMessage("Item updated Successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 2000);
                    setEditId(-1);
                } else {
                    setError("Unable to update Todo Item");
                }
            });
        }
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handelEditCancel = () => {
        setEditId(-1);
    };

    const handelDelete = (id) => {
        if (window.confirm("Are you sure want to delete?")) {
            fetch(apiurl + "/todos/" + id, { method: "DELETE" }).then(() => {
                const updatedTodos = todos.filter((item) => item._id !== id);
                setTodos(updatedTodos);
            });
        }
    };

    return (
        <div className="container my-5">
            <div className="row">
                <h1 className="text-center mb-4 text-primary">Todo App</h1>
            </div>
            <div className="row">
                <h3 className="mb-3">Add Item</h3>
                {message && <div className="alert alert-success">{message}</div>}
                <div className="form-group d-flex gap-3 mb-3">
                    <input
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter the title"
                        type="text"
                    />
                    <input
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter the description"
                        type="text"
                    />
                    <button className="btn btn-primary" onClick={handelSubmit}>
                        Add
                    </button>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
            </div>
            <div className="row mt-4">
                <h3>Tasks</h3>
                <div className="col-md-8">
                    <ul className="list-group shadow-sm">
                        {todos.map((item) => (
                            <li className="list-group-item d-flex align-items-center justify-content-between my-2">
                                <div className="d-flex flex-column">
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <span className="fw-bold text-primary">{item.title}</span>
                                            <span className="text-muted">{item.description}</span>
                                        </>
                                    ) : (
                                        <div className="form-group d-flex gap-2">
                                            <input
                                                className="form-control"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                placeholder="Edit the title"
                                                type="text"
                                            />
                                            <input
                                                className="form-control"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                placeholder="Edit the description"
                                                type="text"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <button className="btn btn-warning btn-sm" onClick={() => handleEdit(item)}>
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handelDelete(item._id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-success btn-sm" onClick={handleUpdate}>
                                                Save
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={handelEditCancel}>
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Todo;
