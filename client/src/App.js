import React, { useState, useEffect } from "react";
import axios from "axios";
import "datatables.net-dt/css/jquery.dataTables.css";
// import $ from "jquery";
import "datatables.net";
import { CSVLink } from "react-csv"; // Import CSVLink
import DataTable from "react-data-table-component";

function App() {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [contacts, setContacts] = useState([]);
  const [errors, setErrors] = useState({});

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Phone",
      selector: "phone",
      sortable: true,
    },
  ];

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      if (!contact.name) {
        setErrors({ name: "Name is required" });
        return;
      }

      if (!contact.email) {
        setErrors({ email: "Email is required" });
        return;
      }

      if (!contact.phone) {
        setErrors({ phone: "Phone is required" });
        return;
      }

      await axios.post("http://localhost:5000/api/contacts", contact);

      setContact({
        name: "",
        email: "",
        phone: "",
      });

      fetchContacts();
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={contact.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="text-danger">{errors.name}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={contact.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="text-danger">{errors.email}</div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone:</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={contact.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && (
                    <div className="text-danger">{errors.phone}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary">
                  Add Contact
                </button>
                <CSVLink
                  data={contacts} // The data you want to export
                  filename={"contacts.csv"} // The name of the CSV file
                  className="btn btn-primary"
                  target="_blank"
                >
                  Export CSV
                </CSVLink>
              </form>
            </div>
          </div>
        </div>
      </header>
      <div className="container mt-5">
        <div id="contactsTable">
          <DataTable columns={columns} data={contacts} pagination />
        </div>
      </div>
    </div>
  );
}

export default App;
