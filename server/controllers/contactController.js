//@desc Get all contacts
// @route GET /api/contacts
// @access Public

const getContacts = (req, res) => {
  res.status(200).json({ message: "Get all contacts" });
};

//@desc Create a new contact
// @route POST /api/contacts
// @access Public

const createContact = (req, res) => {
  // You can access the data from the request body using req.body
  const newContact = req.body;

  // Here, you can add code to save the new contact to your database
  // For example, you can use a database library like Mongoose for MongoDB

  res.status(201).json({ message: "Create contact", contact: newContact });
};

//@desc Get a specific contact by ID
// @route GET /api/contacts/:id
// @access Public

const getContactById = (req, res) => {
  const contactId = req.params.id;
  res.status(200).json({ message: `Get contact for ID ${contactId}` });
};

//@desc Update a specific contact by ID
// @route PUT /api/contacts/:id
// @access Public

const updateContactById = (req, res) => {
  const contactId = req.params.id;
  // You can access the updated data from the request body using req.body

  // Here, you can add code to update the contact with the given ID in your database

  res.status(200).json({ message: `Update contact for ID ${contactId}` });
};

//@desc Delete a specific contact by ID
// @route DELETE /api/contacts/:id
// @access Public

const deleteContactById = (req, res) => {
  const contactId = req.params.id;
  // Here, you can add code to delete the contact with the given ID from your database

  res.status(200).json({ message: `Delete contact for ID ${contactId}` });
};

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContactById,
  deleteContactById,
};
